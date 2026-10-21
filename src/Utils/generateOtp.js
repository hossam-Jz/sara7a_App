export function generateOTP() {
  return String (Math.floor(Math.random() * (800000 + 100000) + 100000));
}
