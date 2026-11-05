import type { BandlovMalumotlari, BookingStep } from "./types";

const SAQLASH_KALITI = "sartaroshxona_bandlov";

interface SaqlanganHolat {
  bosqich: BookingStep;
  bandlov: BandlovMalumotlari;
}

export function holatniSaqlash(bosqich: BookingStep, bandlov: BandlovMalumotlari): void {
  try {
    const yoziladigan = {
      bosqich: bosqich,
      bandlov: {
        sana: bandlov.sana ? bandlov.sana.getTime() : null,
        vaqt: bandlov.vaqt,
        mijoz: bandlov.mijoz,
      },
    };
    window.localStorage.setItem(SAQLASH_KALITI, JSON.stringify(yoziladigan));
  } catch (xato) {
    console.error("Saqlashda xato:", xato);
  }
}

export function holatniOqish(): SaqlanganHolat | null {
  try {
    const xom = window.localStorage.getItem(SAQLASH_KALITI);
    if (!xom) return null;

    const parsed = JSON.parse(xom);
    if (!parsed || typeof parsed !== "object") return null;

    return {
      bosqich: parsed.bosqich || "datetime",
      bandlov: {
        sana: parsed.bandlov?.sana ? new Date(parsed.bandlov.sana) : null,
        vaqt: parsed.bandlov?.vaqt ?? null,
        mijoz: parsed.bandlov?.mijoz ?? {
          ism: "",
          telefon: "",
          joy: "salon",
          xizmatlar: [],
          izoh: "",
        },
      },
    };
  } catch (xato) {
    console.error("O'qishda xato:", xato);
    return null;
  }
}

export function holatniTozalash(): void {
  try {
    window.localStorage.removeItem(SAQLASH_KALITI);
  } catch (xato) {
    console.error("Tozalashda xato:", xato);
  }
}