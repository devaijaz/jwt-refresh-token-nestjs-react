import { NavLink, useLocation } from "react-router-dom";
import { RoutesDefinition } from "../routes";
import { useAuth } from "../store";

export const Header = () => {
  const location = useLocation();
  const { auth, logout } = useAuth();
  return (
    <nav className="bg-white shadow-lg flex items-center">
      <ul className="flex gap-2 p-2">
        {RoutesDefinition.filter((route) => !route.exclude).map((route) => {
          return (
            <li
              key={route.id}
              className={`p-2 transition-all ${location.pathname === route.path ? "bg-purple-800 text-white" : ""}`}
            >
              <NavLink to={route.path}>{route.label}</NavLink>
            </li>
          );
        })}
      </ul>
      <div className="ml-auto p-2">
        {auth && auth.access_token ? (
          <div className="flex items-center gap-2">
            <span>Welcome! {auth.fullname} </span> <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className="flex gap-3">
            <NavLink to={"/login"}>Login</NavLink>
            <NavLink to={"/register"}>Signup</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};
