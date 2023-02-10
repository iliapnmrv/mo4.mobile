export const parseQrCode = (qr: string): string[] =>
  qr.split('\n').map(item => item.trim());

export const QRzeros = (num: number) => String(num).padStart(5, '0');
