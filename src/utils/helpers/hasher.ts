const toBase64 = (value: string): string => {
  try {
    return typeof window === 'undefined'
      ? Buffer.from(value, 'utf-8').toString('base64')
      : btoa(value);
  } catch {
    return value;
  }
};

export default toBase64;