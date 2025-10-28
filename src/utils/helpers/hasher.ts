// src/utils/helpers/base64_helpers.ts

// Encode a string (e.g., user ID) to base64
export const toBase64 = (value: string): string => {
  try {
    return typeof window === "undefined"
      ? Buffer.from(value, "utf-8").toString("base64")
      : btoa(value);
  } catch {
    return value;
  }
};

// Decode a base64 string back to number
export const base64ToNumber = (value: string): number => {
  try {
    const decoded = typeof window === "undefined"
      ? Buffer.from(value, "base64").toString("utf-8")
      : atob(value);

    return Number(decoded);
  } catch {
    return NaN;
  }
};
