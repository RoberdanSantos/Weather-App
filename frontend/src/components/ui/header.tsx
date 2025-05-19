import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth.context";

export function Header() {
  const { isAuthenticated, logout, user } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isAuthenticated || !user?.address) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-200 bg-white/80 backdrop-blur-sm px-10">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Cloud className="h-6 w-6 text-sky-600" />
          <span className="text-xl font-bold text-sky-900">WeatherApp</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-sky-900 hover:text-sky-700"
          >
            Home
          </Link>
          <Link
            to="/historic"
            className="text-sm font-medium text-sky-900 hover:text-sky-700"
          >
            Histórico
          </Link>
          <Link
            to="/favorites"
            className="text-sm font-medium text-sky-900 hover:text-sky-700"
          >
            Favoritos
          </Link>
          <Link
            to="/profile"
            className="text-sm font-medium text-sky-900 hover:text-sky-700"
          >
            Perfil
          </Link>
          <Button
            variant="outline"
            className="text-sm font-medium text-sky-600 hover:text-sky-700 cursor-pointer"
            onClick={logout}
          >
            Sair
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="absolute left-0 top-16 w-full z-40 bg-white border-t border-sky-100 px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-sky-900"
            >
              Home
            </Link>
            <Link
              to="/historic"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-sky-900"
            >
              Histórico
            </Link>
            <Link
              to="/favorites"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-sky-900"
            >
              Favoritos
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-sky-900"
            >
              Perfil
            </Link>
            <Button
              variant="outline"
              className="text-sm font-medium text-sky-600 justify-start"
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
            >
              Logout
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
