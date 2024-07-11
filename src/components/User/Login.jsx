import React, { useState } from "react";
import ServerApi from "../../serverApi/axios";
import { useNavigate } from "react-router";

import { userContext } from "../../UserContext";

const loginUrl = "api/v1/auth/login";
const registerUrl = "api/v1/auth/register";

const Login = () => {
  const { state, dispatch } = userContext();
  const navigate = useNavigate();

  //contians login and register data
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [errMsg, setErrMsg] = useState(null);

  const handleChange = (e) => {
    setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault(); //stops reloading page
    const { email, password } = loginUser;
    const loginUserJson = { email, password };
    try {
      const { data } = await ServerApi.post(loginUrl, loginUserJson, {
        withCredentials: true,
      });
      dispatch({ type: "LOGIN", payload: data.user });
      navigate("/venues");
      setLoginUser({ email: "", password: "" });
    } catch (error) {
      console.log(error);
      // setErrMsg(error.response.data.msg);x
      // console.log({ text: error.response.data.msg });
    }
  };

  const handleClickRegister = (e) => {
    e.preventDefault();
    if (regsiterActive === false) {
      setRegsiterActive(true);
    } else {
      handleRegister(e);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password } = loginUser;
    const registerUserJson = { name, email, password };
    try {
      const { data } = await ServerApi.post(registerUrl, registerUserJson, {
        withCredentials: true,
      });
      console.log(data);
      dispatch({ type: "LOGIN", payload: data.user });
      navigate("/venues");
      setLoginUser({ name: "", email: "", password: "" });
    } catch (error) {
      console.log(error);
      // setErrMsg(error.response.data.msg);x
      // console.log({ text: error.response.data.msg });
    }
  };

  const [regsiterActive, setRegsiterActive] = useState(false);
  return (
    <div class="min-h-screen w-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 class="font-bold text-center text-2xl mb-5">RotaPal</h1>
        <div class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <div class="px-5 py-7">
            <label class="font-semibold text-sm text-gray-600 pb-1 block">
              E-mail
            </label>
            <input
              name="email"
              value={loginUser.email}
              type="text"
              class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              onChange={handleChange}
            />
            <label class="font-semibold text-sm text-gray-600 pb-1 block">
              Password
            </label>
            <input
              name="password"
              value={loginUser.password}
              type="text"
              class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              onChange={handleChange}
            />
            {regsiterActive && (
              <>
                <label class="font-semibold text-sm text-gray-600 pb-1 block">
                  Name
                </label>
                <input
                  name="name"
                  onChange={handleChange}
                  type="text"
                  class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />
              </>
            )}

            <button
              type="button"
              class="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              onClick={loginSubmit}
            >
              <span class="inline-block mr-2">Login</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-4 h-4 inline-block"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
            <p className="  font-thin text-sm  text-blue-600 my-3 text-center">
              Dont have an account?
            </p>
            <button
              type="button"
              class="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block my-1"
              onClick={handleClickRegister}
            >
              <span class="inline-block mr-2">Register</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-4 h-4 inline-block"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
          <div class="py-5">
            <div class="grid grid-cols-2 gap-1">
              <div class="text-center sm:text-left whitespace-nowrap">
                <button class="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-4 h-4 inline-block align-text-top"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="inline-block ml-1">Forgot Password</span>
                </button>
              </div>
              <div class="text-center sm:text-right  whitespace-nowrap">
                <button class="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-4 h-4 inline-block align-text-bottom	"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span class="inline-block ml-1">Help</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="py-5">
          <div class="grid grid-cols-2 gap-1">
            <div class="text-center sm:text-left whitespace-nowrap">
              <button class="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-4 h-4 inline-block align-text-top"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span class="inline-block ml-1">Back to your-app.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
