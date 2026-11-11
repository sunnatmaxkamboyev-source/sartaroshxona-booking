import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import DateTimeStep from "./DateTimeStep";
import DetailsStep from "./DetailsStep";
import ConfirmationStep from "./ConfirmationStep";
import type { BookingStep, BandlovMalumotlari, Usta } from "./types";
import {
  eslabQolinganMijoz,
  holatniOqish,
  holatniSaqlash,
  holatniTozalash,
  mijozniEslabQolish,
} from "./storage";
import { bandlovYaratish } from "../../services/bandlovApi";
import { ustaProfiliniOlish } from "../../services/ustaApi";
import { ApiXato } from "../../services/api";

const STANDART_USTA: Usta = {
  ism: "Sartarosh",
  lavozim: "",
  avatarUrl: "",
};

// Qaytib kelgan mijozning ismi va telefoni tayyor turadi
function boshBandlov(): BandlovMalumotlari {
  const { ism, telefon } = eslabQolinganMijoz();
  return {
    sana: null,
    vaqt: null,
    mijoz: { ism, telefon, joy: "salon", xizmatlar: [], izoh: "" },
  };
}

function boshlangichHolat(): { bosqich: BookingStep; bandlov: BandlovMalumotlari } {
  const saqlangan = holatniOqish();
  if (!saqlangan) return { bosqich: "datetime", bandlov: boshBandlov() };

  const { bosqich, bandlov } = saqlangan;
  const bugunBoshi = new Date();
  bugunBoshi.setHours(0, 0, 0, 0);

  const sanaYaroqli = !!bandlov.sana && bandlov.sana >= bugunBoshi;
  if (!sanaYaroqli || !bandlov.vaqt) {
    return { bosqich: "datetime", bandlov: { ...bandlov, sana: null, vaqt: null } };
  }
  return { bosqich, bandlov };
}

export default function BookingFlow() {
  const [usta, setUsta] = useState<Usta>(STANDART_USTA);
  const [boshlangich] = useState(boshlangichHolat);
  const [bosqich, setBosqich] = useState<BookingStep>(boshlangich.bosqich);
  const [bandlov, setBandlov] = useState<BandlovMalumotlari>(boshlangich.bandlov);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);
  const [xato, setXato] = useState<string | null>(null);

  // Sahifa ochilganda usta profilini backenddan olamiz
  useEffect(() => {
    ustaProfiliniOlish()
      .then((natija) => setUsta(natija))
      .catch(() => {
        // Backend vaqtincha ishlamasa ham sayt ishlashda davom etadi
        console.error("Usta profilini yuklab bo'lmadi");
      });
  }, []);

  useEffect(() => {
    holatniSaqlash(bosqich, bandlov);
  }, [bosqich, bandlov]);

  function sanaVaqtTanlandi(sana: Date, vaqt: string) {
    setXato(null);
    setBandlov((oldin) => ({ ...oldin, sana, vaqt }));
    setBosqich("details");
  }

  async function malumotTasdiqlandi(mijoz: BandlovMalumotlari["mijoz"]) {
    if (!bandlov.sana || !bandlov.vaqt) return;

    setYuborilmoqda(true);
    setXato(null);

    try {
      await bandlovYaratish(bandlov.sana, bandlov.vaqt, mijoz);
      mijozniEslabQolish(mijoz);
      setBandlov((oldin) => ({ ...oldin, mijoz }));
      setBosqich("confirmation");
    } catch (e) {
      const xabar = e instanceof Error ? e.message : "Xatolik yuz berdi";
      setXato(xabar);

      // Vaqt band bo'lib qolgan bo'lsa, sana/vaqt tanlashga qaytaramiz
      const vaqtBand =
        (e instanceof ApiXato && e.status === 409) || xabar.includes("band qilingan");
      if (vaqtBand) {
        setBandlov((oldin) => ({ ...oldin, mijoz, vaqt: null }));
        setBosqich("datetime");
      }
    } finally {
      setYuborilmoqda(false);
    }
  }

  function qaytaBoshlash() {
    holatniTozalash();
    setBandlov(boshBandlov());
    setBosqich("datetime");
    setXato(null);
  }

  return (
    <div className="mx-auto flex min-h-[600px] max-w-4xl flex-col overflow-hidden rounded-none border-0 bg-white shadow-sm sm:rounded-2xl sm:border sm:border-gray-100 md:flex-row">
      <Sidebar usta={usta} joriyBosqich={bosqich} bandlov={bandlov} />

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {xato && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{xato}</p>
        )}

        {bosqich === "datetime" && (
          <DateTimeStep
            tanlanganSana={bandlov.sana}
            tanlanganVaqt={bandlov.vaqt}
            onDavomEt={sanaVaqtTanlandi}
          />
        )}

        {bosqich === "details" && (
          <DetailsStep
            boshlangichQiymat={bandlov.mijoz}
            onOrqaga={() => setBosqich("datetime")}
            onBandQilish={malumotTasdiqlandi}
            yuborilmoqda={yuborilmoqda}
          />
        )}

        {bosqich === "confirmation" && (
          <ConfirmationStep
            bandlov={bandlov}
            ustaIsmi={usta.ism}
            onYangiBandlov={qaytaBoshlash}
          />
        )}
      </main>
    </div>
  );
}