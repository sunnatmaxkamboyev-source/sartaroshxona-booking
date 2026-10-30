import type { BandlovMalumotlari, BookingStep } from "./types";

const SAQLASH_KALITI = "sartaroshxona_bandlov";

interface SaqlanganHolat {
  bosqich: BookingStep;
  bandlov: BandlovMalumotlari;
}

export function holatniSaqlash(bosqich: BookingStep, bandlov: BandlovMalumotlari): void {
  const yoziladigan = {
    bosqich: bosqich,
    bandlov: {
      sana: bandlov.sana ? bandlov.sana.getTime() : null,
      vaqt: bandlov.vaqt,
      mijoz: bandlov.mijoz,
    },
  };
  localStorage.setItem(SAQLASH_KALITI, JSON.stringify(yoziladigan));
}

export function holatniOqish(): SaqlanganHolat | null {
  const xom = localStorage.getItem(SAQLASH_KALITI);
  if (!xom) return null;

  const parsed = JSON.parse(xom);

  return {
    bosqich: parsed.bosqich,
    bandlov: {
      sana: parsed.bandlov.sana ? new Date(parsed.bandlov.sana) : null,
      vaqt: parsed.bandlov.vaqt,
      mijoz: parsed.bandlov.mijoz,
    },
  };
}

export function holatniTozalash(): void {
  localStorage.removeItem(SAQLASH_KALITI);
}