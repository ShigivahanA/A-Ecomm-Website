import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { useToast } from "../components/ToastProvider";

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name,setName] = useState('')
  const [password,setPasword] = useState('')
  const [email,setEmail] = useState('')
  const { addToast } = useToast();

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        if (currentState === 'Sign Up') {
          
          const response = await axios.post(backendUrl + '/api/user/register',{name,email,password})
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token',response.data.token)
          } else {
            toast.error(response.data.message)
          }

        } else {

          const response = await axios.post(backendUrl + '/api/user/login', {email,password})
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token',response.data.token)
          } else {
            addToast({ message: response.data.message, type: "error" });
          }

        }


      } catch (error) {
        console.log(error)
        addToast({ message: error.message, type: "error" });
      }
  }

  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token])

  return (
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-[#111111]"
          >
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
              <p className="prata-regular text-3xl">{currentState}</p>
              <hr className="border-none h-[1.5px] w-8 bg-[#0F4C5C]" />
            </div>

            {currentState === "Login" ? (
              ""
            ) : (
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="w-full px-3 py-2 border border-[#BCC7B1] bg-[#EFE9DD] placeholder-gray-500 rounded"
                placeholder="Name"
                required
              />
            )}

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full px-3 py-2 border border-[#BCC7B1] bg-[#EFE9DD] placeholder-gray-500 rounded"
              placeholder="Email"
              required
            />

            <input
              onChange={(e) => setPasword(e.target.value)}
              value={password}
              type="password"
              className="w-full px-3 py-2 border border-[#BCC7B1] bg-[#EFE9DD] placeholder-gray-500 rounded"
              placeholder="Password"
              required
            />

            <div className="w-full flex justify-between text-sm mt-[-8px] text-[#0F4C5C]">
              <p onClick={()=> navigate("/forgot-password")} className="cursor-pointer hover:text-[#1C658C]">Forgot your password?</p>

              {currentState === "Login" ? (
                <p
                  onClick={() => setCurrentState("Sign Up")}
                  className="cursor-pointer hover:text-[#1C658C]"
                >
                  Create account
                </p>
              ) : (
                <p
                  onClick={() => setCurrentState("Login")}
                  className="cursor-pointer hover:text-[#1C658C]"
                >
                  Login Here
                </p>
              )}
            </div>

            <button
              className="bg-[#0F4C5C] hover:bg-[#1C658C] transition text-white font-light px-8 py-2 mt-4 rounded-md"
            >
              {currentState === "Login" ? "Sign In" : "Sign Up"}
            </button>
          </form>
        );
}

export default Login
