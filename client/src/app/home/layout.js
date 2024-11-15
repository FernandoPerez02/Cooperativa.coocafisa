import Navigations from "@/components/layout/optionavigations";
export default function IndexLayout({ children }) {
  return (
    <>
      <Navigations/>
      <main>{children}</main>
    </>
  );
}

  