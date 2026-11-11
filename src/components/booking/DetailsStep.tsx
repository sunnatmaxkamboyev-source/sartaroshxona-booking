import { useState } from "react";
import type { JoyTuri, MijozMalumotlari } from "./types";
import { telefonMaskalash, telefonniTozalash } from "./telefon";

interface DetailsStepProps {
  boshlangichQiymat: MijozMalumotlari;
  onOrqaga: () => void;
  onBandQilish: (malumot: MijozMalumotlari) => void;
  yuborilmoqda?: boolean;
}

interface Xatolar {
  ism: string;
  telefon: string;
  xizmatlar: string;
  izoh: string;
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

const BOSH_XATOLAR: Xatolar = { ism: "", telefon: "", xizmatlar: "", izoh: "" };

export default function DetailsStep({
  boshlangichQiymat,
  onOrqaga,
  onBandQilish,
  yuborilmoqda = false,
}: DetailsStepProps) {
  const [forma, setForma] = useState<MijozMalumotlari>(boshlangichQiymat);
  const [xatolar, setXatolar] = useState<Xatolar>(BOSH_XATOLAR);

  function xatoniTozala(kalit: keyof Xatolar) {
    setXatolar((oldin) => (oldin[kalit] ? { ...oldin, [kalit]: "" } : oldin));
  }

  function xizmatBelgilash(xizmat: string) {
    setForma((oldin) => ({
      ...oldin,
      xizmatlar: oldin.xizmatlar.includes(xizmat)
        ? oldin.xizmatlar.filter((x) => x !== xizmat)
        : [...oldin.xizmatlar, xizmat],
    }));
    xatoniTozala("xizmatlar");
  }

  function yuborish() {
    const telefon = telefonniTozalash(forma.telefon);

    const yangiXatolar: Xatolar = {
      ism: forma.ism.trim().length >= 2 ? "" : "Ismingizni kiriting",
      telefon: telefon ? "" : "Telefon raqamni to'g'ri kiriting: +998 90 123 45 67",
      xizmatlar: forma.xizmatlar.length > 0 ? "" : "Kamida bitta xizmatni tanlang",
      izoh:
        forma.joy === "boshqa" && !forma.izoh.trim() ? "Izohda nima kerakligini yozing" : "",
    };
    setXatolar(yangiXatolar);

    if (telefon && Object.values(yangiXatolar).every((x) => !x)) {
      onBandQilish({
        ...forma,
        ism: forma.ism.trim(),
        telefon,
        izoh: forma.izoh.trim(),
      });
    }
  }

  return (
    <div className="max-w-md">
      <button
        type="button"
        onClick={onOrqaga}
        className="mb-4 flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
      >
        ‹ Orqaga
      </button>

      <h1 className="mb-6 font-serif text-xl font-semibold text-gray-900 sm:text-2xl">
        Ma'lumotlaringizni kiriting
      </h1>

      {/* Ism */}
      <div className="mb-4">
        <label htmlFor="mijoz-ism" className="mb-1.5 block text-sm font-medium text-gray-700">
          Ism *
        </label>
        <input
          id="mijoz-ism"
          type="text"
          autoComplete="name"
          value={forma.ism}
          onChange={(e) => {
            setForma({ ...forma, ism: e.target.value });
            xatoniTozala("ism");
          }}
          placeholder="Ismingizni kiriting"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-800 ${
            xatolar.ism ? "border-red-400" : "border-gray-200"
          }`}
        />
        {xatolar.ism && <p className="mt-1 text-xs text-red-500">{xatolar.ism}</p>}
      </div>

      {/* Telefon */}
      <div className="mb-6">
        <label htmlFor="mijoz-telefon" className="mb-1.5 block text-sm font-medium text-gray-700">
          Telefon raqam *
        </label>
        <input
          id="mijoz-telefon"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={forma.telefon}
          onChange={(e) => {
            setForma({ ...forma, telefon: telefonMaskalash(e.target.value) });
            xatoniTozala("telefon");
          }}
          placeholder="+998 90 123 45 67"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-800 ${
            xatolar.telefon ? "border-red-400" : "border-gray-200"
          }`}
        />
        {xatolar.telefon && <p className="mt-1 text-xs text-red-500">{xatolar.telefon}</p>}
      </div>

      {/* Joy */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-gray-700">Xizmatni qanday olmoqchisiz?</p>
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
                onChange={() => {
                  setForma({ ...forma, joy: qiymat });
                  xatoniTozala("izoh");
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Xizmatlar */}
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
        {xatolar.xizmatlar && <p className="mt-2 text-xs text-red-500">{xatolar.xizmatlar}</p>}
      </div>

      {/* Izoh */}
      <div className="mb-6">
        <label htmlFor="mijoz-izoh" className="mb-1.5 block text-sm font-medium text-gray-700">
          Qo'shimcha izoh
        </label>
        <textarea
          id="mijoz-izoh"
          value={forma.izoh}
          onChange={(e) => {
            setForma({ ...forma, izoh: e.target.value });
            xatoniTozala("izoh");
          }}
          placeholder="Yozing..."
          rows={3}
          className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-teal-800 ${
            xatolar.izoh ? "border-red-400" : "border-gray-200"
          }`}
        />
        {xatolar.izoh && <p className="mt-1 text-xs text-red-500">{xatolar.izoh}</p>}
      </div>

      <button
        type="button"
        onClick={yuborish}
        disabled={yuborilmoqda}
        className="w-full rounded-lg bg-teal-800 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {yuborilmoqda ? "Yuborilmoqda..." : "Band qilish"}
      </button>
    </div>
  );
}