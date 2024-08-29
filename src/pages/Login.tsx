import React, { useState } from "react";
import { login } from "../app/features/Auth/authSlice";
import {  useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { Email, Eye } from "@/components/ui-icons";

function Login() {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  function handelCredentialsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  }

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(login(credentials)).unwrap();
      navigate("/user", { replace: true });
      window.location.href = "/user";
    } catch (error: any) {
      console.error(error);
    }
  };
  return (
    <div className="font-[sans-serif]">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 items-center gap-4 h-full">
        <div className="max-md:order-1 lg:col-span-2 md:h-screen w-full md:rounded-tr-xl md:rounded-br-xl lg:p-12 p-8">
          <img
            src="https://plus.unsplash.com/premium_photo-1683121324502-94bd9fa0202e?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="lg:w-[100%] w-full h-full object-cover block mx-auto"
            alt="login-image"
          />
        </div>

        <div className="w-full p-6">
          <form onSubmit={handelSubmit}>
            <div>
              <label className="text-gray-800 text-[15px] mb-2 block">
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  value={credentials.username}
                  onChange={handelCredentialsChange}
                  name="username"
                  type="text"
                  required
                  className="w-full text-sm text-gray-800 bg-gray-100 focus:bg-transparent px-4 py-3.5 rounded-md outline-blue-600"
                  placeholder="Enter Username"
                />
                <Email />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-gray-800 text-[15px] mb-2 block">
                Password
              </label>
              <div onClick={()=> {
                setShowPassword(!showPassword)
              }} className="relative flex items-center">
                <input
                  value={credentials.password}
                  onChange={handelCredentialsChange}
                  name="password"
                  type={showPassword ? "password" : "text"}
                  required
                  className="w-full text-sm text-gray-800 bg-gray-100 focus:bg-transparent px-4 py-3.5 rounded-md outline-blue-600"
                  placeholder="Enter password"
                />
              {showPassword ? <Eye /> : <Eye /> }  
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">

            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-6 text-sm tracking-wide rounded-md text-white bg-[#5c3a16] focus:outline-none"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
