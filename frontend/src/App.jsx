// Routes
import { logoutAction } from "./actions/logout";
import Main, { mainLoader } from "./layouts/Main";
import Dashboard, { dashboardLoader } from "./pages/Dashboard";
import Error from "./pages/Error"; // Error page

//BrowserRouter
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: mainLoader,
    // if an unknown locations is entered it will just diplay the error page
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: dashboardLoader,
        // if an unknown locations is entered it will just diplay the error page
        errorElement: <Error />
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ]
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
