import { useState } from "react";
import BookingFlow from "./components/booking/BookingFlow";
import UstaPaneli from "./components/admin/UstaPaneli";
import LoginForm from "./components/admin/LoginForm";
import { tokenniOqish } from "./services/authStorage";

type Sahifa = "mijoz" | "admin";

export default function App() {
  const [sahifa, setSahifa] = useState<Sahifa>("mijoz");
  const [kirilgan, setKirilgan] = useState<boolean>(() => !!tokenniOqish());

  function adminTugmasiBosildi() {
    setSahifa("admin");
    setKirilgan(!!tokenniOqish());
  }

  return (
    <div className="min-h-screen bg-gray-50 py-0 sm:px-4 sm:py-10">
      <div className="mx-auto mb-4 flex max-w-4xl justify-center gap-2 px-4 pt-4 sm:px-0 sm:pt-0">
        <button
          onClick={() => setSahifa("mijoz")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            sahifa === "mijoz"
              ? "bg-teal-800 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Mijoz ko'rinishi
        </button>
        <button
          onClick={adminTugmasiBosildi}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            sahifa === "admin"
              ? "bg-teal-800 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Sartarosh paneli
        </button>
      </div>

      {sahifa === "mijoz" && <BookingFlow />}

      {sahifa === "admin" && !kirilgan && (
        <LoginForm onMuvaffaqiyatliKirish={() => setKirilgan(true)} />
      )}

      {sahifa === "admin" && kirilgan && (
        <UstaPaneli onChiqish={() => {
          setKirilgan(false);
          setSahifa("mijoz");
        }} />
      )}
    </div>
  );
}