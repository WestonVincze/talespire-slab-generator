import { Buffer } from "buffer";

export function encodeUUID(uuid: string): Buffer {
  const hex = uuid.replace(/-/g, "");
  const buffer = Buffer.from(hex, "hex");

  const reversed = Buffer.concat([
    buffer.subarray(0, 4).reverse(),
    buffer.subarray(4, 6).reverse(),
    buffer.subarray(6, 8).reverse(),
    buffer.subarray(8, 10),
    buffer.subarray(10, 16),
  ]);

  return reversed;
}

export function decodeUUID(buffer: Buffer): string {
  if (buffer.length !== 16) {
    throw new Error("UUID buffer must be 16 bytes long");
  }

  const groups = [
    buffer.subarray(0, 4).reverse(),
    buffer.subarray(4, 6).reverse(),
    buffer.subarray(6, 8).reverse(),
    buffer.subarray(8, 10),
    buffer.subarray(10, 16),
  ].map(g => g.toString("hex"));

  return groups.join("-");
}