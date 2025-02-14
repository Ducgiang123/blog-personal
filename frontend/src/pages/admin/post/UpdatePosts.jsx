import React, { useEffect, useRef, useState } from "react";
import { useFetchBlogByIdQuery, useUpdateBlogMutation } from "../../../redux/features/blogs/blogsApi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import Header from "@editorjs/header";

const UpdatePosts = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImg, setCoverImg] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [category, setCategory] = useState("");
  const [topic, setTopic] = useState(""); // Thêm state cho topic
  const [message, setMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);  // ✅ Theo dõi thay đổi
  const [showConfirm, setShowConfirm] = useState(false); // ✅ Hiển thị popup xác nhận
  const [PostBlog] = useUpdateBlogMutation();
  const { id } = useParams();
  const { data: blog = {}, error, isLoading, refetch } = useFetchBlogByIdQuery(id);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (blog?.post) {
      const editor = new EditorJS({
        holder: "editorjs",
        onReady: () => {
          editorRef.current = editor;
          if (blog?.post?.content) {
            editor.isReady.then(() => {
              editor.render(blog.post.content);
            });
          }
        },
        autofocus: true,
        tools: {
          header: { class: Header, inlineToolbar: true },
          list: { class: List, inlineToolbar: true },
        },
        onChange: () => setIsDirty(true), // ✅ Đánh dấu form đã thay đổi khi có chỉnh sửa
      });

      setTitle(blog.post.title || "");
      setDescription(blog.post.description || "");
      setCategory(blog.post.category || "");
      setTopic(blog.post.topic || ""); // Cập nhật giá trị topic từ bài viết
      setImgPreview(blog.post.coverImg || "");

      return () => {
        if (editorRef.current) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
      };
    }
  }, [blog]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "Bạn có chắc muốn rời khỏi trang?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!editorRef.current) {
        setMessage("Editor chưa sẵn sàng, vui lòng chờ!");
        return;
      }

      const content = await editorRef.current.save();
      const updatedPost = new FormData();
      updatedPost.append("title", title || blog?.post?.title);
      updatedPost.append("content", JSON.stringify(content));
      updatedPost.append("category", category || blog?.post?.category);
      updatedPost.append("topic", topic || blog?.post?.topic); // Thêm trường topic vào updatedPost
      updatedPost.append("description", description || blog?.post?.description);
      updatedPost.append("author", user?._id);

      if (coverImg) {
        updatedPost.append("coverImg", coverImg);
      }

      // Gửi request cập nhật bài viết
      const response = await PostBlog({ id, formData: updatedPost }).unwrap();

      // Cập nhật dữ liệu trong state ngay lập tức
      refetch();
      setImgPreview(response.post.coverImg);

      alert(response.message);
      setIsDirty(false);  // ✅ Đánh dấu đã lưu
      navigate("/dashboard/manage-items");
    } catch (error) {
      console.error(error);
      setMessage("Cập nhật bài viết thất bại! Hãy thử lại.");
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirm(true); // ✅ Hiển thị popup xác nhận
    } else {
      navigate("/dashboard/manage-items");
    }
  };

  const handleConfirmLeave = () => {
    setShowConfirm(false);
    navigate("/dashboard/manage-items");
  };

  return (
    <div className="bg-white md:p-8 p-2">
      <h2 className="text-2xl font-semibold pt-5">Chỉnh sửa bài viết</h2>
      <form onSubmit={handleSubmit} className="space-y-5 pt-8">
        <div className="space-y-4">
          <label className="font-semibold text-xl">Tiêu đề: </label>
          <input
            type="text"
            value={title}
            className="w-full inline-block bg-bgPrimary focus:outline-none px-5 py-3"
            onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
            required
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="md:w-2/3 w-full">
            <p className="font-semibold text-xl mb-5">Nội dung</p>
            <div id="editorjs"></div>
          </div>

          <div className="md:w-1/3 w-full border p-5 space-y-5">
            <p className="font-semibold text-xl">THÔNG TIN BÀI VIẾT</p>
            <div className="space-y-3">
              <label className="font-semibold">Ảnh bìa: </label>
              <input
                type="file"
                onChange={(e) => {
                  setCoverImg(e.target.files[0]);
                  setImgPreview(URL.createObjectURL(e.target.files[0]));
                  setIsDirty(true);
                }}
                className="w-full inline-block bg-bgPrimary focus:outline-none px-5 py-3"
              />
              {imgPreview && (
                <div className="mt-4">
                  <p className="font-semibold">Xem trước ảnh:</p>
                  <img
                    src={imgPreview}
                    alt="Preview"
                    className="w-full h-auto rounded-md shadow-md"
                  />
                </div>
              )}
            </div>
            <div className="space-y-3">
              <label className="font-semibold">Thể loại: </label>
              <input
                type="text"
                value={category}
                className="w-full inline-block bg-bgPrimary focus:outline-none px-5 py-3"
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="font-semibold">Chủ đề: </label>
              <input
                type="text"
                value={topic} // Sử dụng state cho topic
                className="w-full inline-block bg-bgPrimary focus:outline-none px-5 py-3"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const formattedTopic = inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase(); // Viết hoa chữ cái đầu, còn lại viết thường
                  setTopic(formattedTopic);
                }}
                placeholder="Nhập chủ đề cho bài viết"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="font-semibold">Mô tả, dữ liệu: </label>
              <textarea
                cols={4}
                rows={4}
                value={description}
                className="w-full inline-block bg-bgPrimary focus:outline-none px-5 py-3"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {message && <p className="text-red-500">{message}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md"
          >
            CẬP NHẬT
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full mt-5 bg-gray-400 hover:bg-gray-500 text-white font-medium py-3 rounded-md"
          >
            HỦY
          </button>
        </div>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">Lưu thay đổi?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Lưu
              </button>
              <button
                onClick={handleConfirmLeave}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePosts;
