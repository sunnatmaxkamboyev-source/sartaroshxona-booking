import { sorovYuborish } from "./api";
import type { MijozMalumotlari } from "../components/booking/types";
import { sanaKaliti, sananiYuborishUchun } from "../components/booking/sana";

export async function bandlovYaratish(sana: Date, vaqt: string, mijoz: MijozMalumotlari) {
  return sorovYuborish("/bandlovlar", {
    method: "POST",
    body: JSON.stringify({
      sana: sananiYuborishUchun(sana),
      vaqt,
      ism: mijoz.ism,
      telefon: mijoz.telefon,
      joy: mijoz.joy,
      xizmatlar: mijoz.xizmatlar,
      izoh: mijoz.izoh,
    }),
  });
}

export async function bandVaqtlarniOlish(sana: Date): Promise<string[]> {
  const natija = await sorovYuborish<{ bandVaqtlar: string[] }>(
    `/bandlovlar/band-vaqtlar?sana=${sanaKaliti(sana)}`
  );
  return natija.bandVaqtlar;
}