"use client"
import Navigations from "@/components/layout/optionavigations";
import InactivityHandler from "@/components/InactivityHandler";
import { useEffect } from "react";
import { getSession } from "@/api/authenticated/sessionService";
export default function IndexLayout({ children }) {
  useEffect(() => {
    getSession();
  }, []);
  return (
    <>
      <Navigations/>
      <main>{children}</main>
      <InactivityHandler/>
    </>
  );
}

  