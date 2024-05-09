import "./App.css";
import NavigationDrawer from "./components/Navigation/NavigationDrawer/NavigationDrawer";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import MonitorView from './components/MonitorView/MonitorView';

function App() {
   const router = createBrowserRouter([
       {
           path: "/monitor",
           element: <MonitorView />
       }
   ]);

  return (
      <>
          <div style={{ backgroundColor: "#272c2b", height: "100vh" }}>
              <NavigationDrawer />
              <RouterProvider router={router} />
          </div>
    </>
  )
}

export default App