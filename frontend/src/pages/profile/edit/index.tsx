import { useEffect, useState } from "react";
import { useToast } from "@/context/toast-context";
import {
  updateUserProfile,
  updateUserPassword,
  updateAddress,
  getProfile,
} from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch {
        toast({ title: "Erro", description: "Falha ao carregar perfil." });
      }
    };
    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    if (!passwordData.currentPassword)
      newErrors.currentPassword = "Senha atual obrigatória.";
    if (!passwordData.newPassword)
      newErrors.newPassword = "Nova senha obrigatória.";
    else if (passwordData.newPassword.length < 6)
      newErrors.newPassword = "A senha deve ter pelo menos 6 caracteres.";
    if (passwordData.newPassword !== passwordData.confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      await updateUserProfile({
        name: profile.name,
        email: profile.email,
      });
      toast({ title: "Sucesso", description: "Perfil atualizado." });
    } catch {
      toast({ title: "Erro", description: "Erro ao atualizar perfil." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      setIsLoading(true);
      await updateAddress(profile.address);
      toast({ title: "Sucesso", description: "Endereço atualizado." });
    } catch {
      toast({ title: "Erro", description: "Erro ao atualizar endereço." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    try {
      setIsLoading(true);
      await updateUserPassword(passwordData);
      toast({ title: "Sucesso", description: "Senha alterada." });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast({ title: "Erro", description: "Erro ao atualizar senha." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <main className="max-h-screen bg-gradient-to-b from-sky-100 to-sky-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6 text-center">
          <Button
            variant="ghost"
            size="default"
            className="w-auto h-auto flex justify-center cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-sky-900">Editar Perfil</h1>
        </div>

        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 self-center w-full">
            <TabsTrigger value="dados" className="cursor-pointer">
              Dados
            </TabsTrigger>
            <TabsTrigger value="endereco" className="cursor-pointer">
              Endereço
            </TabsTrigger>
            <TabsTrigger value="senha" className="cursor-pointer">
              Senha
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dados">
            <Card className="bg-white/90 border-sky-200">
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="endereco">
            <Card className="bg-white/90 border-sky-200">
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Rua</Label>
                  <Textarea
                    name="street"
                    value={profile.address?.street || ""}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input
                      name="city"
                      value={profile.address?.city || ""}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Input
                      name="state"
                      value={profile.address?.state || ""}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <Input
                      name="cep"
                      value={profile.address?.cep || ""}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bairro</Label>
                    <Input
                      name="neighborhood"
                      value={profile.address?.neighborhood || ""}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  onClick={handleSaveAddress}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="senha">
            <Card className="bg-white/90 border-sky-200">
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Senha Atual</Label>
                  <Input
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.currentPassword && (
                    <p className="text-sm text-red-500">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nova Senha</Label>
                  <Input
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">{errors.newPassword}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Confirmar Nova Senha</Label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Alterar Senha"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
