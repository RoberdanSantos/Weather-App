import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/auth.context";
import { useNavigate } from "react-router-dom";
import { getUserProfile, deleteUserAccount } from "@/lib/api";
import { useToast } from "@/context/toast-context";
import { AtSign, Calendar, Edit, MapPin, Trash2, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const { toast } = useToast();
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      setUser(res.data);
    } catch {
      toast({ title: "Erro", description: "Erro ao carregar perfil." });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso.",
      });
      logout();
    } catch {
      toast({ title: "Erro", description: "Erro ao excluir conta." });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return null;

  return (
    <main className="max-h-screen bg-gradient-to-b from-sky-100 to-sky-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-sky-900">Meu Perfil</h1>
          <Button
            className="bg-sky-600 hover:bg-sky-700 cursor-pointer"
            onClick={() => navigate("/profile/edit")}
          >
            <Edit className="h-4 w-4 mr-2" /> Editar Perfil
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <Card className="bg-white/90 border-sky-200">
            <CardHeader>
              <CardTitle className="text-lg">{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <AtSign className="h-4 w-4 mr-2 text-sky-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-sky-500" />
                  <span>
                    {user?.address?.city}, {user?.address?.state}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-sky-500" />
                  <span>
                    Membro desde{" "}
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-red-500 border-red-200 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tem certeza que deseja excluir sua conta?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação é irreversível. Todos os seus dados serão
                        permanentemente excluídos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-500 hover:bg-red-600 cursor-pointer"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card className="bg-white/90 border-sky-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-sky-500" />
                  Informações da Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Nome Completo
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {user.name}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {user.email}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Cidade
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {user.address?.city}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Estado
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {user.address?.state}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
