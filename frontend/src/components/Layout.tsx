import React from "react";
import { Header } from "./Header";
import { useSession } from "../hooks/useSession";
export type LayoutProps = {
  children?: React.ReactNode;
};

export const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  const _ = useSession();
  return (
    <div className="flex flex-col w-full min-h-screen">
      <header>
        <Header />
      </header>
      <main className="flex-auto relative">{children}</main>
    </div>
  );
};
