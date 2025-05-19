export interface Toast extends ToastOptions {
  id: string;
}

export type LogItem = {
  id: string;
  location: string;
  temperature: number;
  condition: string;
  createdAt: string;
};

export type ToastType = "default" | "success" | "error" | "destructive";

export type ToastOptions = {
  title: string;
  description?: string;
  duration?: number;
  variant?: ToastType;
};

export type ToastContextType = {
  toast: (options: ToastOptions) => void;
};

export type FavoriteLocation = {
  id: string;
  name: string;
  country: string;
  createdAt: string;
};
