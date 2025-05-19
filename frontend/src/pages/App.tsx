import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth.context";
import { PrivateRoute } from "@/components/auth/privateRoute";
import { PublicRoute } from "@/components/auth/publicRoute";
import { RootRedirect } from "@/components/auth/RootRedirect";
import { MissingAddressRoute } from "@/components/auth/MissingAddressRoute";
import { Header } from "@/components/ui/header";

import LoginPage from "./login";
import Register from "./register";
import Address from "./register/address";
import Historic from "./historic";
import Favorites from "./favorites";
import Profile from "./profile";
import EditProfile from "./profile/edit";
import NotFound from "./not-found";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route element={<MissingAddressRoute />}>
            <Route path="/signup/address" element={<Address />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/historic" element={<Historic />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Register />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
