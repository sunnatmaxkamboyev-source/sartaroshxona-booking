import { useEffect, useRef, useState } from "react";
import type { Usta } from "../booking/types";
import {
  ustaProfiliniOlish,
  ustaProfiliniYangilash,
  ustaRasminiYuklash,
  ustaRasminiOchirish,
} from "../../services/ustaApi";
import { ApiXato, rasmManzili } from "../../services/api";
import { tokenniOqish, tokenniTozalash } from "../../services/authStorage";

const MAKS_RASM_HAJMI = 2 * 1024 * 1024; // 2 MB
const BOSH_USTA: Usta = { ism: "", lavozim: "", avatarUrl: "" };

interface UstaPaneliProps {
  onChiqish: () => void;
}

export default function UstaPaneli({ onChiqish }: UstaPaneliProps) {
  const [usta, setUsta] = useState<Usta>(BOSH_USTA);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [saqlanmoqda, setSaqlanmoqda] = useState(false);
  const [xabar, setXabar] = useState<string | null>(null);
  const [xato, setXato] = useState<string | null>(null);
  const faylInputRef = useRef<HTMLInputElement>(null);
  const taymerRef = useRef<number | undefined>(undefined);

  const [token] = useState(tokenniOqish);

  useEffect(() => {
    ustaProfiliniOlish()
      .then((natija) => setUsta(natija))
      .catch(() => setXato("Profilni yuklab bo'lmadi"))
      .finally(() => setYuklanmoqda(false));
  }, []);

  useEffect(() => () => window.clearTimeout(taymerRef.current), []);

  function xabarniKorsat(matn: string) {
    window.clearTimeout(taymerRef.current);
    setXabar(matn);
    taymerRef.current = window.setTimeout(() => setXabar(null), 2500);
  }

  function chiqish() {
    tokenniTozalash();
    onChiqish();
  }

  // Token eskirgan bo'lsa (401), foydalanuvchi login sahifasiga qaytariladi
  function xatoniQayta(e: unknown, zaxira: string) {
    if (e instanceof ApiXato && e.status === 401) {
      chiqish();
      return;
    }
    setXato(e instanceof Error ? e.message : zaxira);
  }

  async function rasmTanlandi(hodisa: React.ChangeEvent<HTMLInputElement>) {
    const fayl = hodisa.target.files?.[0];
    if (!fayl || !token) return;

    setXato(null);

    if (!fayl.type.startsWith("image/")) {
      setXato("Faqat rasm fayli yuklash mumkin (JPG, PNG, va h.k.)");
      return;
    }

    if (fayl.size > MAKS_RASM_HAJMI) {
      setXato("Rasm hajmi 2 MB dan oshmasligi kerak");
      return;
    }

    setSaqlanmoqda(true);
    try {
      const yangilangan = await ustaRasminiYuklash(token, fayl);
      setUsta(yangilangan);
      xabarniKorsat("Rasm saqlandi ✓");
    } catch (e) {
      xatoniQayta(e, "Rasmni yuklashda xatolik");
    } finally {
      setSaqlanmoqda(false);
      if (faylInputRef.current) faylInputRef.current.value = "";
    }
  }

  async function rasmniOchirish() {
    if (!token) return;
    setXato(null);
    setSaqlanmoqda(true);
    try {
      const yangilangan = await ustaRasminiOchirish(token);
      setUsta(yangilangan);
      xabarniKorsat("Rasm o'chirildi");
    } catch (e) {
      xatoniQayta(e, "Rasmni o'chirishda xatolik");
    } finally {
      setSaqlanmoqda(false);
    }
  }

  async function malumotlarniSaqlash() {
    if (!usta.ism.trim()) {
      setXato("Ismni kiriting");
      return;
    }
    if (!token) return;

    setXato(null);
    setSaqlanmoqda(true);
    try {
      const yangilangan = await ustaProfiliniYangilash(token, usta.ism.trim(), usta.lavozim.trim());
      setUsta(yangilangan);
      xabarniKorsat("Ma'lumotlar saqlandi ✓");
    } catch (e) {
      xatoniQayta(e, "Saqlashda xatolik");
    } finally {
      setSaqlanmoqda(false);
    }
  }

  if (yuklanmoqda) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-gray-400">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-xl font-semibold text-gray-900 sm:text-2xl">
          Sartarosh profili
        </h1>
        <button
          type="button"
          onClick={chiqish}
          className="text-sm text-gray-400 hover:text-red-500"
        >
          Chiqish
        </button>
      </div>

      <div className="mb-6 flex items-center gap-5">
        <div className="relative h-20 w-20 shrink-0">
          {usta.avatarUrl ? (
            <img
              src={rasmManzili(usta.avatarUrl)}
              alt={usta.ism}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-2xl font-semibold text-teal-800">
              {usta.ism.trim() ? usta.ism.trim()[0].toUpperCase() : "?"}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={saqlanmoqda}
              onClick={() => faylInputRef.current?.click()}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-teal-800 hover:text-teal-800 disabled:opacity-60"
            >
              {usta.avatarUrl ? "Rasmni o'zgartirish" : "Rasm qo'yish"}
            </button>
            {usta.avatarUrl && (
              <button
                type="button"
                disabled={saqlanmoqda}
                onClick={rasmniOchirish}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-60"
              >
                O'chirish
              </button>
            )}
          </div>
          <input
            ref={faylInputRef}
            type="file"
            accept="image/*"
            onChange={rasmTanlandi}
            className="hidden"
          />
          <p className="text-xs text-gray-400">JPG yoki PNG, 2 MB gacha</p>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="usta-ism" className="mb-1.5 block text-sm font-medium text-gray-700">
          Ism-familiya
        </label>
        <input
          id="usta-ism"
          type="text"
          value={usta.ism}
          onChange={(e) => setUsta({ ...usta, ism: e.target.value })}
          placeholder="Masalan: Jasur Aliyev"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-800"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="usta-lavozim" className="mb-1.5 block text-sm font-medium text-gray-700">
          Lavozim
        </label>
        <input
          id="usta-lavozim"
          type="text"
          value={usta.lavozim}
          onChange={(e) => setUsta({ ...usta, lavozim: e.target.value })}
          placeholder="Masalan: Bosh sartarosh"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-800"
        />
      </div>

      {xato && <p className="mb-4 text-sm text-red-500">{xato}</p>}
      {xabar && <p className="mb-4 text-sm text-emerald-600">{xabar}</p>}

      <button
        type="button"
        onClick={malumotlarniSaqlash}
        disabled={saqlanmoqda}
        className="w-full rounded-lg bg-teal-800 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saqlanmoqda ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </div>
  );
}