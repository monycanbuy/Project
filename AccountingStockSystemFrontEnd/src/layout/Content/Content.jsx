import "./Content.css";
import ContentTop from "../../components/ContentTop/ContentTop";
import { Outlet } from "react-router-dom";
// import AdminUsers from "../../components/AuthenticationSection/AdminUsers";
// import Laundrys from "../../components/LaundrysSection/Laundrys";
//import ContentMain from "../../components/ContentMain/ContentMain";

const Content = () => {
  return (
    <div className="main-content">
      <ContentTop />
      <Outlet />
      {/* <ContentMain /> */}
    </div>
  );
};

export default Content;
