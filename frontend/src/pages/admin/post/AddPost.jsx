import React, { useState, useRef, useEffect } from "react";
import { usePostBlogMutation } from "../../../redux/features/blogs/blogsApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import Header from "@editorjs/header";

const AddPost = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [coverImg, setCoverImg] = useState(null);
  const [category, setCategory] = useState("");
  const [topic, setTopic] = useState(""); // Thêm state cho topic
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [PostBlog, { isLoading }] = usePostBlogMutation();

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // EditorJS setup
  useEffect(() => {
    const editor = new EditorJS({
      holder: "editorjs",
      onReady: () => {
        editorRef.current = editor;
      },
      autofocus: true,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
      },
    });

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const content = await editorRef.current.save();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", JSON.stringify(content));
      formData.append("coverImg", coverImg);
      formData.append("category", capitalizeFirstLetter(category || ""));
      formData.append("topic", capitalizeFirstLetter(topic || "")); // Thêm trường topic vào formData
      formData.append("description", metaDescription);
      formData.append("author", user?._id);
      formData.append("rating", rating);

      const response = await PostBlog(formData).unwrap();
      alert(response.message);
      navigate("/blogs");
    } catch (error) {
      console.error(error);
      setMessage("Thêm bài viết thất bại! Hãy thử lại.");
    }
  };

  return (
    <div className="bg-white md:p-8 p-2">
      <h2 className="text-2xl font-semibold">Thêm bài viết</h2>
      <form onSubmit={handleSubmit} className="space-y-5 pt-8">
        <div className="space-y-4">
          <label className="font-semibold text-xl">Tiêu đề: </label>
          <input
            type="text"
            value={title}
            className="w-full inline-block bg-bgPrimary focus:outline-none px-5 py-3"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Cảm nhận về ..."
            required
          />
        </div>

        {/* Blog details */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Left side - Nội dung bài viết */}
          <div className="md:w-2/3 w-full">
            <p className="font-semibold text-xl mb-5">Nội dung</p>
            <div id="editorjs"></div>
          </div>

          {/* Right side - Các thông tin bổ sung */}
          <div className="md:w-1/3 w-full border p-5 space-y-5">
            <p className="font-semibold text-xl">THÔNG TIN BÀI VIẾT</p>

            {/* Ảnh bìa */}
            <div className="space-y-3">
              <label className="font-semibold">Ảnh bìa: </label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

                  if (file && !allowedFormats.includes(file.type)) {
                    alert("Vui lòng chọn tệp hình ảnh có định dạng png, jpg hoặc webp.");
                    e.target.value = ""; // Reset input file
                    setCoverImg(null); // Xóa ảnh bìa
                  } else {
                    setCoverImg(file);
                  }
                }}
                className="w-full inline-block bg-bgPrimary focus:outline-none px-5 py-3"
                required
              />
            </div>


            {coverImg && (
              <div className="mt-4">
                <img src={URL.createObjectURL(coverImg)} alt="Preview" className="w-full h-auto" />
              </div>
            )}

            {/* Thể loại */}
            <div className="space-y-3">
              <label className="font-semibold">Thể loại: </label>
              <input
                type="text"
                value={category}
                className="w-full inline-block bg-bgPrimary focus:outline-none px-5 py-3"
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Truyện tranh/Thể thao/vài thể loại khác"
                required
              />
            </div>

            {/* Topic */}
            <div className="space-y-3">
              <label className="font-semibold">Chủ đề: </label>
              <input
                type="text"
                value={topic} // Thêm state cho topic
                className="w-full inline-block bg-bgPrimary focus:outline-none px-5 py-3"
                onChange={(e) => setTopic(e.target.value)} // Cập nhật state khi người dùng nhập
                placeholder="Nhập chủ đề cho bài viết"
                required
              />
            </div>

            {/* Meta description */}
            <div className="space-y-3">
              <label className="font-semibold">Dữ liệu, mô tả: </label>
              <textarea
                cols={4}
                rows={4}
                value={metaDescription}
                className="w-full inline-block bg-bgPrimary focus:outline-none px-5 py-3"
                onChange={(e) => setMetaDescription(e.target.value)}
                required
              />
            </div>

            {/* Tác giả */}
            <div className="space-y-3">
              <label className="font-semibold">Tác giả: </label>
              <input
                type="text"
                value={user?.username || ""}
                className="w-full inline-block bg-bgPrimary focus:outline-none px-5 py-3"
                placeholder={`${user?.username || "Chưa đăng nhập"} (not editable)`}
                disabled
              />

            </div>
          </div>
        </div>

        {message && <p className="text-red-500">{message}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md"
        >
          THÊM BÀI VIẾT
        </button>
      </form>
    </div>
  );
};

export default AddPost;