// Layout.jsx
import { Outlet } from "react-router-dom";
// import Header from "./common/Header";
// import Footer from "./common/Footer";

function Layout() {
  return (
    <div className="app-wrap">
      <div className="app">
        {/* <Header /> */}
        {/* <main className="main"> */}
        <Outlet />
        {/* </main> */}
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default Layout;
