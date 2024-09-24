import React, { useState } from "react";
import { login } from "../app/features/Auth/authSlice";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import loginimage from "../Images/login.jpg";

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
      const response = await dispatch(login(credentials)).unwrap();
      if (response) {
        navigate("/user", { replace: true });
      }
      // window.location.href = "/user";
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="font-[sans-serif]">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 items-center gap-4 h-full">
        <div className="max-md:order-1 lg:col-span-2 md:h-screen w-full md:rounded-tr-xl md:rounded-br-xl lg:p-12 p-8">
          <img
            src={loginimage}
            className="lg:w-[100%] w-full h-full object-cover block mx-auto"
            alt="login-image"
          />
        </div>

        <div className="w-full p-6">
          <form onSubmit={handelSubmit}>
            <div>
              <label className="font-bold mb-2">Email</label>
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
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute right-4 text-gray-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className=" font-bold mb-2">Password</label>
              <div className="relative flex items-center">
                <input
                  value={credentials.password}
                  onChange={handelCredentialsChange}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full text-sm text-gray-800 bg-gray-100 focus:bg-transparent px-4 py-3.5 rounded-md outline-blue-600"
                  placeholder="Enter password"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 cursor-pointer text-gray-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-4"></div>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-6 text-md tracking-wide rounded-md text-white bg-primary hover:bg-hover_primary hover:text-black focus:outline-none"
              >
                LogIn
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
