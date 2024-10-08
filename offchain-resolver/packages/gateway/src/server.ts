import { Server } from '@chainlink/ccip-read-server';
import { ethers, BytesLike } from 'ethers';
import { hexConcat, Result } from 'ethers/lib/utils';
import { ETH_COIN_TYPE } from './utils';
import cors from 'cors';
import { abi as IResolverService_abi } from '@ensdomains/offchain-resolver-contracts/artifacts/contracts/OffchainResolver.sol/IResolverService.json';
import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json';
const Resolver = new ethers.utils.Interface(Resolver_abi);

interface DatabaseResult {
  result: any[];
  ttl: number;
}

type PromiseOrResult<T> = T | Promise<T>;

export interface Database {
  addr(
    name: string,
    coinType: number
  ): PromiseOrResult<{ addr: string; ttl: number }>;
  text(
    name: string,
    key: string
  ): PromiseOrResult<{ value: string; ttl: number }>;
  contenthash(
    name: string
  ): PromiseOrResult<{ contenthash: string; ttl: number }>;
}

function decodeDnsName(dnsname: Buffer) {
  const labels = [];
  let idx = 0;
  while (true) {
    const len = dnsname.readUInt8(idx);
    if (len === 0) break;
    labels.push(dnsname.slice(idx + 1, idx + len + 1).toString('utf8'));
    idx += len + 1;
  }
  return labels.join('.');
}

const queryHandlers: {
  [key: string]: (
    db: Database,
    name: string,
    args: Result
  ) => Promise<DatabaseResult>;
} = {
  'addr(bytes32)': async (db, name, _args) => {
    const { addr, ttl } = await db.addr(name, ETH_COIN_TYPE);
    return { result: [addr], ttl };
  },
  'addr(bytes32,uint256)': async (db, name, args) => {
    const { addr, ttl } = await db.addr(name, args[0]);
    return { result: [addr], ttl };
  },
  'text(bytes32,string)': async (db, name, args) => {
    const { value, ttl } = await db.text(name, args[0]);
    return { result: [value], ttl };
  },
  'contenthash(bytes32)': async (db, name, _args) => {
    const { contenthash, ttl } = await db.contenthash(name);
    return { result: [contenthash], ttl };
  },
};

async function query(
  db: Database,
  name: string,
  data: string
): Promise<{ result: BytesLike; validUntil: number }> {
  // Parse the data nested inside the second argument to `resolve`
  const { signature, args } = Resolver.parseTransaction({ data });

  if (ethers.utils.nameprep(name) !== name) {
    throw new Error('Name must be normalised');
  }

  if (ethers.utils.namehash(name) !== args[0]) {
    throw new Error('Name does not match namehash');
  }

  const handler = queryHandlers[signature];
  if (handler === undefined) {
    throw new Error(`Unsupported query function ${signature}`);
  }

  console.log('QUERY:', name, signature, args);

  const { result, ttl } = await handler(db, name, args.slice(1));

  console.log('RESULT:', result, ttl);

  const encodeResult = Resolver.encodeFunctionResult(signature, result);

  console.log('ENCODE_RESULT:', encodeResult);

  return {
    result: encodeResult,
    validUntil: Math.floor(Date.now() / 1000 + ttl),
  };
}

  export function makeServer(signer: ethers.utils.SigningKey, dbMap: Map<string, Database>) {
  // export function makeServer(signer: ethers.utils.SigningKey, db: Database) {
  const server = new Server();
  server.add(IResolverService_abi, [
    {
      type: 'resolve',
      func: async ([encodedName, data]: Result, request) => {
        const name = decodeDnsName(Buffer.from(encodedName.slice(2), 'hex'));
        console.log('resolve', name, data, request);

        // split the string on periods and get the third to last element
        const subdomain = name.split('.').slice(-3)[0];
        console.log('subdomain', subdomain);

        const db = dbMap.get(subdomain);

        if (!db) {
           // throw new Error(`Database for subdomain ${subdomain} not found.`);
           return [ethers.utils.hexlify(0), 0, '0x'];
        }

        // Query the database
        const { result, validUntil } = await query(db, name, data);

        console.log('QUERY_RESULT:', result, validUntil);

        // Hash and sign the response
        let messageHash = ethers.utils.solidityKeccak256(
          ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
          [
            '0x1900',
            request?.to,
            validUntil,
            ethers.utils.keccak256(request?.data || '0x'),
            ethers.utils.keccak256(result),
          ]
        );
        const sig = signer.signDigest(messageHash);
        const sigData = hexConcat([sig.r, sig._vs]);

        // Return the result
        console.log('SIG_RESULT:', result, validUntil, sigData);
        return [result, validUntil, sigData];
      },
    },
  ]);
  return server;
}

export function makeApp(
  signer: ethers.utils.SigningKey,
  path: string,
  dbMap: Map<string, Database>
) {
  const app = makeServer(signer, dbMap).makeApp(path);
  app.use(cors());
  return app;
}
