# ens

Our system is an extension to ens that allows addresses to be discovered via
phone number while not exposing the phone number to the public. We achieved
this by adding a domain for phone number resolution soco.eth under which ens
entries are added which map phone numbers to addresses.

The actual ens name that is stored is a threshold signature over the phone number
calculated by a decentralised set of operators who never view the number in an
un-blinded form. Anyone with the phone number can calculate the signature with
the collaboration of the operators.

This allows for users to easily discover and connect with their friends using
their existing phone contacts without exposing their phone number to the
public.

We used an offchain resolver to manage the top domain of soco.eth and used a
gateway that routed to celo, optimism and zircuit.


# DBForest

We used dbforest to host the ens gateway server on a vm at svc-331-u22133.vm.elestio.app.
The setup experience was very smooth!

# buidlguidl

We used buidlguidl's scaffold-eth to build the front end and simplify deployment of contracts.
The buidlguidl folder holds the scaffold-eth project and our changes.

# optimism

We deployed the federated attestations contract
(`./IdentifierContracts/FederatedAttestations.sol`) to the optimism testnet to
store mappings between users binded phone numbers and their ethereum addresses.

https://sepolia-optimism.etherscan.io/address/0x6157A59052d62183cd3D5726C2cA0bb8b049AE1F

# zircuit

We deployed the federated attestations contract
(`./IdentifierContracts/FederatedAttestations.sol`) to the zircuit testnet to
store mappings between users binded phone numbers and their ethereum addresses.

https://explorer.testnet.zircuit.com/address/0xc2A955E3cDf1a168c54683aa315eB9A536f1a62b
