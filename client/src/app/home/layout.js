import Navigations from "@/components/layout/optionavigations";
import InactivityHandler from "@/components/InactivityHandler";
export default function IndexLayout({ children }) {
  return (
    <>
      <Navigations/>
      <main>{children}</main>
      <InactivityHandler/>
    </>
  );
}

  