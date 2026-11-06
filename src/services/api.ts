const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Barcha so'rovlar uchun umumiy "yordamchi" funksiya
async function sorovYuborish(
  manzil: string,
  sozlamalar: RequestInit = {}
): Promise<any> {
  const javob = await fetch(`${API_URL}${manzil}`, {
    ...sozlamalar,
    headers: {
      "Content-Type": "application/json",
      ...sozlamalar.headers,
    },
  });

  const malumot = await javob.json();

  if (!javob.ok) {
    throw new Error(malumot.xabar || "Noma'lum xatolik yuz berdi");
  }

  return malumot;
}

export { sorovYuborish, API_URL };