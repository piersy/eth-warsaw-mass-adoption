import { ethers, Signer } from "ethers";
import { Database } from "./server";

const abi = [
    "function lookupIdentifiers(address account, address[] calldata trustedIssuers) external view returns (uint256[] memory countsPerIssuer, bytes32[] memory identifiers)"
]

const address = "0x70ff5c5B1Ad0533eAA5489e0D5Ea01485d530674";

export function getContract(signer: Signer): ethers.Contract {
    return new ethers.Contract(address, abi, signer);
}

export class ContractDatabase implements Database {
    constructor(_contract: ethers.Contract) {
        this.contract = _contract;
    }

    contract: ethers.Contract;

    addr(name: string, _coinType: number): { addr: string; ttl: number; } | Promise<{ addr: string; ttl: number; }> {
        return this.contract.lookupIdentifiers(name, ["0x2C302520E6B344d8396BF3011862046287ef88c7"]);
    }

    text(name: string, key: string): { value: string; ttl: number; } | Promise<{ value: string; ttl: number; }> {
        throw new Error("Method not implemented.");
    }

    contenthash(name: string): { contenthash: string; ttl: number; } | Promise<{ contenthash: string; ttl: number; }> {
        throw new Error("Method not implemented.");
    }
}