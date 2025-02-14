import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDeleteUserMutation, useGetUserQuery } from "../../../redux/features/auth/authApi";
import UpdateMyprofile from "./UpdateProfile.jsx";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: users = [], error, isLoading, refetch } = useGetUserQuery();
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();

  // Dropdown filter state cho tên người dùng và vai trò
  const [selectedUsernames, setSelectedUsernames] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showUsernameFilter, setShowUsernameFilter] = useState(false);
  const [showRoleFilter, setShowRoleFilter] = useState(false);

  // Hàm đóng modal, cập nhật dữ liệu và chuyển hướng
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    refetch(); // Lấy dữ liệu cập nhật từ API
    navigate("/profile/myprofile"); // Chuyển hướng về trang hồ sơ người dùng
  };

  // Dropdown component remains unchanged, nhưng options sẽ dựa vào danh sách filtered
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

  // Lọc danh sách người dùng hiển thị: chỉ bao gồm quản trị viên, cộng tác viên hoặc chính người đăng nhập
  const filteredUsersForDisplay = users.filter((u) =>
    u.role === "quản trị viên" ||
    u.role === "cộng tác viên" ||
    u._id === loggedInUser._id
  );

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
                      Tên người dùng
                      <button onClick={() => setShowUsernameFilter(!showUsernameFilter)}>
                        {" "}
                        🔽{" "}
                      </button>
                      {showUsernameFilter && (
                        <div className="absolute left-0 top-full bg-white border shadow-lg z-50 min-w-[200px] w-auto">
                          <DropdownFilter
                            // Options chỉ từ danh sách filteredUsersForDisplay
                            options={[...new Set(filteredUsersForDisplay.map((u) => u.username))]}
                            selected={selectedUsernames}
                            setSelected={setSelectedUsernames}
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
                          options={["quản trị viên", "cộng tác viên", "người đọc"]}
                          selected={selectedRoles}
                          setSelected={setSelectedRoles}
                        />
                      )}
                    </th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left">
                      Chỉnh sửa
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsersForDisplay
                    .filter(
                      (u) =>
                        selectedUsernames.length === 0 ||
                        selectedUsernames.includes(u.username)
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
                          <td className="px-6 py-4">{user.username}</td>
                          <td className="px-6 py-4">{user.role}</td>
                          <td className="px-6 py-4">
                            <button
                              disabled={isDisabled}
                              className={`text-blue-500 hover:underline flex items-center gap-1 ${
                                isDisabled ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={() => {
                                if (!isDisabled) {
                                  setSelectedUser(user);
                                  setIsModalOpen(true);
                                }
                              }}
                            >
                              Chỉnh sửa
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

      {/* Edit Modal */}
      {isModalOpen && selectedUser && (
        <UpdateMyprofile user={selectedUser} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default MyProfile;
