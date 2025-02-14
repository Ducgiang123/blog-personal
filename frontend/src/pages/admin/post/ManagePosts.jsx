import React, { useState } from "react";
import { useDeleteBlogMutation, useFetchBlogsQuery } from "../../../redux/features/blogs/blogsApi";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utilis/dateFormater";
import { MdModeEdit } from "react-icons/md";

const ManagePosts = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: blogs = [], error, isLoading, refetch } = useFetchBlogsQuery({ search: "", category: "" });
  const [deletePost] = useDeleteBlogMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const handleDelete = (id) => {
    setPostIdToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePost(postIdToDelete).unwrap();
      alert("Bài viết đã được xóa thành công!");
      refetch();
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    } finally {
      setIsDialogOpen(false);
      setPostIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
    setPostIdToDelete(null);
  };

  const truncateTitle = (title) => (title.length > 50 ? title.substring(0, 50) + "..." : title);

  const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/, (char) => char.toUpperCase());
  };


  const categories = [...new Set(blogs.map((blog) => capitalizeFirstLetter(blog.category.toLowerCase())))];

  const filteredBlogs = blogs.filter((blog) => {
    const blogCategoryFormatted = capitalizeFirstLetter(blog.category.toLowerCase());
    const selectedCategoryFormatted = capitalizeFirstLetter(selectedCategory.toLowerCase());

    if (!selectedCategory) return true;
    return blogCategoryFormatted === selectedCategoryFormatted;
  });

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Không thể tải danh sách bài viết.</div>}

      <section className="py-1 bg-blueGray-50">
        <div className="w-full mb-12 xl:mb-0 px-4 mx-auto">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">Bài viết</h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <Link to="/blogs">
                    <button className="bg-indigo-500 text-white text-xs font-bold uppercase px-3 py-1 rounded">
                      xem danh sách bài viết
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="px-4 py-2">
              <label className="font-semibold">Lọc theo danh mục:</label>
              <select className="ml-2 border p-1 rounded" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Tất cả</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="block w-full overflow-x-auto">
              <table className="items-center bg-transparent w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left">STT</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Tiêu đề</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Danh mục</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Ngày đăng</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Chỉnh sửa</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.map((blog, index) => (
                    <tr key={blog._id} className="border-b">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{truncateTitle(blog.title)}</td>
                      <td className="px-6 py-4">{capitalizeFirstLetter(blog.category)}</td>
                      <td className="px-6 py-4">{formatDate(blog.createdAt)}</td>
                      <td className="px-6 py-4">
                        <Link to={`/dashboard/update-items/${blog._id}`} className="hover:text-blue-700">
                          <span className="flex gap-1 items-center">
                            <MdModeEdit /> Chỉnh sửa
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(blog._id)}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {/* Confirmation Dialog */}
      {isDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
              <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
              <p>Bạn có chắc chắn muốn xóa bài viết này?</p>
              <div className="flex justify-end mt-4">
                <button className="bg-red-600 text-white px-4 py-2 mr-2" onClick={confirmDelete}>Xóa</button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2" onClick={cancelDelete}>Hủy</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ManagePosts;