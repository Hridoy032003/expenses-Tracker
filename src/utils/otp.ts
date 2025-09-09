export function generateNumericOTP() {
  // Generate a random number between 100000 (inclusive) and 999999 (inclusive)
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString(); // Convert to string
}

