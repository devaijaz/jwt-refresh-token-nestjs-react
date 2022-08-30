import React from "react";
import { Route, Routes } from "react-router-dom";
import { Protected } from "../components/Protected";
import { Admin } from "../pages/Admin";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Notfound } from "../pages/Notfound";
import { Register } from "../pages/Register";
import { Todo } from "../pages/Todo";
import { Id } from "../util";

export const RoutesDefinition = [
  {
    id: Id(),
    label: "Home",
    component: <Home />,
    path: "/",
  },
  {
    id: Id(),
    label: "Todo",
    component: <Todo />,
    path: "/todo",
  },
  {
    id: Id(),
    label: "Admin",
    component: <Admin />,
    path: "/admin",
    protected: true,
  },
  {
    id: Id(),
    label: "Login",
    component: <Login />,
    path: "/login",
    exclude: true,
  },
  {
    id: Id(),
    label: "Login",
    component: <Register />,
    path: "/register",
    exclude: true,
  },
];

export const AppRoutes = () => {
  return (
    <Routes>
      {RoutesDefinition.map((route) => {
        if (route.protected) {
          return (
            <Route element={<Protected />} key={route.id}>
              <Route path={route.path} element={route.component}></Route>;
            </Route>
          );
        }
        return <Route path={route.path} element={route.component} key={route.id}></Route>;
      })}
      <Route path="*" element={<Notfound />}></Route>
    </Routes>
  );
};
