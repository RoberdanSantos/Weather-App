import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFavoritesPaginated,
  addFavorite,
  deleteFavorite,
  getWeatherByCity,
} from "@/lib/api";
import { useToast } from "@/context/toast-context";
import {
  MapPin,
  Trash2,
  Loader2,
  Plus,
  Search,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FavoriteLocation } from "@/types/genereic-types";

export default function Favorites() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadFavorites = async (pageNum = 1) => {
    try {
      const res = await getFavoritesPaginated(pageNum, 9);
      setFavorites(res.data.favorites);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch {
      toast({ title: "Erro", description: "Erro ao carregar favoritos." });
    }
  };

  const handleAdd = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);

    try {
      const res = await getWeatherByCity(searchQuery);
      const { name, sys } = res.data;

      await addFavorite({
        name,
        country: sys.country,
      });

      toast({
        title: "Adicionado",
        description: `${name} foi adicionado aos favoritos.`,
      });
      setSearchQuery("");
      setIsDialogOpen(false);
      loadFavorites();
    } catch {
      toast({ title: "Erro", description: "Cidade não encontrada." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await deleteFavorite(id);
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
      toast({
        title: "Removido",
        description: "Cidade removida dos favoritos.",
      });
    } catch {
      toast({ title: "Erro", description: "Erro ao remover cidade." });
    } finally {
      setRemovingId(null);
    }
  };

  const redirectToSearch = (location: string) => {
    localStorage.setItem("weather@selectedCity", location);
    navigate("/");
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <main className="max-h-screen bg-gradient-to-b from-sky-100 to-sky-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-sky-900">
              Cidades Favoritas
            </h1>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sky-600 hover:bg-sky-700 cursor-pointer">
                <Plus className="h-4 w-4 mr-2" /> Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova cidade</DialogTitle>
                <DialogDescription>
                  Busque por uma cidade para adicionar aos favoritos.
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-2 my-4">
                <div className="relative flex-grow">
                  <Input
                    placeholder="Digite uma cidade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  onClick={handleAdd}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Buscar"
                  )}
                </Button>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center text-gray-500">
            Nenhuma cidade favorita ainda.
          </div>
        ) : (
          <>
            <div className="min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((fav) => (
                  <Card
                    key={fav.id}
                    className="bg-white/90 border-sky-200 overflow-hidden py-2"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex justify-between items-center">
                        <div className="flex items-center justify-center gap-2">
                          <MapPin className="h-4 w-4 text-sky-500 mr-1.5 flex-shrink-0" />
                          <span className="truncate">{fav.name}</span>
                          <p className="text-sm text-gray-500">{fav.country}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500 cursor-pointer"
                          onClick={() => handleRemove(fav.id)}
                          disabled={removingId === fav.id}
                        >
                          {removingId === fav.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Remover dos favoritos</span>
                        </Button>
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sky-600 cursor-pointer"
                        onClick={() => redirectToSearch(fav.name)}
                      >
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        Ver Tempo
                      </Button>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => loadFavorites(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sky-800 font-medium">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => loadFavorites(page + 1)}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
