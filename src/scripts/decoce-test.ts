import { gunzipSync } from "zlib";

// used to compare and debug input/output from encode/decode functions

const inputBase64 = "H4sIAAAAAAAACjWSMUjDUBCGL218gjyhuEgFaZdOcYpYO5UWHEp10UEzCCJ26SyO1gyuYgZdVAQRlA5KdRSH4pSptIiD4Cg4CYIBQRF89+43y0cvl/++9669794gRUNENH++2Fq7Xa3ddNuz7eLrQ8rU/OOtdv9opXq3v93aPPvQjqntDkdPmcOvhc74Z3Nub3Rp2tSag5H3mj9RPe3Ury6Wf9YnTe0lfvw9ONmoXz5nrov9nTfX1KY4wKd0AkZOg/IzRPdmWHdMSFlhJScMC3jvoa5Q10QNku9ikPOZEZiAAfK5n/Nj0PpkpZ+ZgNzH82OQ+5gRmIABPLmfPWOQ+5kRmIABzmO9PXh78Pbg7cHbgzfqcl9mXgm5ZXgqeCp4KngqeCp4KnhqeGp4auRpeGp4GubTfG+hy6SssJIThgVh1wtduzfjZ0nyXUWhT4e8es5x7Mus0ORYmhxLk+PY/ZicGAyQa89VCp1E6Frvsvw2dBsyVvb6/z8j3BthryTn+n+Mn8zXoWPPZ+ZYkviSD1/7/AF7yt9aKAMAAA==";
const inputBuffer = Buffer.from(inputBase64, "base64");
const decompressedInput = gunzipSync(inputBuffer);
console.log("decompressedInput:", decompressedInput);

const outputBase64 = "H4sIAAAAAAAACl2RMUjDUBCG76XPCBKhuEgFqUunbBGrU2nBoVQXHXQRRHTpLI7WN7iKDrqoCCJUMijV0Sk4OZUWcRAcBSdBcBAUwXt3FxLT5ev/v8vd/+51v7t9BwYAYO5iobV6u1K/icLpsPx676AXnGyFvePl2t3+dmvz/MNT6O0OHjzlj77mO6Ofzdm94cVJ9Jr9ofd6MFY76zSu2ks/a+PovTw8/h6erjcun/PX5d7Om0ZP2wYB5GKC2oCJKfRxWDTChAKzWmSakpz74rvie0jg70Bo+5JWGR33B+4PQspR4Pq0tnV2PgitT1pldJwTOCcI7TlpldHxfYDvA0LK6UvutHYSn/eF82akb0VyupLTlVyu5EzreG/AewMh5fKkX1rLfnEi7s1oSygwq0WmKTEj32h6N/uujuzW1rlS5xnN72MU752JfRTvi4l9FBUGNI0Z96V74zlTU84Ka6TW8P+nlfxRGe0kNZiP53vInMyjyZwXAqOS6j/eIW0pKAMAAA==";
const outputBuffer = Buffer.from(outputBase64, "base64");
const decompressedOutput = gunzipSync(outputBuffer);

console.log("Decompressed Output:", decompressedOutput);

console.log("Input Length:", decompressedInput.length);
console.log("Output Length:", decompressedOutput.length);
for (let i = 0; i < Math.max(decompressedInput.length, decompressedOutput.length); i++) {
  const inputByte = decompressedInput[i] ?? null;
  const outputByte = decompressedOutput[i] ?? null;
  if (inputByte !== outputByte) {
    console.log(`Difference at byte ${i}: Input=${inputByte}, Output=${outputByte}`);
  }
}