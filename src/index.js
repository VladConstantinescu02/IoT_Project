import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './Root';
import MonitorListView from './components/MonitorListView/MonitorListView';
import MonitorView from "./components/MonitorView/MonitorView";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "monitor/:id",
        element: <MonitorView />,
      },
      {
        path: "monitors",
        element: <MonitorListView />
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);


