import { useEffect, useMemo, useState } from "react";
import { bandVaqtlarniOlish } from "../../services/bandlovApi";
import { vaqtOtganmi } from "./sana";

interface DateTimeStepProps {
  tanlanganSana: Date | null;
  tanlanganVaqt: string | null;
  onDavomEt: (sana: Date, vaqt: string) => void;
}

const OY_NOMLARI = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

const HAFTA_KUNLARI = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const HAFTA_KUNI_NOMLARI = [
  "Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba",
];

// Sartaroshxonaning barcha mumkin bo'lgan vaqt oraliqlari
const BARCHA_VAQTLAR = ["09:00", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];

export default function DateTimeStep({
  tanlanganSana,
  tanlanganVaqt,
  onDavomEt,
}: DateTimeStepProps) {
  const bugun = useMemo(() => new Date(), []);
  const [korinishOy, setKorinishOy] = useState(() => {
    const asos = tanlanganSana ?? bugun;
    return new Date(asos.getFullYear(), asos.getMonth(), 1);
  });
  const [ichkiSana, setIchkiSana] = useState<Date | null>(tanlanganSana);
  const [ichkiVaqt, setIchkiVaqt] = useState<string | null>(tanlanganVaqt);

  const [bandVaqtlar, setBandVaqtlar] = useState<string[]>([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [xato, setXato] = useState<string | null>(null);
  const [urinish, setUrinish] = useState(0);

  // Sana tanlanganda backenddan shu kun uchun band vaqtlarni so'raymiz
  useEffect(() => {
    if (!ichkiSana) return;

    let bekorQilindi = false;
    setYuklanmoqda(true);
    setXato(null);

    bandVaqtlarniOlish(ichkiSana)
      .then((natija) => {
        if (!bekorQilindi) setBandVaqtlar(natija);
      })
      .catch((e) => {
        if (!bekorQilindi) {
          setXato(e instanceof Error ? e.message : "Band vaqtlarni yuklab bo'lmadi");
        }
      })
      .finally(() => {
        if (!bekorQilindi) setYuklanmoqda(false);
      });

    // Boshqa sanaga o'tilsa, eski so'rov natijasi e'tiborsiz qoladi
    return () => {
      bekorQilindi = true;
    };
  }, [ichkiSana, urinish]);

  const kunlar = useMemo(() => {
    const yil = korinishOy.getFullYear();
    const oy = korinishOy.getMonth();
    const birinchiKun = (new Date(yil, oy, 1).getDay() + 6) % 7; // Dushanba = 0
    const oydagiKunlar = new Date(yil, oy + 1, 0).getDate();

    const katakchalar: (number | null)[] = Array(birinchiKun).fill(null);
    for (let kun = 1; kun <= oydagiKunlar; kun++) katakchalar.push(kun);
    return katakchalar;
  }, [korinishOy]);

  const joriyOyBoshida =
    korinishOy.getFullYear() === bugun.getFullYear() &&
    korinishOy.getMonth() === bugun.getMonth();

  function oyniOzgartir(delta: number) {
    if (delta < 0 && joriyOyBoshida) return;
    setKorinishOy((oldin) => new Date(oldin.getFullYear(), oldin.getMonth() + delta, 1));
  }

  function sanaOtkmi(kun: number): boolean {
    const sana = new Date(korinishOy.getFullYear(), korinishOy.getMonth(), kun);
    const bugunBoshi = new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate());
    return sana < bugunBoshi;
  }

  function sanaTanlash(kun: number) {
    if (sanaOtkmi(kun)) return;
    setIchkiSana(new Date(korinishOy.getFullYear(), korinishOy.getMonth(), kun));
    setIchkiVaqt(null);
  }

  const sarlavha = ichkiSana
    ? `${HAFTA_KUNI_NOMLARI[ichkiSana.getDay()]}, ${ichkiSana.getDate()}-${OY_NOMLARI[ichkiSana.getMonth()]}`
    : "Avval sanani tanlang";

  return (
    <div className="max-w-xl">
      <h1 className="mb-4 font-serif text-xl font-semibold text-gray-900 sm:mb-6 sm:text-2xl">
        Sana va vaqtni tanlang
      </h1>

      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        {/* Kalendar */}
        <div className="w-full shrink-0 md:w-[300px]">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              disabled={joriyOyBoshida}
              onClick={() => oyniOzgartir(-1)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors ${
                joriyOyBoshida
                  ? "cursor-not-allowed border-gray-100 text-gray-300"
                  : "border-gray-200 text-gray-700 hover:border-teal-800 hover:bg-teal-50"
              }`}
              aria-label="Oldingi oy"
            >
              ‹
            </button>
            <span className="text-sm font-medium text-gray-900">
              {OY_NOMLARI[korinishOy.getMonth()]} {korinishOy.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => oyniOzgartir(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-800 text-sm text-white transition-colors hover:bg-teal-900"
              aria-label="Keyingi oy"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center">
            {HAFTA_KUNLARI.map((kun) => (
              <span key={kun} className="text-xs text-gray-400">
                {kun}.
              </span>
            ))}

            {kunlar.map((kun, i) => {
              if (kun === null) return <span key={`bosh-${i}`} />;

              const sana = new Date(korinishOy.getFullYear(), korinishOy.getMonth(), kun);
              const tanlanganmi = ichkiSana?.toDateString() === sana.toDateString();
              const bugunmi = bugun.toDateString() === sana.toDateString();
              const otkanmi = sanaOtkmi(kun);

              return (
                <button
                  key={kun}
                  type="button"
                  disabled={otkanmi}
                  onClick={() => sanaTanlash(kun)}
                  aria-label={`${kun}-${OY_NOMLARI[korinishOy.getMonth()]}`}
                  aria-pressed={!!tanlanganmi}
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                    tanlanganmi
                      ? "bg-teal-800 text-white"
                      : otkanmi
                      ? "text-gray-300"
                      : `text-gray-700 hover:bg-teal-50 ${bugunmi ? "border border-teal-800" : ""}`
                  }`}
                >
                  {kun}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vaqt ro'yxati */}
        <div className="flex-1 border-t border-gray-100 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <p className="mb-4 text-sm font-medium text-gray-900">{sarlavha}</p>

          {yuklanmoqda && <p className="text-sm text-gray-400">Band vaqtlar yuklanmoqda...</p>}

          {xato && (
            <div className="text-sm text-red-500">
              <p>{xato}</p>
              <button
                type="button"
                onClick={() => setUrinish((n) => n + 1)}
                className="mt-2 text-teal-800 underline"
              >
                Qayta urinish
              </button>
            </div>
          )}

          {ichkiSana && !yuklanmoqda && !xato && (
            <div className="flex flex-col gap-2">
              {BARCHA_VAQTLAR.map((vaqt) => {
                const band = bandVaqtlar.includes(vaqt);
                const otgan = vaqtOtganmi(ichkiSana, vaqt);
                const ochiq = !band && !otgan;
                return (
                  <button
                    key={vaqt}
                    type="button"
                    disabled={!ochiq}
                    onClick={() => setIchkiVaqt(vaqt)}
                    className={`rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
                      !ochiq
                        ? "cursor-not-allowed border-gray-100 text-gray-300"
                        : ichkiVaqt === vaqt
                        ? "border-teal-800 bg-teal-800 text-white"
                        : "border-gray-200 text-gray-700 hover:border-teal-800"
                    }`}
                  >
                    {vaqt}
                    {band && " — band"}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={!ichkiSana || !ichkiVaqt}
        onClick={() => ichkiSana && ichkiVaqt && onDavomEt(ichkiSana, ichkiVaqt)}
        className="mt-8 w-full rounded-lg bg-teal-800 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:bg-gray-200"
      >
        Davom etish
      </button>
    </div>
  );
}