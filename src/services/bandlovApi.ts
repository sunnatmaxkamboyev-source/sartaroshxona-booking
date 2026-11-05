import { sorovYuborish } from "./api";
import type { MijozMalumotlari } from "../components/booking/types";


export async function bandlovYaratish(
  sana: Date,
  vaqt: string,
  mijoz: MijozMalumotlari
) {
  return sorovYuborish("/bandlovlar", {
    method: "POST",
    body: JSON.stringify({
      sana: sana.toISOString(),
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
  const sanaMatni = sana.toISOString().split("T")[0]; 
  const natija = await sorovYuborish(`/bandlovlar/band-vaqtlar?sana=${sanaMatni}`);
  return natija.bandVaqtlar;
}