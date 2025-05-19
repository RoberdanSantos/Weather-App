import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  Calendar,
  Clock,
  History,
  Trash2,
  Search,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSearchLogs, clearSearchLogs, deleteSearchLog } from "@/lib/api";
import { useToast } from "@/context/toast-context";
import { LogItem } from "@/types/genereic-types";
import { formatDate, formatTime } from "@/lib/time-formats";

export default function Historic() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const iconMap = {
    ensolarado: <Sun className="h-5 w-5 text-amber-500" />,
    nublado: <Cloud className="h-5 w-5 text-sky-500" />,
    chuva: <CloudRain className="h-5 w-5 text-sky-600" />,
    garoa: <CloudDrizzle className="h-5 w-5 text-sky-400" />,
    neve: <CloudSnow className="h-5 w-5 text-sky-300" />,
    tempestade: <CloudLightning className="h-5 w-5 text-indigo-700" />,
  };

  const loadLogs = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await getSearchLogs(pageNum, 10);
      setLogs(res.data.logs);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearSearchLogs();
      setLogs([]);
      toast({
        title: "Histórico limpo",
        description: "Todo o histórico foi removido com sucesso.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao limpar histórico.",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteSearchLog(id);
      setLogs((prev) => prev.filter((log) => log.id !== id));
      toast({
        title: "Item removido",
        description: "Busca removida com sucesso.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao remover item.",
        variant: "destructive",
      });
    }
  };

  const redirectToSearch = (location: string) => {
    localStorage.setItem("weather@selectedCity", location);
    navigate("/");
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <main className="max-h-screen bg-gradient-to-b from-sky-100 to-sky-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-sky-900">
              Histórico de Buscas
            </h1>
          </div>

          {!!logs.length && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar histórico
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso removerá todo seu histórico de buscas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600 cursor-pointer"
                    onClick={handleClear}
                  >
                    Limpar tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {loading ? (
          <Card className="bg-white/80 border-sky-200">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center gap-4"
                  >
                    <div className="h-4 bg-sky-200/50 rounded w-1/4" />
                    <div className="h-4 bg-sky-200/50 rounded w-1/6" />
                    <div className="h-4 bg-sky-200/50 rounded w-1/6" />
                    <div className="h-4 bg-sky-200/50 rounded w-1/6" />
                    <div className="h-4 bg-sky-200/50 rounded w-1/6" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : logs.length === 0 ? (
          <Card className="bg-white/80 border-sky-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                <History className="h-6 w-6 text-sky-500" />
              </div>
              <h2 className="text-xl font-semibold text-sky-900 mb-2">
                Nenhuma busca registrada
              </h2>
              <p className="text-sky-700 mb-6 text-center max-w-md">
                As cidades pesquisadas aparecerão aqui.
              </p>
              <Button
                className="bg-sky-600 hover:bg-sky-700 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar agora
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/80 border-sky-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <History className="h-5 w-5 mr-2 text-sky-500" />
                Últimas buscas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Clima</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-sky-500 mr-1.5" />
                            {log.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {iconMap[log.condition as keyof typeof iconMap]}
                            <span className="ml-2">{log.temperature}°C</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-gray-500">
                            <Calendar className="h-4 w-4 mr-1.5" />
                            {formatDate(log.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-1.5" />
                            {formatTime(log.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-sky-600 hover:text-sky-700 cursor-pointer"
                              onClick={() => redirectToSearch(log.location)}
                            >
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                              onClick={() => handleRemove(log.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-center mt-4">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`cursor-pointer ${page === 1 ? "hidden" : ""}`}
                    onClick={() => loadLogs(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-sky-900">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`cursor-pointer ${page === totalPages ? "hidden" : ""}`}
                    onClick={() => loadLogs(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
