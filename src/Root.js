import "./App.css";
import NavigationDrawer from "./components/Navigation/NavigationDrawer/NavigationDrawer";
import { Outlet } from "react-router-dom";

function Root() {

  return (
    <div style={{ backgroundColor: "#272c2b", height: "100vh" }}>
        <NavigationDrawer />
        <Outlet />
    </div>
  )
}

export default Root;