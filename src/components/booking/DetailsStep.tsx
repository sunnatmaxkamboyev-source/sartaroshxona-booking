import { useState } from "react";
import type { JoyTuri, MijozMalumotlari } from "./types";

interface DetailsStepProps {
  boshlangichQiymat: MijozMalumotlari;
  onOrqaga: () => void;
  onBandQilish: (malumot: MijozMalumotlari) => void;
}

const JOY_VARIANTLARI: { qiymat: JoyTuri; label: string }[] = [
  { qiymat: "salon", label: "Salonga kelib xizmat olish" },
  { qiymat: "qongiroq", label: "Avval qo'ng'iroq qilib so'rash" },
  { qiymat: "boshqa", label: "Boshqa (izohda yozing)" },
];

const XIZMAT_VARIANTLARI = [
  "Soch olish",
  "Soqol olish",
  "Soch + soqol",
  "Soch bo'yash",
  "Bolalar uchun soch olish",
  "Yuz tozalash (pardoz)",
  "Ustara bilan soqol",
  "Boshqa",
];

const BOSH_XATOLAR = { ism: "", telefon: "" };

export default function DetailsStep({
  boshlangichQiymat,
  onOrqaga,
  onBandQilish,
}: DetailsStepProps) {
  const [forma, setForma] = useState<MijozMalumotlari>(boshlangichQiymat);
  const [xatolar, setXatolar] = useState(BOSH_XATOLAR);

  function xizmatBelgilash(xizmat: string) {
    setForma((oldin) => ({
      ...oldin,
      xizmatlar: oldin.xizmatlar.includes(xizmat)
        ? oldin.xizmatlar.filter((x) => x !== xizmat)
        : [...oldin.xizmatlar, xizmat],
    }));
  }

  function yuborish() {
    const yangiXatolar = {
      ism: forma.ism.trim() ? "" : "Ismingizni kiriting",
      telefon: forma.telefon.trim() ? "" : "Telefon raqamingizni kiriting",
    };
    setXatolar(yangiXatolar);

    if (!yangiXatolar.ism && !yangiXatolar.telefon) {
      onBandQilish(forma);
    }
  }

  return (
    <div className="max-w-md">
      <button
        onClick={onOrqaga}
        className="mb-4 flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
      >
        ‹ Orqaga
      </button>

      <h1 className="mb-6 font-serif text-2xl font-semibold text-gray-900">
        Ma'lumotlaringizni kiriting
      </h1>

      
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Ism *
        </label>
        <input
          type="text"
          value={forma.ism}
          onChange={(e) => setForma({ ...forma, ism: e.target.value })}
          placeholder="Ismingizni kiriting"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-800 ${
            xatolar.ism ? "border-red-400" : "border-gray-200"
          }`}
        />
        {xatolar.ism && <p className="mt-1 text-xs text-red-500">{xatolar.ism}</p>}
      </div>


      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Telefon raqam *
        </label>
        <input
          type="tel"
          value={forma.telefon}
          onChange={(e) => setForma({ ...forma, telefon: e.target.value })}
          placeholder="+998 90 123 45 67"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-800 ${
            xatolar.telefon ? "border-red-400" : "border-gray-200"
          }`}
        />
        {xatolar.telefon && (
          <p className="mt-1 text-xs text-red-500">{xatolar.telefon}</p>
        )}
      </div>

      
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-gray-700">Qanday xizmat kerak? *</p>
        <div className="flex flex-col gap-2">
          {JOY_VARIANTLARI.map(({ qiymat, label }) => (
            <label
              key={qiymat}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                forma.joy === qiymat
                  ? "border-teal-800 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="joy"
                className="accent-teal-800"
                checked={forma.joy === qiymat}
                onChange={() => setForma({ ...forma, joy: qiymat })}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-gray-700">
          Qaysi xizmat(lar)ga yozilmoqchisiz? *
        </p>
        <div className="flex flex-col gap-2">
          {XIZMAT_VARIANTLARI.map((xizmat) => (
            <label
              key={xizmat}
              className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-teal-800"
                checked={forma.xizmatlar.includes(xizmat)}
                onChange={() => xizmatBelgilash(xizmat)}
              />
              {xizmat}
            </label>
          ))}
        </div>
      </div>

      
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Qo'shimcha izoh
        </label>
        <textarea
          value={forma.izoh}
          onChange={(e) => setForma({ ...forma, izoh: e.target.value })}
          placeholder="Yozing..."
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-800"
        />
      </div>

      <button
        onClick={yuborish}
        className="w-full rounded-lg bg-teal-800 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-900"
      >
        Band qilish
      </button>
    </div>
  );
}