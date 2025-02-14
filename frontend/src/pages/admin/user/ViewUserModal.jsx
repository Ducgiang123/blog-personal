import React from "react";

const ViewUserModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h2 className="text-xl mb-4">Thông tin người dùng</h2>

        {/* Tên người dùng */}
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Tên người dùng:
          </label>
          <input
            type="text"
            value={user.username}
            disabled
            className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-1.5 px-5 focus:outline-none cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="text"
            value={user.email}
            disabled
            className="mt-1 bg-gray-200 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-1.5 px-5 focus:outline-none cursor-not-allowed"
          />
        </div>

        {/* Vai trò */}
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Vai trò:
          </label>
          <input
            type="text"
            value={user.role}
            disabled
            className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-1.5 px-5 bg-gray-200 focus:outline-none cursor-not-allowed"
          />
        </div>

        {/* Nút đóng */}
        <div className="flex justify-end pt-5">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
