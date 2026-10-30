import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import DateTimeStep from "./DateTimeStep";
import DetailsStep from "./DetailsStep";
import ConfirmationStep from "./ConfirmationStep";
import type { BookingStep, BandlovMalumotlari, Usta } from "./types";
import { holatniOqish, holatniSaqlash, holatniTozalash } from "./storage";

const USTA: Usta = {
  ism: "Jasur Aliyev",
  lavozim: "Bosh sartarosh",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
};

const BOSH_BANDLOV: BandlovMalumotlari = {
  sana: null,
  vaqt: null,
  mijoz: {
    ism: "",
    telefon: "",
    joy: "salon",
    xizmatlar: [],
    izoh: "",
  },
};

const SAQLANGAN = holatniOqish();

export default function BookingFlow() {
  const [bosqich, setBosqich] = useState<BookingStep>(SAQLANGAN?.bosqich ?? "datetime");
  const [bandlov, setBandlov] = useState<BandlovMalumotlari>(SAQLANGAN?.bandlov ?? BOSH_BANDLOV);

  useEffect(() => {
    holatniSaqlash(bosqich, bandlov);
  }, [bosqich, bandlov]);

  function sanaVaqtTanlandi(sana: Date, vaqt: string) {
    setBandlov((oldin) => ({ ...oldin, sana, vaqt }));
    setBosqich("details");
  }

  function malumotTasdiqlandi(mijoz: BandlovMalumotlari["mijoz"]) {
    setBandlov((oldin) => ({ ...oldin, mijoz }));
    setBosqich("confirmation");
  }

  function qaytaBoshlash() {
    setBandlov(BOSH_BANDLOV);
    setBosqich("datetime");
    holatniTozalash();
  }

  return (
    <div className="mx-auto flex min-h-[600px] max-w-4xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <Sidebar usta={USTA} joriyBosqich={bosqich} bandlov={bandlov} />

      <main className="flex-1 p-8">
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
          />
        )}

        {bosqich === "confirmation" && (
          <ConfirmationStep bandlov={bandlov} onYangiBandlov={qaytaBoshlash} />
        )}
      </main>
    </div>
  );
}