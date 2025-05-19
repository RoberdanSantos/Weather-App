export interface HeaderProps {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (auth: boolean) => void;
}

export type Address = {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
  address?: Address;
  recentCities?: string[];
}

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<string>;
  fetchUser: () => void;
}
