import React from "react";

const ContactUs = () => {
  return (
    <section className="bg-white text-primary container mx-auto mt-8 md:px-24 p-8">
      <h2 className="md:text-4xl text-3xl font-medium md:leading-tight pt-8 pb-5">
        LIÊN HỆ
      </h2>

      {/* 1. Thông tin liên hệ */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">📞 Thông tin liên hệ</h3>
        <p>
          - SĐT:{" "}
          <a
            href="tel:0367513132"
            className="text-blue-500 underline hover:text-blue-700"
          >
            0367513132
          </a>{" "}
          (Nhấn để gọi)
        </p>
        <p>
          - Email:{" "}
          <a
            href="mailto:viethuydiet1412@gmail.com"
            className="text-blue-500 underline hover:text-blue-700"
          >
            viethuydiet1412@gmail.com
          </a>{" "}
          (Nhấn để gửi email)
        </p>
      </div>

      {/* 2. Gửi biểu mẫu */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">📋 Gửi biểu mẫu</h3>
        <p>Bạn có thể gửi phản hồi qua 4 biểu mẫu sau:</p>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <a
            href="https://forms.gle/AikSFKsEgLmKgEna6"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-red-500 text-white px-4 py-2 rounded text-center hover:bg-red-600"
          >
            🛑 Báo lỗi website
          </a>
          <a
            href="https://forms.gle/yifJq1pHJSDn4RyB6"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600"
          >
            ✍️ Đăng ký làm cộng tác viên
          </a>
          <a
            href="https://forms.gle/j7BPqTJNhgZ5Lcrw5
"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600"
          >
            📝 Đăng bài mới
          </a>
          <a
            href="https://forms.gle/Y514Xuc4jQ6kdUma9"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-yellow-500 text-white px-4 py-2 rounded text-center hover:bg-yellow-600"
          >
            🔄 Lấy lại mật khẩu
          </a>
        </div>
      </div>
      {/* 3. Lời kết */}
      <div className="mt-8 text-center text-gray-600 italic" style={{ fontSize: 30 }}>
        <p>
          Nếu gặp bất kỳ vấn đề gì, đừng ngần ngại góp ý để chúng mình hoàn thiện hơn! ❤️
        </p>
      </div>
    </section>
  );
};

export default ContactUs;
