import { useState } from "react";
import { useToast } from "@/context/toast-context";
import { Cloud, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/auth.context";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, fetchUser } = useAuthContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (!formData.name) {
      newErrors.name = "Nome é obrigatório";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha precisa ter pelo menos 6 caracteres";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(formData);
      await fetchUser();
      navigate("/signup/address");
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 400 && message === "Email já cadastrado") {
        setErrors({ name: "", email: "Email já cadastrado", password: "" });
      } else {
        setErrors({ name: "", email: "", password: "" });
        toast({
          title: "Erro inesperado",
          description:
            "Não foi possível completar o registro. Tente novamente.",
          variant: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to={"/"} className="bg-sky-600 p-3 rounded-full">
            <Cloud className="h-8 w-8 text-white" />
          </Link>
        </div>

        <Card className="w-full bg-white/90 border-sky-200 shadow-lg">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Avançar"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm">
            Já tem conta?{" "}
            <Link
              to="/login"
              className="text-sky-600 hover:text-sky-800 ml-1 font-medium"
            >
              Entrar
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
