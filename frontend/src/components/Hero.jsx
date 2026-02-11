import { assets } from '../assets/assets'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const Hero = () => {

  const { navigate } = useContext(ShopContext)

  return (
    <div className='relative w-full h-[60vh] md:h-[85vh]'>
      
      {/* Ảnh nền */}
      <img
        src={assets.hero_img}
        alt='Hero'
        className='absolute inset-0 w-full h-full object-cover'
      />

      {/* Lớp phủ */}
      <div className='absolute inset-0 bg-black/20'></div>

      {/* Nội dung */}
      <div className='relative h-full flex items-center justify-center text-center px-4'>
        <div className='text-white max-w-3xl'>
          <h1 className='text-3xl md:text-5xl lg:text-6xl font-semibold tracking-wide'>
            THIẾT KẾ MỚI
            <br />
            PHONG CÁCH DẪN ĐẦU
          </h1>

          <p className='mt-4 text-sm md:text-base tracking-widest opacity-90'>
            KHÁM PHÁ BỘ SƯU TẬP MỚI NHẤT
          </p>

          <button onClick={() => navigate('/collection')} className='mt-8 px-8 py-3 bg-red-500 hover:bg-red-600 transition text-white text-sm tracking-wide rounded-full cursor-pointer'>
            MUA NGAY
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero
