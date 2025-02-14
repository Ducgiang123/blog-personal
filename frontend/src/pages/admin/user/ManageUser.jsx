import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteUserMutation,
  useGetUserQuery,
} from "../../../redux/features/auth/authApi";
import UpdateUserModal from "./UpdateUserModal.jsx";
import ViewUserModal from "./ViewUserModal.jsx";
import { Pencil } from "lucide-react";

const ManageUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: users = [], error, isLoading, refetch } = useGetUserQuery();
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const [deleteUser] = useDeleteUserMutation();

  // Dropdown filter state
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showEmailFilter, setShowEmailFilter] = useState(false);
  const [showRoleFilter, setShowRoleFilter] = useState(false);

  // Delete confirmation state (nếu có sử dụng)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const handleDelete = (id) => {
    setUserIdToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(userIdToDelete).unwrap();
      alert("Đã xóa người dùng thành công");
      refetch();
    } catch (error) {
      console.error("Failed to delete user", error);
    } finally {
      setIsDialogOpen(false);
      setUserIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
    setUserIdToDelete(null);
  };

  const handleEdit = (user) => {
    // Nếu người đăng nhập là quản trị viên hoặc cộng tác viên,
    // luôn gọi đến modal xem thông tin (ViewUserModal)
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  // Tạo biến lọc danh sách người dùng hiển thị:
  // Nếu loggedInUser là "cộng tác viên": chỉ lấy những user có role là "cộng tác viên" hoặc "người đọc"
  // Nếu là "quản trị viên": hiển thị toàn bộ
  const filteredUsersForDisplay = users.filter((u) => {
    if (loggedInUser.role === "cộng tác viên") {
      return u.role === "cộng tác viên" || u.role === "người đọc";
    }
    return true;
  });

  // Dropdown component (không thay đổi)
  const DropdownFilter = ({ options, selected, setSelected }) => {
    const toggleSelection = (value) => {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    };

    return (
      <div className="absolute bg-white shadow-md p-3 rounded-md z-10 max-h-60 overflow-y-auto border">
        <label className="block">
          <input
            type="checkbox"
            checked={selected.length === options.length}
            onChange={() =>
              setSelected(selected.length === options.length ? [] : options)
            }
          />
          (Chọn Tất cả)
        </label>
        {options.map((item) => (
          <label key={item} className="block">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggleSelection(item)}
            />
            {item}
          </label>
        ))}
      </div>
    );
  };

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Failed to load users.</div>}

      <section className="py-1 bg-blueGray-50">
        <div className="w-full mb-12 xl:mb-0 px-4 mx-auto">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    Người dùng
                  </h3>
                </div>
              </div>
            </div>

            <div className="block w-full overflow-x-auto">
              <table className="items-center bg-transparent w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left">
                      STT
                    </th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left relative">
                      Email
                      <button onClick={() => setShowEmailFilter(!showEmailFilter)}>
                        {" "}
                        🔽{" "}
                      </button>
                      {showEmailFilter && (
                        <div className="absolute left-0 top-full bg-white border shadow-lg z-50 min-w-[200px] w-auto">
                          <DropdownFilter
                            // Lấy email từ filteredUsersForDisplay
                            options={[...new Set(filteredUsersForDisplay.map((u) => u.email))]}
                            selected={selectedEmails}
                            setSelected={setSelectedEmails}
                          />
                        </div>
                      )}
                    </th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left relative">
                      Vai trò
                      <button onClick={() => setShowRoleFilter(!showRoleFilter)}>
                        {" "}
                        🔽{" "}
                      </button>
                      {showRoleFilter && (
                        <DropdownFilter
                          options={
                            loggedInUser.role === "cộng tác viên"
                              ? ["cộng tác viên", "người đọc"]
                              : ["quản trị viên", "cộng tác viên", "người đọc"]
                          }
                          selected={selectedRoles}
                          setSelected={setSelectedRoles}
                        />
                      )}
                    </th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left">
                      Chỉnh sửa
                    </th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left">
                      Xóa
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsersForDisplay
                    .filter(
                      (u) =>
                        selectedEmails.length === 0 ||
                        selectedEmails.includes(u.email)
                    )
                    .filter(
                      (u) =>
                        selectedRoles.length === 0 ||
                        selectedRoles.includes(u.role)
                    )
                    .sort((a, b) => {
                      const roleOrder = {
                        "quản trị viên": 1,
                        "cộng tác viên": 2,
                        "người đọc": 3,
                      };
                      return roleOrder[a.role] - roleOrder[b.role];
                    })
                    .map((user, index) => {
                      // Nếu người dùng có vai trò "quản trị viên" hoặc "cộng tác viên", disable nút chỉnh sửa
                      const isDisabled =
                        user.role === "quản trị viên" || user.role === "cộng tác viên";
                      return (
                        <tr key={user._id}>
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">{user.role}</td>
                          <td className="px-6 py-4">
                            <button
                              className="text-blue-500 hover:underline flex items-center gap-1"
                              onClick={() => {
                                if (loggedInUser.role === "quản trị viên") {
                                  setSelectedUser(user);
                                  setIsModalOpen(true);
                                } else if (loggedInUser.role === "cộng tác viên") {
                                  if (user.role === "người đọc") {
                                    setSelectedUser(user);
                                    setIsModalOpen(true);
                                  } else {
                                    setSelectedUser(user);
                                    setIsViewModalOpen(true);
                                  }
                                }
                              }}
                            >
                              {loggedInUser.role === "quản trị viên"
                                ? "✏️ Chỉnh sửa"
                                : loggedInUser.role === "cộng tác viên" && user.role === "người đọc"
                                ? "✏️ Chỉnh sửa"
                                : "🔍 Xem thông tin"}
                            </button>
                          </td>

                          <td className="px-6 py-4">
                            <button
                              className={`bg-red-600 text-white px-2 py-1 rounded 
                                ${loggedInUser.role === "cộng tác viên" &&
                                (user.role === "quản trị viên" ||
                                  user.role === "cộng tác viên")
                                  ? "opacity-50 cursor-not-allowed"
                                  : user.role === "quản trị viên" ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={() => handleDelete(user._id)}
                              disabled={
                                loggedInUser.role === "cộng tác viên" &&
                                (user.role === "quản trị viên" ||
                                  user.role === "cộng tác viên") ||
                                user.role === "quản trị viên"
                              }
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg relative w-96">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-lg"
              onClick={cancelDelete}
            >
              ✖
            </button>
            <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-600 text-white px-4 py-2 mr-2"
                onClick={confirmDelete}
              >
                Xóa
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2"
                onClick={cancelDelete}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update User Modal */}
      {isModalOpen && (
        <UpdateUserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onRoleUpdate={refetch}
        />
      )}

      {/* View User Modal */}
      {isViewModalOpen && selectedUser && (
        <ViewUserModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default ManageUser;
