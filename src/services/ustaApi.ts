import { sorovYuborish, API_URL } from "./api";

// Ochiq — mijozlar uchun usta profilini olish
export async function ustaProfiliniOlish() {
  return sorovYuborish("/usta");
}

// Himoyalangan — ism/lavozimni yangilash
export async function ustaProfiliniYangilash(
  token: string,
  ism: string,
  lavozim: string
) {
  return sorovYuborish("/usta", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ism, lavozim }),
  });
}

// Himoyalangan — rasm yuklash (fayl, JSON emas — shuning uchun alohida yozilgan)
export async function ustaRasminiYuklash(token: string, fayl: File) {
  const formData = new FormData();
  formData.append("rasm", fayl);

  const javob = await fetch(`${API_URL}/usta/rasm`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const malumot = await javob.json();
  if (!javob.ok) {
    throw new Error(malumot.xabar || "Rasmni yuklashda xatolik");
  }
  return malumot;
}

// Himoyalangan — rasmni o'chirish
export async function ustaRasminiOchirish(token: string) {
  return sorovYuborish("/usta/rasm", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}