import type { BandlovMalumotlari, BookingStep, MijozMalumotlari } from "./types";

const SAQLASH_KALITI = "sartaroshxona_bandlov";
const MIJOZ_KALITI = "sartaroshxona_mijoz";

const BOSQICHLAR_ROYXATI: BookingStep[] = ["datetime", "details", "confirmation"];

const BOSH_MIJOZ: MijozMalumotlari = {
  ism: "",
  telefon: "",
  joy: "salon",
  xizmatlar: [],
  izoh: "",
};

interface SaqlanganHolat {
  bosqich: BookingStep;
  bandlov: BandlovMalumotlari;
}

export function holatniSaqlash(bosqich: BookingStep, bandlov: BandlovMalumotlari): void {
  try {
    const yoziladigan = {
      bosqich,
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

    const sana = parsed.bandlov?.sana ? new Date(parsed.bandlov.sana) : null;
    const mijoz = parsed.bandlov?.mijoz ?? {};

    return {
      bosqich: BOSQICHLAR_ROYXATI.includes(parsed.bosqich) ? parsed.bosqich : "datetime",
      bandlov: {
        sana: sana && !Number.isNaN(sana.getTime()) ? sana : null,
        vaqt: parsed.bandlov?.vaqt ?? null,
        mijoz: {
          ...BOSH_MIJOZ,
          ...mijoz,
          xizmatlar: Array.isArray(mijoz.xizmatlar) ? mijoz.xizmatlar : [],
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

// Qaytib kelgan mijoz uchun: faqat ism va telefon, shu qurilmada qoladi
export function mijozniEslabQolish(mijoz: Pick<MijozMalumotlari, "ism" | "telefon">): void {
  try {
    window.localStorage.setItem(
      MIJOZ_KALITI,
      JSON.stringify({ ism: mijoz.ism, telefon: mijoz.telefon })
    );
  } catch (xato) {
    console.error("Mijozni saqlashda xato:", xato);
  }
}

export function eslabQolinganMijoz(): Pick<MijozMalumotlari, "ism" | "telefon"> {
  try {
    const xom = window.localStorage.getItem(MIJOZ_KALITI);
    if (!xom) return { ism: "", telefon: "" };
    const parsed = JSON.parse(xom);
    return {
      ism: typeof parsed?.ism === "string" ? parsed.ism : "",
      telefon: typeof parsed?.telefon === "string" ? parsed.telefon : "",
    };
  } catch {
    return { ism: "", telefon: "" };
  }
}