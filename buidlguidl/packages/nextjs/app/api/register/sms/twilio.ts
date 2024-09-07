export const E164_REGEX = /^\+[1-9][0-9]{1,14}$/;

export function validatePhoneNumber(phoneNumber: string): boolean {
  if (E164_REGEX.test(phoneNumber)) {
    return true;
  }
  return false;
}

export async function sendSmsVerificationToken(phoneNumber: string) {
  console.log("sendSmsVerificationToken phoneNumber: ", phoneNumber);
  try {
    if (!validatePhoneNumber(phoneNumber)) {
      throw `Attempting to hash a non-e164 number: ${phoneNumber}`;
    }

    const data = JSON.stringify({
      to: phoneNumber,
      channel: "sms",
    });

    console.log(process.env.NEXT_PUBLIC_TWILIO_URL);
    console.log(data);

    const response = await fetch(`${process.env.NEXT_PUBLIC_TWILIO_URL}/start-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    if (response.status !== 200) {
      throw `Failed to send SMS verification token. status: ${response.status}, text: ${await response.text()}`;
    }

    console.info("status", response.status);
    const json = await response.json();
    console.log("sendSmsVerificationToken response: ", json);
    return json;
  } catch (error) {
    throw `Failed to send SMS verification token: ${error}`;
  }
}

export async function verifySmsToken(phoneNumber: string, token: string): Promise<boolean>  {
  try {
    const data = JSON.stringify({
      to: phoneNumber,
      code: token,
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_TWILIO_URL}/check-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const json = await response.json();
    console.log("verifySmsToken response: ", json);
    return json.success;
  } catch (error) {
    console.error(`Failed to verify SMS verification token: ${error}`);
    return false;
  }
}
