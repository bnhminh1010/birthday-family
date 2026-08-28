import { Home as HomeIcon, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF8F5] p-6">
      <div className="max-w-md w-full text-center p-10 bg-white/90 rounded-3xl border border-[#D4A017]/30 shadow-xl backdrop-blur-md">
        <div className="w-16 h-16 rounded-full bg-[#FFF4D2] flex items-center justify-center mx-auto mb-6 text-[#D4A017]">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-serif text-[#201F1C] mb-3">404</h1>
        <h2 className="text-xl font-serif italic text-[#E04848] mb-4">
          Trang không tồn tại
        </h2>
        <p className="text-[#726E65] text-sm mb-8">
          Có vẻ như đường dẫn này chưa được thắp nến. Hãy quay về trang chính nhé!
        </p>
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4A017] hover:bg-[#E5AE1E] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#D4A017]/30"
        >
          <HomeIcon className="w-4 h-4" />
          Về Trang Chủ
        </button>
      </div>
    </div>
  );
}
