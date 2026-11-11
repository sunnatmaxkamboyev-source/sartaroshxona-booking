export function sanaKaliti(sana: Date): string {
  const yil = sana.getFullYear();
  const oy = String(sana.getMonth() + 1).padStart(2, "0");
  const kun = String(sana.getDate()).padStart(2, "0");
  return `${yil}-${oy}-${kun}`;
}


export function sananiYuborishUchun(sana: Date): string {
  return new Date(sana.getFullYear(), sana.getMonth(), sana.getDate(), 12).toISOString();
}

export function vaqtOtganmi(sana: Date, vaqt: string, hozir: Date = new Date()): boolean {
  if (sana.toDateString() !== hozir.toDateString()) return false;
  const [soat, daqiqa] = vaqt.split(":").map(Number);
  return soat * 60 + daqiqa <= hozir.getHours() * 60 + hozir.getMinutes();
}