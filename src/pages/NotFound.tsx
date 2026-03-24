import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-slate-400 mb-8">
          Sahifa topilmadi yoki boshqa joyga ko'chirilgan
        </p>
        <Link to="/">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Bosh Sahifaga Qaytish
          </Button>
        </Link>
      </div>
    </div>
  );
}
