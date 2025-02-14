import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Img1 from "../../assets/hero-carousel/blog.jpg";
import Img2 from "../../assets/hero-carousel/business_two.jpg";
import Img3 from "../../assets/hero-carousel/business_two.jpg";
import Img4 from "../../assets/hero-carousel/gaming_four.jpg";

const Hero = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center md:gap-14 gap-8">
      <div className="md:w-1/2 w-full text-center">
        <h1 className="md:text-5xl text-3xl font-bold md:leading-tight">
          Welcome to my blog!
        </h1>
        <p className="py-4">
          Viết blog cá nhân là một trong những cách tuyệt vời nhất để tôi chia
          sẻ cảm nhận, ý tưởng, và những câu chuyện của riêng mình. Dù là những
          trải nghiệm trong cuộc sống hàng ngày, những bài học tôi rút ra từ
          hành trình cá nhân, hay chỉ đơn giản là góc nhìn về các chủ đề tôi yêu
          thích, tất cả đều có một nơi để lưu giữ. Đây không chỉ là nơi để viết,
          mà còn là không gian để tôi kết nối, khám phá, và học hỏi từ mọi
          người. Hy vọng bạn sẽ tìm thấy niềm cảm hứng và sự đồng cảm qua từng
          bài viết!
        </p>
      </div>

      <div className="md:w-1/2 w-full mx-auto bg-black">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 50,
            },
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay]}
          className=""
        >
          <SwiperSlide>
            <img
              src={Img1}
              alt=""
              className="w-full lg:h-[420px] sm:h-96 h-80"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Img2}
              alt=""
              className="w-full lg:h-[420px] sm:h-96 h-80"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Img3}
              alt=""
              className="w-full lg:h-[420px] sm:h-96 h-80"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Img4}
              alt=""
              className="w-full lg:h-[420px] sm:h-96 h-80"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;
