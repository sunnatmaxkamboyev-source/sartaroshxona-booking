import type { BandlovMalumotlari } from "./types";

const DAVOMIYLIK_DAQIQA = 60;
const ESLATMA = "-PT1H"; // 1 soat oldin

function ikkiXona(n: number): string {
  return String(n).padStart(2, "0");
}

// Mahalliy vaqt, "Z" siz: taqvim uni foydalanuvchi soat mintaqasida ochadi
function icsVaqt(d: Date): string {
  return (
    `${d.getFullYear()}${ikkiXona(d.getMonth() + 1)}${ikkiXona(d.getDate())}` +
    `T${ikkiXona(d.getHours())}${ikkiXona(d.getMinutes())}00`
  );
}

function icsMatn(matn: string): string {
  return matn
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function icsYaratish(bandlov: BandlovMalumotlari, ustaIsmi: string): string | null {
  if (!bandlov.sana || !bandlov.vaqt) return null;

  const [soat, daqiqa] = bandlov.vaqt.split(":").map(Number);
  const boshlanish = new Date(
    bandlov.sana.getFullYear(),
    bandlov.sana.getMonth(),
    bandlov.sana.getDate(),
    soat,
    daqiqa
  );
  const tugash = new Date(boshlanish.getTime() + DAVOMIYLIK_DAQIQA * 60_000);
  const hozir = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const tavsif = [
    bandlov.mijoz.xizmatlar.length ? `Xizmatlar: ${bandlov.mijoz.xizmatlar.join(", ")}` : "",
    ustaIsmi ? `Usta: ${ustaIsmi}` : "",
    bandlov.mijoz.izoh ? `Izoh: ${bandlov.mijoz.izoh}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sartaroshxona//Bandlov//UZ",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@sartaroshxona`,
    `DTSTAMP:${hozir}`,
    `DTSTART:${icsVaqt(boshlanish)}`,
    `DTEND:${icsVaqt(tugash)}`,
    "SUMMARY:Sartaroshxonaga yozilish",
    `DESCRIPTION:${icsMatn(tavsif)}`,
    "BEGIN:VALARM",
    `TRIGGER:${ESLATMA}`,
    "ACTION:DISPLAY",
    "DESCRIPTION:Sartaroshxonaga borish vaqti yaqin",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function taqvimFayliniYuklash(bandlov: BandlovMalumotlari, ustaIsmi: string): boolean {
  const matn = icsYaratish(bandlov, ustaIsmi);
  if (!matn) return false;

  const blob = new Blob([matn], { type: "text/calendar;charset=utf-8" });
  const manzil = URL.createObjectURL(blob);
  const havola = document.createElement("a");
  havola.href = manzil;
  havola.download = "bandlov.ics";
  document.body.appendChild(havola);
  havola.click();
  document.body.removeChild(havola);
  URL.revokeObjectURL(manzil);
  return true;
}