import type { BookingStep, Usta, BandlovMalumotlari } from "./types";
import { BOSQICHLAR } from "./types";

interface SidebarProps {
  usta: Usta;
  joriyBosqich: BookingStep;
  bandlov: BandlovMalumotlari;
}

function sanaFormat(sana: Date | null): string {
  if (!sana) return "Sana tanlanmagan";
  return sana.toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Sidebar({ usta, joriyBosqich, bandlov }: SidebarProps) {
  const joriyIndex = BOSQICHLAR.findIndex((b) => b.key === joriyBosqich);

  return (
    <aside className="w-full max-w-[260px] shrink-0 border-r border-gray-100 p-6">
    
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-teal-800">
          <span className="font-serif text-lg font-semibold text-teal-800">S</span>
        </div>
        <span className="font-serif text-lg font-semibold tracking-tight text-teal-900">
          Sartaroshxona
        </span>
      </div>

      
      <div className="mb-8">
        <img
          src={usta.avatarUrl}
          alt={usta.ism}
          className="mb-3 h-12 w-12 rounded-full object-cover"
        />
        <p className="text-xs text-gray-400">{usta.lavozim}</p>
        <p className="text-base font-medium text-gray-900">{usta.ism}</p>
      </div>

      
      <ol className="relative">
        {BOSQICHLAR.map((bosqich, index) => {
          const holat =
            index < joriyIndex
              ? "tugallangan"
              : index === joriyIndex
              ? "faol"
              : "kutilmoqda";

          return (
            <li key={bosqich.key} className="relative pb-8 pl-9 last:pb-0">
              {index < BOSQICHLAR.length - 1 && (
                <span
                  className={`absolute left-[11px] top-6 h-full w-px ${
                    holat === "tugallangan" ? "bg-teal-700" : "bg-gray-200"
                  }`}
                  style={{ borderLeft: holat === "kutilmoqda" ? "1px dashed #e5e7eb" : undefined }}
                />
              )}
              <span
                className={`absolute left-0 top-0 flex h-[22px] w-[22px] items-center justify-center rounded-full border text-[10px] ${
                  holat === "faol"
                    ? "border-teal-700 bg-teal-700 text-white"
                    : holat === "tugallangan"
                    ? "border-teal-700 bg-white text-teal-700"
                    : "border-gray-300 bg-white text-gray-300"
                }`}
              >
                {holat === "tugallangan" ? "✓" : index + 1}
              </span>
              <p
                className={`text-sm ${
                  holat === "kutilmoqda" ? "text-gray-400" : "text-gray-900"
                } ${holat === "faol" ? "font-medium" : ""}`}
              >
                {bosqich.label}
              </p>
              {bosqich.key === "datetime" && holat !== "kutilmoqda" && (
                <p className="mt-1 text-xs text-gray-400">{sanaFormat(bandlov.sana)}</p>
              )}
              {bosqich.key === "details" && bandlov.vaqt && holat !== "kutilmoqda" && (
                <p className="mt-1 text-xs text-gray-400">{bandlov.vaqt}</p>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}