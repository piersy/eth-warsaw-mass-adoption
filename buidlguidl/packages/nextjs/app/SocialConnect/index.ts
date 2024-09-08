// Import necessary modules and types from various libraries
import { WebBlsBlindingClient } from "./blinding/webBlindingClient";
import {
  CELO_RPC_URL,
  FA_CONTRACT,
  FA_PROXY_ADDRESS,
  ODIS_PAYMENTS_CONTRACT,
  ODIS_PAYMENTS_PROXY_ADDRESS,
  SERVICE_CONTEXT,
  STABLE_TOKEN_ADDRESS,
  STABLE_TOKEN_CONTRACT,
} from "./utils";
import { ContractKit, newKit } from "@celo/contractkit";
import { OdisUtils } from "@celo/identity";
import { IdentifierPrefix } from "@celo/identity/lib/odis/identifier";
import { AuthSigner, AuthenticationMethod, ServiceContext } from "@celo/identity/lib/odis/query";
import { Contract, Wallet } from "ethers";
import { parseEther } from "viem";

export const ONE_CENT_CUSD = parseEther("0.01"); // Represents 0.01 cUSD in wei
export const NOW_TIMESTAMP = Math.floor(new Date().getTime() / 1000); // Current UNIX timestamp

export class SocialConnectIssuer {
  // Declare class properties
  private readonly federatedAttestationsContract: Contract;
  private readonly odisPaymentsContract: Contract;
  private readonly stableTokenContract: Contract;
  private readonly authSigner: AuthSigner; // Signer for ODIS authentication
  private readonly issuerKit: ContractKit;
  readonly serviceContext: ServiceContext;

  constructor(
    private readonly wallet: Wallet, // Issuer's wallet
  ) {
    // Initialize the service context
    this.serviceContext = OdisUtils.Query.getServiceContext(SERVICE_CONTEXT);
    // Initialize contracts with their respective ABI and addresses
    this.federatedAttestationsContract = new Contract(FA_PROXY_ADDRESS, FA_CONTRACT.abi, this.wallet);
    this.odisPaymentsContract = new Contract(ODIS_PAYMENTS_PROXY_ADDRESS, ODIS_PAYMENTS_CONTRACT.abi, this.wallet);
    this.stableTokenContract = new Contract(STABLE_TOKEN_ADDRESS, STABLE_TOKEN_CONTRACT.abi, this.wallet);
    // Setup contractkit for the issuer signer to authenticate to ODIS (NOTE: We should remove this requirement and instead allow ethers, viem or a raw key to be used)
    this.issuerKit = newKit(CELO_RPC_URL);
    this.issuerKit.addAccount(this.wallet.privateKey);
    this.issuerKit.defaultAccount = this.wallet.address;
    this.authSigner = {
      authenticationMethod: AuthenticationMethod.WALLET_KEY,
      contractKit: this.issuerKit,
    };
  }

  // Method to get obfuscated ID
  async getObfuscatedId(plaintextId: string, identifierType: IdentifierPrefix) {
    // Fetch the obfuscated identifier using OdisUtils
    await this.checkAndTopUpODISQuota();

    const blindingClient = new WebBlsBlindingClient(this.serviceContext.odisPubKey);

    const { obfuscatedIdentifier } = await OdisUtils.Identifier.getObfuscatedIdentifier(
      plaintextId,
      identifierType,
      this.wallet.address,
      this.authSigner,
      this.serviceContext,
      undefined,
      undefined,
      blindingClient,
    );
    return obfuscatedIdentifier;
  }

  // Method to check and top up ODIS quota
  async checkAndTopUpODISQuota() {
    const remainingQuota = await this.checkODISQuota();

    // If quota is less than 1, top it up
    if (remainingQuota < 1) {
      await this.stableTokenContract.increaseAllowance(ODIS_PAYMENTS_PROXY_ADDRESS, ONE_CENT_CUSD);
      const walletAddress = await this.wallet.getAddress();
      await this.odisPaymentsContract.payInCUSD(walletAddress, ONE_CENT_CUSD);
    }
  }

  // Method to get obfuscated ID with retry logic in case of quota issues
  async getObfuscatedIdWithQuotaRetry(plaintextId: string, identifierType: IdentifierPrefix) {
    try {
      return this.getObfuscatedId(plaintextId, identifierType);
    } catch {
      await this.checkAndTopUpODISQuota();
      return this.getObfuscatedId(plaintextId, identifierType);
    }
  }

  // Method to register an on-chain identifier
  async registerOnChainIdentifier(onchainId: string, address: string) {
    const tx = await this.federatedAttestationsContract.registerAttestationAsIssuer(onchainId, address, NOW_TIMESTAMP);
    const receipt = await tx.wait();
    return receipt;
  }

  // Method to deregister an on-chain identifier
  async deregisterOnChainIdentifier(plaintextId: string, identifierType: IdentifierPrefix, address: string) {
    const obfuscatedId = await this.getObfuscatedIdWithQuotaRetry(plaintextId, identifierType);
    const tx = await this.federatedAttestationsContract.revokeAttestation(obfuscatedId, this.wallet.address, address);
    const receipt = await tx.wait();
    return receipt;
  }

  // Method to check the remaining ODIS quota
  async checkODISQuota() {
    const { remainingQuota, warnings, performedQueryCount } = await OdisUtils.Quota.getPnpQuotaStatus(
      this.wallet.address,
      this.authSigner,
      this.serviceContext,
    );
    console.log(
      "Remaining Quota",
      remainingQuota,
      this.serviceContext,
      this.wallet.address,
      warnings,
      performedQueryCount,
    );
    return remainingQuota;
  }

  // Method to lookup attestations
  async lookup(plaintextId: string, identifierType: IdentifierPrefix, issuerAddresses: string[]) {
    const obfuscatedId = await this.getObfuscatedId(plaintextId, identifierType);
    const attestations = await this.federatedAttestationsContract.lookupAttestations(
      await this.getObfuscatedIdWithQuotaRetry(plaintextId, identifierType),
      issuerAddresses,
    );

    return {
      accounts: attestations.accounts as string[],
      obfuscatedId,
    };
  }
}
