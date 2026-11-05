import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import DateTimeStep from "./DateTimeStep";
import DetailsStep from "./DetailsStep";
import ConfirmationStep from "./ConfirmationStep";
import type { BookingStep, BandlovMalumotlari, Usta } from "./types";
import { holatniOqish, holatniSaqlash, holatniTozalash } from "./storage";
import { bandlovYaratish } from "../../services/bandlovApi";
import { ustaProfiliniOlish } from "../../services/ustaApi";

const STANDART_USTA: Usta = {
  ism: "Sartarosh",
  lavozim: "",
  avatarUrl: "",
};

const BOSH_MIJOZ: BandlovMalumotlari["mijoz"] = {
  ism: "",
  telefon: "",
  joy: "salon",
  xizmatlar: [],
  izoh: "",
};

const BOSH_BANDLOV: BandlovMalumotlari = {
  sana: null,
  vaqt: null,
  mijoz: BOSH_MIJOZ,
};

export default function BookingFlow() {
  const [usta, setUsta] = useState<Usta>(STANDART_USTA);

  const [bosqich, setBosqich] = useState<BookingStep>(() => {
    const saqlangan = holatniOqish();
    return saqlangan ? saqlangan.bosqich : "datetime";
  });

  const [bandlov, setBandlov] = useState<BandlovMalumotlari>(() => {
    const saqlangan = holatniOqish();
    return saqlangan ? saqlangan.bandlov : BOSH_BANDLOV;
  });

  const [yuborilmoqda, setYuborilmoqda] = useState(false);
  const [xato, setXato] = useState<string | null>(null);

  // Sahifa ochilganda — usta profilini backenddan olamiz
  useEffect(() => {
    ustaProfiliniOlish()
      .then((natija) => setUsta(natija))
      .catch(() => {
        // Backend vaqtincha ishlamasa ham, sayt umuman ishlamay qolmasin
        console.error("Usta profilini yuklab bo'lmadi");
      });
  }, []);

  useEffect(() => {
    holatniSaqlash(bosqich, bandlov);
  }, [bosqich, bandlov]);

  function sanaVaqtTanlandi(sana: Date, vaqt: string) {
    setBandlov((oldin) => ({ ...oldin, sana, vaqt }));
    setBosqich("details");
  }

  async function malumotTasdiqlandi(mijoz: BandlovMalumotlari["mijoz"]) {
    if (!bandlov.sana || !bandlov.vaqt) return;

    setYuborilmoqda(true);
    setXato(null);

    try {
      await bandlovYaratish(bandlov.sana, bandlov.vaqt, mijoz);
      setBandlov((oldin) => ({ ...oldin, mijoz }));
      setBosqich("confirmation");
    } catch (e) {
      const xabar = e instanceof Error ? e.message : "Xatolik yuz berdi";
      setXato(xabar);
      // Agar vaqt band bo'lib qolgan bo'lsa — sana/vaqt tanlashga qaytaramiz
      if (xabar.includes("band qilingan")) {
        setBosqich("datetime");
      }
    } finally {
      setYuborilmoqda(false);
    }
  }

  function qaytaBoshlash() {
    holatniTozalash();
    setBandlov(BOSH_BANDLOV);
    setBosqich("datetime");
    setXato(null);
  }

  return (
    <div className="mx-auto flex min-h-[600px] max-w-4xl flex-col overflow-hidden rounded-none border-0 bg-white shadow-sm sm:rounded-2xl sm:border sm:border-gray-100 md:flex-row">
      <Sidebar usta={usta} joriyBosqich={bosqich} bandlov={bandlov} />

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {xato && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {xato}
          </p>
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
          <ConfirmationStep bandlov={bandlov} onYangiBandlov={qaytaBoshlash} />
        )}
      </main>
    </div>
  );
}