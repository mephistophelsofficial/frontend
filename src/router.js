import {createBrowserRouter, Navigate,} from "react-router-dom";
import "./index.css";
import {PATH} from "./consts";
import Auth from "./pages/auth/Auth";
import {Wrapper} from "./Wrapper";
import QRPage from "./pages/QR";
import Home from "./pages/Home";

export const router = createBrowserRouter([
    {
        path: PATH.LOGIN,
        element: <Auth />
    },
    {
        path: PATH.REGISTRATION,
        element: <Auth />
    },
    {
        path: '/',
        element: <Navigate to={PATH.LOGIN}/>
    },
    {
        path: PATH.QR,
        element: <QRPage/>,
    },
    {
        path: PATH.HOME,
        element: <Home/>,
    }
]);
