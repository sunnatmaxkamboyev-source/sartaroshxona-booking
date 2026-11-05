import { useState } from "react";
import { kirish } from "../../services/authApi";
import { tokenniSaqlash } from "../../services/authStorage";

interface LoginFormProps {
  onMuvaffaqiyatliKirish: () => void;
}

export default function LoginForm({ onMuvaffaqiyatliKirish }: LoginFormProps) {
  const [login, setLogin] = useState("");
  const [parol, setParol] = useState("");
  const [xato, setXato] = useState<string | null>(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(false);

  async function formaYuborildi(e: React.FormEvent) {
    e.preventDefault();
    setXato(null);

    if (!login.trim() || !parol.trim()) {
      setXato("Login va parolni kiriting");
      return;
    }

    setYuklanmoqda(true);
    try {
      const natija = await kirish(login, parol);
      tokenniSaqlash(natija.token);
      onMuvaffaqiyatliKirish();
    } catch (e) {
      const xabar = e instanceof Error ? e.message : "Kirishda xatolik yuz berdi";
      setXato(xabar);
    } finally {
      setYuklanmoqda(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="mb-1 font-serif text-xl font-semibold text-gray-900 sm:text-2xl">
        Sartarosh paneliga kirish
      </h1>
      <p className="mb-6 text-sm text-gray-400">
        Faqat sartaroshning o'ziga mo'ljallangan bo'lim
      </p>

      <form onSubmit={formaYuborildi}>
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Login</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Login"
            autoComplete="username"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-800"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Parol</label>
          <input
            type="password"
            value={parol}
            onChange={(e) => setParol(e.target.value)}
            placeholder="Parol"
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-800"
          />
        </div>

        {xato && <p className="mb-4 text-sm text-red-500">{xato}</p>}

        <button
          type="submit"
          disabled={yuklanmoqda}
          className="w-full rounded-lg bg-teal-800 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {yuklanmoqda ? "Kirilmoqda..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}