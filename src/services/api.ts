const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

export class ApiXato extends Error {
  status: number;

  constructor(xabar: string, status: number) {
    super(xabar);
    this.name = "ApiXato";
    this.status = status;
  }
}

// "/uploads/a.jpg" -> "https://server/uploads/a.jpg"
export function rasmManzili(yol: string): string {
  if (!yol) return "";
  return /^https?:\/\//.test(yol) ? yol : `${SERVER_URL}${yol}`;
}

export async function javobniOqish<T = any>(javob: Response): Promise<T> {
  const malumot = await javob.json().catch(() => ({}));
  if (!javob.ok) {
    throw new ApiXato(malumot.xabar || "Noma'lum xatolik yuz berdi", javob.status);
  }
  return malumot as T;
}

async function sorovYuborish<T = any>(
  manzil: string,
  sozlamalar: RequestInit = {}
): Promise<T> {
  let javob: Response;
  try {
    javob = await fetch(`${API_URL}${manzil}`, {
      ...sozlamalar,
      headers: {
        "Content-Type": "application/json",
        ...sozlamalar.headers,
      },
    });
  } catch {
    throw new ApiXato("Serverga ulanib bo'lmadi, internetni tekshiring", 0);
  }
  return javobniOqish<T>(javob);
}

export { sorovYuborish, API_URL };