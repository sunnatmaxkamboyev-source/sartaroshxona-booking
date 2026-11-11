import { sorovYuborish, API_URL, ApiXato, javobniOqish } from "./api";
import type { Usta } from "../components/booking/types";

// Ochiq: mijozlar uchun usta profilini olish
export async function ustaProfiliniOlish(): Promise<Usta> {
  return sorovYuborish<Usta>("/usta");
}

// Himoyalangan: ism va lavozimni yangilash
export async function ustaProfiliniYangilash(
  token: string,
  ism: string,
  lavozim: string
): Promise<Usta> {
  return sorovYuborish<Usta>("/usta", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ism, lavozim }),
  });
}

// Himoyalangan: rasm yuklash (FormData, shuning uchun alohida)
export async function ustaRasminiYuklash(token: string, fayl: File): Promise<Usta> {
  const formData = new FormData();
  formData.append("rasm", fayl);

  try {
    const javob = await fetch(`${API_URL}/usta/rasm`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return await javobniOqish<Usta>(javob);
  } catch (e) {
    if (e instanceof ApiXato) throw e;
    throw new ApiXato("Serverga ulanib bo'lmadi, internetni tekshiring", 0);
  }
}

// Himoyalangan: rasmni o'chirish
export async function ustaRasminiOchirish(token: string): Promise<Usta> {
  return sorovYuborish<Usta>("/usta/rasm", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}