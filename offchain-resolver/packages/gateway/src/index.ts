import { makeApp } from './server';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { ethers } from 'ethers';
import { JSONDatabase } from './json';
import { Database } from './server';
import { ContractDatabase, abi } from './contract';
const program = new Command();
program
  .requiredOption(
    '-k --private-key <key>',
    'Private key to sign responses with. Prefix with @ to read from a file'
  )
  .requiredOption('-d --data <file>', 'JSON file to read data from')
  .option('-t --ttl <number>', 'TTL for signatures', '300')
  .option('-p --port <number>', 'Port number to serve on', '8080');
program.parse(process.argv);
const options = program.opts();
let privateKey = options.privateKey;
if (privateKey.startsWith('@')) {
  privateKey = ethers.utils.arrayify(
    readFileSync(privateKey.slice(1), { encoding: 'utf-8' })
  );
}
const address = ethers.utils.computeAddress(privateKey);
const signer = new ethers.utils.SigningKey(privateKey);
const db = JSONDatabase.fromFilename(options.data, parseInt(options.ttl));

const opProvider = new ethers.providers.JsonRpcProvider("https://sepolia.optimism.io", {
  chainId: 11155420,
  name: "OP Sepolia",
});
const opContract =  new ethers.Contract("0x6157A59052d62183cd3D5726C2cA0bb8b049AE1F", abi, opProvider);
const op = new ContractDatabase(opContract);

const zircuitProvider = new ethers.providers.JsonRpcProvider("https://zircuit1-testnet.p2pify.com", {
  chainId: 48899,
  name: "zircuit",
});
const zircuitContract =  new ethers.Contract("0xc2A955E3cDf1a168c54683aa315eB9A536f1a62b", abi, zircuitProvider);
const zircuit = new ContractDatabase(zircuitContract);


// make a map of string to database
const dbMap = new Map<string, Database>();
dbMap.set('file', db);
dbMap.set('op', op);
dbMap.set('zircuit', zircuit);
const app = makeApp(signer, '/', dbMap);
console.log(`Serving on port ${options.port} with signing address ${address}`);
app.listen(parseInt(options.port));

module.exports = app;
