# Social ENS

- [Excalidraw](https://excalidraw.com/#json=-Bnib0tvubrZUIVZrkSWQ,YdA_3LXs4U-o2UV4ityiOQ)

## Running the system

```sh
export REMOTE_GATEWAY=http://localhost:3001
cd offchain resolver/
source .env
yarn
yarn build
yarn start:node

# run proxy
cd ../proxy
yarn
node server.js

# run frontend
cd ../buidlguidl
yarn
yarn start
```

## Why the proxy?

We ran into lots of problems around CORS and HTTPS when using the gateway directly from the frontend. To work around this we created a simple proxy that forwards requests to the gateway using a local address.

## Storage proofs

Pushing ENS data storage to L2's opens new exciting possibilities for further decentralizing the ENS system, but also opens up potential problems around data availability and timeliness. For example, the resolver contract on Ethereum might require that data is proved to be available on a L2 or that information provided is not older than a certain amount of blocks.

The solution to this problem are storage proofs. With systems like Herodotus it is possible to create an efficient proof that the contract on the L2 contains a certain entry or that an entry was available on a certain block height.

Implementation would mainly live in the `Resolver` contract. During the callback the storage proof would be passed in as additional input and then verified, before returning the ENS data.