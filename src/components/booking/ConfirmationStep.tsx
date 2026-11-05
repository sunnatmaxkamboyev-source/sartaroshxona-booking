import type { BandlovMalumotlari } from "./types";

interface ConfirmationStepProps {
  bandlov: BandlovMalumotlari;
  onYangiBandlov: () => void;
}

const OY_NOMLARI = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

function sanaFormat(sana: Date | null): string {
  if (!sana) return "";
  return `${sana.getDate()} ${OY_NOMLARI[sana.getMonth()]}, ${sana.getFullYear()}`;
}

export default function ConfirmationStep({
  bandlov,
  onYangiBandlov,
}: ConfirmationStepProps) {
  return (
    <div className="flex max-w-md flex-col items-center py-10 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      <div className="mb-6 flex items-center gap-6 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 10h18M8 2v4M16 2v4" />
          </svg>
          {sanaFormat(bandlov.sana)}
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          {bandlov.vaqt}
        </div>
      </div>

      <p className="mb-8 text-base leading-relaxed text-gray-900">
        Rahmat, {bandlov.mijoz.ism}!
        <br />
        Buyurtmangiz qabul qilindi. Tez orada siz bilan{" "}
        <span className="font-medium">{bandlov.mijoz.telefon}</span> raqami
        orqali bog'lanamiz.
      </p>

      <button
        onClick={onYangiBandlov}
        className="w-full rounded-lg bg-teal-900 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-950"
      >
        Yangi band qilish
      </button>
    </div>
  );
}