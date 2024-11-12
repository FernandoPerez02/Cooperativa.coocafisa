import Navigations from "@/components/layout/optionavigations";
import { AuthProvider } from "../api/auth/authContext";
export default function IndexLayout({ children }) {
  return (
    <AuthProvider>
      <Navigations/>
      <main>{children}</main>
    </AuthProvider>
  );
}

  