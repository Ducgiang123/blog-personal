/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaBlog, FaRegComment } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { useFetchBlogsQuery } from "../../../redux/features/blogs/blogsApi";
import { useGetUserQuery } from "../../../redux/features/auth/authApi";
import { useGetCommentsQuery } from "../../../redux/features/comments/commentsApi";
import BlogsChart from "./BlogsChart";

const Dashboard = () => {
  const [query, setQuery] = useState({ search: '', category: '' });
  const { data: blogs = [], error, isLoading } = useFetchBlogsQuery(query);
  const { data: users = [] } = useGetUserQuery();
  const { data: comments = [] } = useGetCommentsQuery();
  
  const { user } = useSelector((state) => state.auth);

  // Calculate the number of "admin" and "collaborator" roles
  const adminCount = users.filter(user => user.role === "quản trị viên").length;
  const collaboratorCount = users.filter(user => user.role === "cộng tác viên").length;

  return (
    <>
      {isLoading && <div>Loading...</div>}
      <div className="space-y-6">
        <div className="bg-bgPrimary p-5">
          <h1>Hi, {user.username}!</h1>
          <p>Chào mừng đến với bảng điều khiển dành cho quản trị</p>
          <p>
            Tại đây bạn có thể thực hiện các công việc quản lý như thêm, sửa, xóa bài viết, quản lý người dùng, quản lý bình luận, thống kê bài viết, người dùng, bình luận và nhiều hơn nữa.
          </p>
        </div>
        
        {/* cards grid */}
        <div className="flex flex-col md:flex-row justify-between gap-8 pt-8">
          {/* certain grid to calculate total blogs, users */}
          <div className="bg-indigo-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
            <FiUsers className="size-8 text-indigo-600" />
            <p>{users.length} Người dùng</p>
          </div>
          <div className="bg-red-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
            <FaBlog className="size-8 text-red-600" />
            <p>{blogs.length} Bài viết</p>
          </div>
          <div className="bg-lime-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
            <RiAdminLine className="size-8 text-lime-600" />
            {/* <p>{adminCount} Admin{adminCount !== 1 ? 's' : ''}</p> */}
            <p>{adminCount} Quản trị viên</p>
          </div>
          <div className="bg-blue-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
            <RiAdminLine className="size-8 text-blue-600" />
            <p>{collaboratorCount} Cộng tác viên</p>
          </div>
          <div className="bg-orange-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center">
            <FaRegComment className="size-8 text-orange-600" />
            <p>{comments.totalComments} Bình luận</p>
          </div>
        </div>

        {/* graph charts */}
        <div className="pt-5 pb-5">
          <BlogsChart blogs={blogs}/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
