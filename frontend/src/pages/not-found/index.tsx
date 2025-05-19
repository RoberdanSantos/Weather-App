import { useNavigate } from "react-router-dom";
import { Cloud, CloudOff, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="max-h-screen bg-gradient-to-b from-sky-100 to-sky-50 flex flex-col items-center justify-center p-4 py-14 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Cloud className="h-48 w-48 text-sky-700 animate-pulse" />
        </div>
        <div className="relative z-10 bg-white/80 p-6 rounded-full shadow-lg border border-sky-200">
          <CloudOff className="h-24 w-24 text-sky-600" />
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-sky-800 mb-2">
        Página não encontrada
      </h2>

      <div className="max-w-md mb-8">
        <p className="text-sky-700 mb-6">
          Parece que esta previsão se perdeu nas nuvens. A página que você
          procura não existe ou foi movida para outro lugar.
        </p>
        <div className="flex justify-center gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-16 bg-sky-400 rounded-full opacity-70"
              style={{
                animation: `rainDrop 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <Button
        onClick={() => navigate('/')}
        className="bg-sky-600 hover:bg-sky-700 cursor-pointer"
      >
        <Home className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <style>{`
        @keyframes rainDrop {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
