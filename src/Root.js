import "./App.css";
import NavigationDrawer from "./components/Navigation/NavigationDrawer/NavigationDrawer";
import { Outlet } from "react-router-dom";

function Root() {

  return (
    <div style={{ backgroundColor: "#272c2b" }}>
        <NavigationDrawer />
        <Outlet />
    </div>
  )
}

export default Root;