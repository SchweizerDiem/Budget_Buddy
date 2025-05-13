// Routes
import { logoutAction } from "./actions/logout";
import Main, { mainLoader } from "./layouts/Main";
import Dashboard, { dashboardAction, dashboardLoader } from "./pages/Dashboard";
import Error from "./pages/Error"; // Error page

// Library
import { ToastContainer } from 'react-toastify';

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
        action: dashboardAction,
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
      <ToastContainer />
    </div>
  )
}

export default App
