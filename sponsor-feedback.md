# buidlguidl

We ran into problems when we used scaffold-eth to create a foundry project
because we needed to have another project share the repo and in order to avoid
conflicts we put each project in a separate top level (buidlguidl) folder but this then
broke the paths to the submodules defined by the scaffold eth setup.

We ended up having to move the submodules with `git move` but keep the .git
folder at the root and then add an empty .git folder under the buidlguidl
folder to satisfy the husky and it's pre-commit hooks. 

Additionally it's now required to manually make the empty .git folder under the
buidlguidl folder on every checkout, because git won't let you check in a
folder named .git!

In general it would be great if scaffold eth gave you the code but left the
source control system up to the user.

# ens

We had some problems with the offchain-resolver project
(https://github.com/ensdomains/offchain-resolver) firstly the instructions in
the README do not include a step to run the gateway and secondly we didn't find
any way to easily configure the server to return cors headers, which resulted
in us needing to run a local proxy to get around this.

We also encountered a strange issue where we were not able to successfully make
the the ccip read callback to contracts deployed on a non local chain the calls
would revert despite deploying with exactly the same parameters, the same
gateway process and the same client code.

We did not get to the bottom of this so ended up deploying the
offchain-resolver on a local chain.
