import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const Footer = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (emailPattern.test(email)) {
      Swal.fire({
        title: "Đăng ký thành công!",
        text: "Hãy đón chờ những tin tức mới nhất từ chúng tôi.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // Reload trang khi ấn OK
      });
    } else {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng nhập email hợp lệ có định dạng @gmail.com",
        icon: "error",
        confirmButtonText: "Thử lại",
      }).then(() => {
        setEmail(""); // Xóa nội dung trong ô nhập email
      });
    }
  };

  if (
    location.pathname === "/dashboard" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/dashboard/add-new-post" ||
    location.pathname === "/dashboard/manage-items" ||
    location.pathname === "/dashboard/users"||
    location.pathname === "/profile"||
    location.pathname === "/profile/myprofile"
  ) {
    return null;
  }

  return (
    <footer className="bg-bgPrimary p-8">
      <div className="container mx-auto">
        <div className="about">
          <h3>Giới Thiệu</h3>
          <p>
            Một Website chia sẻ suy nghĩ, kiến thức, câu chuyện hoặc sở thích
            cá nhân của mình thông qua các bài viết.
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:nguyenhoanglong1272@gmail.com@gmail.com"
              className="bg-bgPrimary hover:text-blue-500 transition duration-300" 
            >
              viethuydiet1412@gmail.com
            </a>
          </p>
          <p>
            SĐT:{" "}
            <a
              href="tel:0367513132"
              className="bg-bgPrimary hover:text-blue-500 transition duration-300"
            >
              0367513132
            </a>{" "}
            {/* (Nhấn để gọi) */}
          </p>
        </div>
        <div className="quick_links">
          <h3>Liên Kết Nhanh</h3>
          <ul>
            <Link to={"/"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Trang Chủ
            </Link>
            <Link to={"/blogs"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Bài Viết
            </Link>
            <Link to={"/about-us"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Giới Thiệu
            </Link>
            <Link to={"/contact-us"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Liên Hệ
            </Link>
          </ul>
        </div>

        <div className="categories" >
          <h3>Một Số Thể Loại</h3>
          <ul>
            <li>Truyện Tranh</li>
            <li>Chính Trị</li>
            <li>Du Lịch</li>
            <li>Kinh Tế</li>
            <li>Văn Hóa</li>
          </ul>
        </div>
        <div className="news_letter">
          <div>
            <h3>Cập nhật liên tục</h3>
            <p>Nhận tin tức và cập nhật mới nhất từ chúng tôi</p>
          </div>
          <div>
            <input
              type="text"
              placeholder={`Your Email`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSubscribe}>ĐĂNG KÝ</button>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="logo">BLOG IS BUILT WITH MERN STACK</div>
        <div className="links">
          <Link to={""} target="_blank">
            <FaFacebook />
          </Link>
          <Link to={""} target="_blank">
            <FaTwitter />
          </Link>
          <Link to={""} target="_blank">
            <FaInstagram />
          </Link>
          <Link to={""} target="_blank">
            <FaYoutube />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
