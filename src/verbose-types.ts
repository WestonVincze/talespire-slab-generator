// semantic typing
type u8 = number; // 0 to 255
type u16 = number; // 0 to 65535
type u32 = number; // 0 to 4294967295
type u64 = bigint; // Use BigInt for 64-bit integers
type uuid = string; // Use a string for UUIDs

// optional validation functions
function validateU8(value: number): u8 {
  if (value < 0 || value > 255) throw new Error('Value out of range for u8');
  return value;
}

function validateU16(value: number): u16 {
  if (value < 0 || value > 65535) throw new Error('Value out of range for u16');
  return value;
}

function validateU32(value: number): u32 {
  if (value < 0 || value > 4294967295) throw new Error('Value out of range for u32');
  return value;
}

// optional: use a uuid validation library like uuid
function validateUuid(value: string): uuid {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(value)) throw new Error('Invalid UUID format');
  return value;
}
