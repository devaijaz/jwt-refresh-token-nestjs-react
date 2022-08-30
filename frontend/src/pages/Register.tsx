import React, { FormEvent, useCallback, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { axiosClient, API_USER_REGISTER } from "../api/axios";

export const Register = () => {
  const id = useId();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const fullnameRef = useRef<HTMLInputElement>(null);
  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await axiosClient.post(API_USER_REGISTER, {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
        fullname: fullnameRef.current?.value,
      });
      setSubmitting(false);
    } catch (e: any) {
      console.error(e.response?.data?.message);
      setError(e.response?.data?.message || "Error registering your account. Try again later");
      setSubmitting(false);
    }
  }, []);

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

        <div className="formfield">
          <label htmlFor={`fullname-${id}`} className="block">
            Fullname
          </label>
          <input
            ref={fullnameRef}
            className="border w-full rounded-sm p-1"
            id={`fullname-${id}`}
            type="text"
            required
          ></input>
        </div>
        <div className="flex justify-between items-center gap-2">
          <button
            disabled={submitting}
            className="border bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 disabled:bg-slate-400 disabled:hover:bg-slate-400"
          >
            Register
          </button>
          <Link to="/login">I have a Account? Signup</Link>
        </div>
      </form>
    </div>
  );
};
