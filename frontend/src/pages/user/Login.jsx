/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useLoginUserMutation } from '../../redux/features/auth/authApi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/features/auth/authSlice';
import { MdArrowBack } from 'react-icons/md';

const Login = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      const response = await loginUser(data).unwrap();
      const { token, user } = response;
      dispatch(setUser({ user }));

      // Hiển thị thông báo dựa trên vai trò của người dùng
      if (user.role === 'quản trị viên') {
        alert('Bạn đã đăng nhập với tư cách là quản trị viên');
        navigate('/dashboard');
      } else if (user.role === 'cộng tác viên') {
        alert(`Xin chào cộng tác viên ${user.username}`);
        navigate('/dashboard');
      } else {
        alert('Đăng nhập thành công');
        navigate('/');
      }
    } catch (err) {
      if (err.status === 404) {
        setMessage("Email không hợp lệ");
      } else if (err.status === 401) {
        setMessage("Mật khẩu không hợp lệ");
      } else {
        setMessage("Đã xảy ra lỗi, vui lòng thử lại");
      }
    }
  };

  return (
    <div className="max-w-sm bg-white mx-auto p-8 mt-36">
      {!showLoginForm ? (
        // Ban đầu hiển thị 2 nút: "Tiếp tục đăng nhập" và "Đến trang chủ"
        <div className="flex flex-col items-center space-y-4">
          <h1>Bạn muốn tiếp tục đăng nhập hoặc đến trang chủ?</h1>
          <button
            onClick={() => setShowLoginForm(true)}
            className="w-full bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md"
          >
            Tiếp tục đăng nhập
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-500 hover:bg-gray-700 text-white font-medium py-3 rounded-md"
          >
            Đến trang chủ
          </button>
        </div>
      ) : (
        // Hiển thị form đăng nhập khi "Tiếp tục đăng nhập" được nhấn
        <>
          <h2 className="text-2xl font-semibold pt-5 text-center">ĐĂNG NHẬP</h2>
          <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto pt-8">
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
            {message && <p className="text-red-500">{message}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md"
            >
              ĐĂNG NHẬP
            </button>
          </form>

          {/* Nút Quên mật khẩu */}
          <p className="text-center mt-4">
            <a
              href="https://forms.gle/z8oqhTnp1uQfdqDS8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Quên mật khẩu?
            </a>
          </p>

          <p className="my-5 text-center">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-red-700 italic">
              ĐĂNG KÝ
            </Link>{" "}
            ngay.
          </p>
          {/* Nút Trang chủ */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-500 hover:underline"
            >
              {/* Biểu tượng mũi tên đằng trước */}
              <MdArrowBack className="mr-1 text-xl" />
              Trang chủ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
