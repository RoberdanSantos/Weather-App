import { useState } from "react";
import { useAuthContext } from "@/context/auth.context";
import { useToast } from "@/context/toast-context";
import { updateAddress } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Cloud, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Address() {
  const { fetchUser } = useAuthContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "cep" && value.length === 8) fetchAddress(value);
  };

  const fetchAddress = async (cep: string) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        }));
      }
    } catch (err) {
      toast({
        title: "CEP inválido",
        description: "Não foi possível localizar o endereço.",
        variant: "error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAddress(formData);
      await fetchUser();
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast({
        title: "Erro ao salvar endereço",
        description: "Tente novamente mais tarde.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="bg-sky-600 p-3 rounded-full">
            <Cloud className="h-8 w-8 text-white" />
          </Link>
        </div>

        <Card className="w-full bg-white/90 border-sky-200 shadow-lg">
          <CardContent>
            {success ? (
              <div className="text-center text-green-600 py-12 font-medium">
                Endereço salvo com sucesso! ✅
                <p className="text-sky-700 mt-2">Redirecionando...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "CEP", name: "cep" },
                  { label: "Rua", name: "street" },
                  { label: "Número", name: "number" },
                  { label: "Bairro", name: "neighborhood" },
                  { label: "Cidade", name: "city" },
                  { label: "Estado", name: "state" },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                ))}
                <Button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Finalizar Cadastro"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          {!success && (
            <CardFooter className="text-center text-sm">
              Já tem uma conta?
              <Link
                to="/login"
                className="text-sky-600 hover:text-sky-800 ml-1 font-medium"
              >
                Entrar
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
