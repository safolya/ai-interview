import {createBrowserRouter} from "react-router";
import Login from "./Features/auth/Pages/Login.jsx";
import Register from "./Features/auth/Pages/Register.jsx";
import Protected from "./Features/auth/Components/Protected.jsx";
import Home from "./Features/interview/Pages/Home.jsx";
import Interview from "./Features/interview/Pages/Interview.jsx";



export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },{
        path: "/",
        element:<Protected><Home/></Protected>
    },
      {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
])