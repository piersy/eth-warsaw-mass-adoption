export const GetENSNameFromOdisId = (odisIdentifier: string, network?: string): string => {
  const shortId = odisIdentifier.slice(2, 34); // NOTE: ethers doesn't support ens names longer than 63 bytes
  console.log(`shortId: ${shortId}`);
  const ensPhoneNumberName = `${shortId}.${network ?? "celo"}.soco.eth`;
  console.log(`ensPhoneNumberName: ${ensPhoneNumberName}`);
  return ensPhoneNumberName;
};
