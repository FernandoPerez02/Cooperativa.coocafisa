"use client"
import Navigations from "@/components/layout/optionavigations";
import InactivityHandler from "@/components/InactivityHandler";
import { AuthProvider } from "@/api/auth/authContext";
export default function IndexLayout({ children }) {
  return (
    <>
      <Navigations/>
      <AuthProvider>
      <main>{children}</main>
      </AuthProvider>
      <InactivityHandler/>
    </>
  );
}

  