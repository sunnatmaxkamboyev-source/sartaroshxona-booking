// Booking oqimi uchun umumiy tiplar

export type BookingStep = "datetime" | "details" | "confirmation";

export interface Usta {
  ism: string;
  lavozim: string; // masalan: "Bosh sartarosh"
  avatarUrl: string;
}

export interface VaqtOraligi {
  vaqt: string; // "17:30"
  band: boolean;
}

export type JoyTuri = "salon" | "qongiroq" | "boshqa";

export interface MijozMalumotlari {
  ism: string;
  telefon: string;
  joy: JoyTuri;
  xizmatlar: string[]; // tanlangan xizmatlar ro'yxati
  izoh: string;
}

export interface BandlovMalumotlari {
  sana: Date | null;
  vaqt: string | null;
  mijoz: MijozMalumotlari;
}

// Sidebar'dagi har bir bosqich holatini belgilash uchun
export type BosqichHolati = "tugallangan" | "faol" | "kutilmoqda";

export const BOSQICHLAR: { key: BookingStep; label: string }[] = [
  { key: "datetime", label: "Sana va vaqt" },
  { key: "details", label: "Ma'lumotlar" },
  { key: "confirmation", label: "Tasdiqlash" },
];