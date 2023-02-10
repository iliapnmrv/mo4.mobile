export const parseQrCode = (qr: string): string[] =>
  qr.split('\n').map(item => item.trim());
