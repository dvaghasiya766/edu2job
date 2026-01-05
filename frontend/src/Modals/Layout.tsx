import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../Components/NavBar";

const Layout = () => {
  return (
    <>
      <NavBar />
      {/* IMPORTANT → renders child routes */}
      <Outlet />
    </>
  );
};

export default Layout;
