/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { useRegisterUserMutation } from "../../redux/features/auth/authApi";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = {
      username,
      email,
      password,
    };

    try {
      await registerUser(data).unwrap();
      alert("ĐĂNG KÝ THÀNH CÔNG");
      navigate('/login');
    } catch (err) {
      // Improved error handling
      if (err.status === 400) {
        setMessage(err.data.message); // Display specific error message from the server
      } else {
        setMessage("Đã xảy ra lỗi, vui lòng thử lại");
      }
    }
  };

  return (
    <div className="max-w-sm bg-white mx-auto p-8 mt-36">
      <h2 className="text-2xl font-semibold pt-5">ĐĂNG KÝ</h2>
      <form
        onSubmit={handleRegister}
        className="space-y-5 max-w-sm mx-auto pt-8"
      >
        <input
          type="text"
          value={username}
          className="w-full bg-bgPrimary focus:outline-none px-5 py-3"
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          required
        />

        <input
          type="text"
          value={email}
          className="w-full bg-bgPrimary focus:outline-none px-5 py-3"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          className="w-full bg-bgPrimary focus:outline-none px-5 py-3"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {
          message && <p className="text-red-500">{message}</p> // Display error message if any
        }
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md"
        >
          ĐĂNG KÝ
        </button>
      </form>

      <p className="my-5 text-center">
        Đã có tài khoản?
        <Link to="/login" className="text-red-700 italic">
          {" "}
          ĐĂNG NHẬP
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
