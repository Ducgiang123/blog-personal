import React, { useState } from "react";
import { useUpdateUserRoleMutation } from "../../../redux/features/auth/authApi";

const UpdateUserModal = ({ user, onClose, onRoleUpdate }) => {
  const [role, setRole] = useState(user ? user.role : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [username, setUsername] = useState(user ? user.username : '');
  
  const [updateUserRole] = useUpdateUserRoleMutation();

  const handleUpdateUser = async () => {
    try {
      const response = await updateUserRole({ userId: user._id, role, email, username }).unwrap();
      alert(response.message); // Hiển thị thông báo từ phản hồi
      onRoleUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-1.5 px-5 focus:outline-none"
          >
            <option value="người đọc">Người đọc</option>
            {/* <option value="quản trị viên">Quản trị viên</option> */}
            <option value="cộng tác viên">Cộng tác viên</option>
          </select>
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

export default UpdateUserModal;
