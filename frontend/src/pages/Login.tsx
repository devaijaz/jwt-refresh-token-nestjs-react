import React, { FormEvent, useCallback, useId, useRef, useState } from "react";
import { Link, Location, Navigate, useLocation } from "react-router-dom";
import { axiosClient, API_USER_LOGIN } from "../api/axios";
import { useAuth } from "../store";

export const Login = () => {
  const auth = useAuth((state) => state.auth);
  const setAuth = useAuth((state) => state.setAuth);
  const location: Location = useLocation();
  const id = useId();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setError("");
      setSubmitting(true);
      try {
        const response = await axiosClient.post(
          API_USER_LOGIN,
          {
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
          },
          {}
        );
        setAuth(response.data);
        setSubmitting(false);
      } catch (e: any) {
        console.error(e.response?.data?.message);
        setError(e.response?.data?.message || "Error registering your account. Try again later");
        setSubmitting(false);
      }
    },
    [setAuth]
  );
  if (auth && auth.access_token) {
    const state: Record<string, string> = location.state as Record<string, string>;
    const path = state?.ru || "/";
    return <Navigate to={path} replace></Navigate>;
  }

  return (
    <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-3 rounded min-w-[400px] flex flex-col gap-4">
        <div className="text-red-600">{error}</div>

        <div className="formfield">
          <label htmlFor={`email-${id}`} className="block">
            Email
          </label>
          <input
            ref={emailRef}
            className="border w-full rounded-sm p-1"
            id={`email-${id}`}
            required
            type="email"
          ></input>
        </div>
        <div className="formfield">
          <label htmlFor={`password-${id}`} className="block">
            Password
          </label>
          <input
            ref={passwordRef}
            className="border w-full rounded-sm p-1"
            id={`password-${id}`}
            type="password"
            required
          ></input>
        </div>
        <div className="flex justify-between items-center gap-2">
          <button
            disabled={submitting}
            className="border bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600"
          >
            Login
          </button>
          <Link to="/register">Don't have Account? Signup</Link>
        </div>
      </form>
    </div>
  );
};
