export function telefonMaskalash(xom: string): string {
  let raqamlar = xom.replace(/\D/g, "");
  if (raqamlar.startsWith("998")) raqamlar = raqamlar.slice(3);
  raqamlar = raqamlar.slice(0, 9);

  const qismlar = [
    raqamlar.slice(0, 2),
    raqamlar.slice(2, 5),
    raqamlar.slice(5, 7),
    raqamlar.slice(7, 9),
  ].filter(Boolean);

  return qismlar.length ? `+998 ${qismlar.join(" ")}` : "";
}

// Maskalangan matndan "+998901234567" oladi, to'liq bo'lmasa null qaytaradi
export function telefonniTozalash(xom: string): string | null {
  const raqamlar = xom.replace(/\D/g, "");
  if (raqamlar.length === 12 && raqamlar.startsWith("998")) return `+${raqamlar}`;
  if (raqamlar.length === 9) return `+998${raqamlar}`;
  return null;
}