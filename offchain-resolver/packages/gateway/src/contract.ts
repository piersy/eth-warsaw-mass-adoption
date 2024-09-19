import { ethers, utils } from "ethers";
import { Database } from "./server";

export const abi = [
    "function lookupAttestations(bytes32 identifier, address[] calldata trustedIssuers) external view returns ( uint256[] memory countsPerIssuer, address[] memory accounts, address[] memory signers, uint64[] memory issuedOns, uint64[] memory publishedOns)"
]
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export class ContractDatabase implements Database {
    constructor(_contract: ethers.Contract) {
        this.contract = _contract;
    }

    contract: ethers.Contract;

    addr(name: string, _coinType: number): { addr: string; ttl: number; } | Promise<{ addr: string; ttl: number; }> {
        console.log("lookupAttestations", name);
        const nameHash = utils.keccak256(utils.toUtf8Bytes(name))
        console.log("nameHash", nameHash);
        // console.log("contract", this.contract);
        return this.contract.lookupAttestations(nameHash, ["0x8FE3AC4F2b2612E9244305CB6b811d9DD0450142"]).then((atts: any) => {
            const accounts = atts.accounts as string[];

            console.log("attestations: ", atts);

            if (accounts.length > 0) {
                console.log("found account: ", accounts[0]);
                return {
                    addr: accounts[0],
                    ttl: 60,
                }
            } else {
                return {
                    addr: ZERO_ADDRESS,
                    ttl: 60,
                }
            }
        });
    }

    text(_name: string, _key: string): { value: string; ttl: number; } | Promise<{ value: string; ttl: number; }> {
        throw new Error("Method not implemented.");
    }

    contenthash(_name: string): { contenthash: string; ttl: number; } | Promise<{ contenthash: string; ttl: number; }> {
        throw new Error("Method not implemented.");
    }
}