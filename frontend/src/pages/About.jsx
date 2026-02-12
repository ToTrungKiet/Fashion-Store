import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'GIỚI THIỆU VỀ'} text2={'CHÚNG TÔI'} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[600px]' src={assets.about_img1} alt='' />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            Fashion Store được thành lập với mong muốn mang đến cho khách hàng những sản phẩm thời trang hiện đại, chất lượng cao và giá cả hợp lý.
            Chúng tôi không chỉ bán quần áo mà còn mang đến phong cách và sự tự tin cho mỗi người.
          </p>
          <p>
            Với đa dạng danh mục từ Nam, Nữ đến Trẻ em, chúng tôi luôn cập nhật xu hướng mới nhất nhằm đáp ứng nhu cầu thời trang ngày càng thay đổi của thị trường.
            Mỗi sản phẩm đều được chọn lọc kỹ lưỡng để đảm bảo sự thoải mái, bền đẹp và phù hợp với nhiều phong cách khác nhau.
          </p>
          <b className='text-gray-800'>Sứ mệnh của chúng tôi là giúp bạn tự tin thể hiện cá tính thông qua từng trang phục.</b>
        </div>
      </div>
      <div className='text-4xl py-4'>
        <Title text1={'TẠI SAO'} text2={'CHỌN CHÚNG TÔI'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Đảm bảo chất lượng:</b>
          <p className='text-gray-600'>Tất cả sản phẩm tại Fashion Store đều được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.
            Chúng tôi cam kết mang đến chất liệu tốt, đường may chắc chắn và thiết kế hiện đại.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Sự tiện lợi:</b>
          <p className='text-gray-600'>Giao diện website thân thiện, quy trình đặt hàng nhanh chóng và nhiều phương thức thanh toán linh hoạt giúp bạn mua sắm dễ dàng mọi lúc, mọi nơi.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Dịch vụ khách hàng đặc biệt:</b>
          <p className='text-gray-600'>Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp thắc mắc và hỗ trợ bạn trong suốt quá trình mua sắm.
            Sự hài lòng của khách hàng chính là ưu tiên hàng đầu của Fashion Store.</p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About
