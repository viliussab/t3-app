import Header from "./Header";
import React from "react";

type LayoutProps = {
    children: React.ReactNode
}

const Layout = (props : LayoutProps) => {
  return (
    <>
      <Header />
      <div className="w-screen overflow-y-auto">
        {props.children}
      </div>
  
    </>
  );
};

export default Layout;
