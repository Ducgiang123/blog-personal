import React, { useState } from "react";
import { useUpdateUserRoleMutation } from "../../../redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/features/auth/authSlice";

const UpdateMyprofile = ({ user, onClose, onRoleUpdate }) => {
  const [role, setRole] = useState(user ? user.role : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [username, setUsername] = useState(user ? user.username : '');
  const dispatch = useDispatch();
  
  const [updateUserRole] = useUpdateUserRoleMutation();

  const handleUpdateUser = async () => {
    try {
      const response = await updateUserRole({ userId: user._id, role, email, username }).unwrap();
      alert(response.message);
      // Cập nhật Redux store với thông tin mới
      dispatch(updateUser({ username, email, role }));
      onRoleUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3 relative">
        {/* Nút X */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          X
        </button>
        <h2 className="text-xl mb-4">Chỉnh sửa</h2>
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Tên người dùng:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 bg-bgPrimary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-1.5 px-5 focus:outline-none"
          />
        </div>
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 bg-bgPrimary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-1.5 px-5 focus:outline-none"
          />
        </div>
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Vai trò:
          </label>
          <p className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-1.5 px-5 bg-gray-100">
            {role}
          </p>
        </div>
        <div className="flex justify-end pt-5">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Hủy
          </button>
          <button
            onClick={handleUpdateUser}
            className="bg-indigo-500 text-white px-4 py-2 rounded"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateMyprofile;
