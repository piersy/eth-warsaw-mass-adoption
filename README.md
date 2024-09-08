# Social ENS

- [Presentation](https://docs.google.com/presentation/d/1CLFpoRBrp1Bbisu2Ri1YIvz8tq1I4X7_S5MVwPbe5Xw/edit?usp=sharing)
- [Demo](https://www.loom.com/share/a8ff235c08e74ea09717b2123be1db0d?sid=50a65ef0-1f03-4865-ae1a-97f5a9ecddbc)

# Team Members
Alec Schaefer
Martin Volpe
Paul Lange
Piers Powlesland

## Running the system

Create a private key  PRIVATE_KEY and associated address. The private key will
be used by the gateway for signing responses. The associated address ADDRESS
will be passed to the resolver contract so that it can verify responses from
the gateway.

```sh
# run local chain
# Substitute line 65 of `offchain-resolver/packages/contracts/hardhat.config.js` with ADDRESS 
export REMOTE_GATEWAY=http://localhost:3001
cd offchain_resolver/
yarn
yarn build
yarn start:node

#run gateway in new terminal
yarn start:gateway -k PRIVATE_KEY -d soco.eth.json

# run proxy in new temrinal
export PROXY_TARGET=http://localhost:8000
cd ../proxy
yarn
node server.js

# run frontend in new terminal
cd ../buidlguidl
mkdir .git
yarn
yarn start
```

Navigate to the frontend.

## Why the proxy?

We ran into lots of problems around CORS and HTTPS when using the gateway
directly from the frontend. To work around this we created a simple proxy that
forwards requests to the gateway using a local address.

## Storage proofs

Pushing ENS data storage to L2's opens new exciting possibilities for further
decentralizing the ENS system, but also opens up potential problems around data
availability and timeliness. For example, the resolver contract on Ethereum
might require that data is proved to be available on a L2 or that information
provided is not older than a certain amount of blocks.

The solution to this problem are storage proofs. With systems like Herodotus it
is possible to create an efficient proof that the contract on the L2 contains a
certain entry or that an entry was available on a certain block height.

Implementation would mainly live in the `Resolver` contract. During the
callback the storage proof would be passed in as additional input and then
verified, before returning the ENS data.

## Bounties
see `bounties.md`
 
