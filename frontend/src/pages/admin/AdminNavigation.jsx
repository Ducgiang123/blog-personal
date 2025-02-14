import React from "react";
import { NavLink } from "react-router-dom";
import AdminImg from "../../assets/admin.png";
import { Link } from "react-router-dom";
import { useLogoutUserMutation } from "../../redux/features/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";

const AdminNavigation = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const handleLogout = async (s) => {
    try {
      await logoutUser().unwrap();
      dispatch(logout())

    } catch (err) {
      console.error("Failed to logout:", err);
    }
  }
  return (
    <div className="space-y-5 bg-white p-8 md:h-[calc(100vh-98px)] flex flex-col justify-between">
      <div>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            {/* <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    Bài viết
                  </h3>
                </div> */}
            <a href="/">
              <img src="/logo.webp" alt="logo" className="h-12" height={100} />
            </a>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <Link to="/">
                <button
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  TRANG CHỦ
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="mb-5">
          <img src={AdminImg} alt="Admin" className="size-14" />
          <p className="font-semibold">{user.username}</p>
        </div>
        <hr />
        <ul className="space-y-5 pt-5">
          <li>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              BẢNG ĐIỀU KHIỂN
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/add-new-post"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              TẠO BÀI VIẾT
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-items"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              QUẢN LÝ BÀI VIẾT
            </NavLink>
          </li>

          <li className="mb-3">
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              QUẢN LÝ NGƯỜI DÙNG
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mb-3">
        <hr className="mb-3" />
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 font-medium px-5 py-1 rounded-sm">
          ĐĂNG XUẤT
        </button>
      </div>
    </div>
  );
};

export default AdminNavigation;
