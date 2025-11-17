import React from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import GaragePage from "../pages/GaragePage";
import WinnersPage from "../pages/WinnersPage";
export * from "./car";


const router = createBrowserRouter([
  { path: "/", element: <GaragePage /> },
  { path: "/winners", element: <WinnersPage /> },
]);

function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/">Garage</Link>
        <Link to="/winners">Winners</Link>
      </nav>

      <RouterProvider router={router} />
    </div>
  );
}

export default App;
