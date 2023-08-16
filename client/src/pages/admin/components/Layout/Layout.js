import Topbar from "../topbar/Topbar";
import Sidebar from "../sidebar/Sidebar";
import "../../main.scss";

const Layout = ({ children }) => {
  return (
    <div>
      <Topbar
        title={"Admin Dashboard"}
        imgSrc={"https://www.linkpicture.com/q/profilePic.jpg"}
      />
      <div className="container">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
