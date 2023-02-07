import Header from "./Header";
import React from "react";
import styles from "Layout.module.css";

type LayoutProps = {
    children: React.ReactNode
}

const Layout = (props : LayoutProps) => {
  return (
    <>
      <Header />
      <div className="mb-12"/>
      <div className="w-screen">
        {props.children}
      </div>

    </>
  );
};

export default Layout;
