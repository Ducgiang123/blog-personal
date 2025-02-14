import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoClose, IoMenuSharp } from "react-icons/io5";
import AvaterImg from "../assets/commentor.png";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/auth/authSlice";
import { useLocation } from "react-router-dom";
import ViewUserModal from "../pages/admin/user/ViewUserModal.jsx";

const navLists = [
  { name: "Trang chủ", path: "/" },
  { name: "Về chúng tôi", path: "/about-us" },
  { name: "Chính sách bảo mật", path: "/privacy-policy" },
  { name: "Liên hệ", path: "/contact-us" },
];

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
    } catch (err) {
      console.error("Không thể đăng xuất:", err);
    }
  };

  const location = useLocation();
  if (
    location.pathname === "/dashboard" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/dashboard/add-new-post" ||
    location.pathname === "/dashboard/manage-items" ||
    location.pathname === "/dashboard/users" ||
    location.pathname === "/profile" ||
    location.pathname === "/profile/myprofile"
  ) {
    return null;
  }

  return (
    <>
      {/* Navbar */}
      <header className="bg-white py-4 border-b fixed top-0 left-0 w-full z-50">
        <nav className="container mx-auto flex justify-between items-center px-5">
          {/* Logo */}
          <a href="/">
            <img src="/logo.webp" alt="logo" className="h-12" height={100} />
          </a>

          {/* Desktop Menu */}
          <ul className="sm:flex hidden items-center gap-8">
            {navLists.map((list, index) => (
              <li key={index}>
                <NavLink
                  to={list.path}
                  className={({ isActive }) =>
                    isActive ? "text-blue-600 font-semibold" : "text-gray-700"
                  }
                >
                  {list.name}
                </NavLink>
              </li>
            ))}
            {user ? (
              <li className="flex gap-3 items-center">
                {user.role === "người đọc" || user.role === "quản trị viên"? (
                  <Link to="/profile">
                    <img
                      src={AvaterImg}
                      alt="avatar"
                      className="h-8 w-8 rounded-full cursor-pointer"
                    />
                  </Link>
                ) : (
                  <img
                    src={AvaterImg}
                    alt="avatar"
                    className="h-8 w-8 rounded-full cursor-not-allowed opacity-50"
                  />
                )}
                {user.role === "quản trị viên" || user.role === "cộng tác viên" ? (
                  <Link to="/dashboard">
                    <button className="bg-blue-600 px-4 py-1.5 text-white rounded">
                      Bảng điều khiển
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="bg-blue-600 px-4 py-1.5 text-white rounded"
                  >
                    Đăng xuất
                  </button>
                )}
              </li>
            ) : (
              <li>
                <NavLink to="/login" className="text-blue-600 font-semibold">
                  Đăng nhập
                </NavLink>
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="flex items-center px-3 py-2 bg-gray-200 rounded text-sm text-gray-500 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <IoClose className="text-2xl" />
              ) : (
                <IoMenuSharp className="text-2xl" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <ul className="fixed top-16 left-0 w-full h-auto bg-white shadow-md z-50">
            {navLists.map((list, index) => (
              <li key={index} className="border-b px-4 py-3">
                <NavLink
                  to={list.path}
                  className={({ isActive }) =>
                    isActive ? "text-blue-600 font-semibold" : "text-gray-700"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {list.name}
                </NavLink>
              </li>
            ))}
            {user ? (
              <li className="px-4 py-3">
                {user.role === "admin" ? (
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    Bảng điều khiển
                  </Link>
                ) : (
                  <button onClick={handleLogout}>Đăng xuất</button>
                )}
              </li>
            ) : (
              <li className="px-4 py-3">
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-blue-600"
                >
                  Đăng nhập
                </NavLink>
              </li>
            )}
          </ul>
        )}
      </header>

      <div className="pt-20">
        <main className="container mx-auto px-5">
          <h1 className="text-3xl font-bold"></h1>
          <p className="mt-4"></p>
        </main>
      </div>
    </>
  );
};

export default Navbar;
