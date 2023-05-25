import React from "react";
import Wrapper from "../../assets/wrappers/SharedLayout.js";
import { Outlet } from "react-router-dom";
import { BigSidebar, SmallSideBar, Navbar } from "../../components/index.js";

const SharedLayout = () => {
  return (
    <>
      <Wrapper>
        <main className="dashboard">
          <SmallSideBar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    </>
  );
};

export default SharedLayout;
