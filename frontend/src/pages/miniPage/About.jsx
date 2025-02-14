import React from "react";
import AboutImg from "../../assets/about.webp";
const About = () => {
  return (
    <div className="bg-white text-primary container mx-auto mt-8 p-8">
      <h2 className="md:text-4xl text-3xl font-medium md:leading-tight pt-8 mb-12 md:px-24">
        Giới thiệu
      </h2>
      <div className="md:px-24">
        <img src={AboutImg} alt="" className="rounded-full" />
        {/* <p className='mt-5 text-center md:w-72 text-sm'>Bùi Đức Giang</p> */}
      </div>

      <div className="mt-10 md:px-24 space-y-8">
        <p>
          Tôi là một người luôn tò mò và đam mê khám phá những khía cạnh đa dạng
          của cuộc sống. Với niềm yêu thích ghi lại những câu chuyện, cảm xúc và
          hành trình cá nhân, tôi đã bắt đầu blog{" "}
          <a href="/" className="text-blue-400 underline">
            blog.com
          </a>{" "}
          để chia sẻ những trải nghiệm và góc nhìn độc đáo của mình về cuộc
          sống.
        </p>

        <p>
          Khi không mải mê theo đuổi những dự án hoặc ý tưởng mới, tôi thường
          dành thời gian viết lách và trò chuyện cùng bạn bè, người thân về
          những điều mình quan sát được. Tôi có khả năng đặc biệt trong việc
          truyền tải cảm xúc và bản sắc riêng của mỗi câu chuyện qua từng dòng
          chữ. Blog của tôi là nơi tôi kết nối với mọi người, giúp họ tìm thấy
          nguồn cảm hứng và khám phá những khía cạnh thú vị của chính mình.
        </p>

        <p>
          Bên cạnh niềm đam mê viết lách, tôi cũng yêu thích đọc sách và dành
          thời gian hòa mình vào thiên nhiên. Tôi là người yêu thích sự sáng
          tạo, luôn sẵn lòng thử nghiệm những điều mới lạ và khám phá bản thân
          qua từng trải nghiệm. Sự nhiệt huyết và niềm vui sống của tôi luôn lan
          tỏa đến những người xung quanh.
        </p>

        <p>
          Blog cá nhân này là không gian để tôi chia sẻ những suy nghĩ, cảm nhận
          và hành trình của mình. Tôi hy vọng rằng qua từng bài viết, bạn sẽ tìm
          thấy điều gì đó đồng điệu, hoặc đơn giản là một chút cảm hứng để thêm
          yêu đời. Cuộc sống là một cuộc hành trình, và tôi rất háo hức được
          chia sẻ hành trình của mình với bạn.
        </p>
      </div>
    </div>
  );
};

export default About;
