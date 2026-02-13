import { assets } from '../assets/assets'
import { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'

const Hero = () => {

  const { navigate } = useContext(ShopContext)
  const [current, setCurrent] = useState(0)

  const images = [
    assets.hero_img,
    assets.hero_img1,
    assets.hero_img2,
    assets.hero_img3,
    assets.hero_img4
  ]

  // Auto slide mỗi 5 giây 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => { setCurrent((current + 1) % images.length) }
  const prevSlide = () => { setCurrent((current - 1 + images.length) % images.length) }

  return (
    <div className='relative w-full h-[60vh] md:h-[85vh]'>

      {/* Ảnh nền */}
      {images.map((img, index) => (
        <img key={index} src={img} alt='Hero'
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 
             ${index === current ? 'opacity-100' : 'opacity-0'}`} />
      ))
      }

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

      {/* Dots Indicator */}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3'>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer
              ${index === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`
            }
          />
        ))}
      </div>

      {/* Nút điều hướng */}
      <button onClick={prevSlide} className='absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl cursor-pointer'> ❮ </button>
      <button onClick={nextSlide} className='absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl cursor-pointer'> ❯ </button>
    </div>
  )
}

export default Hero
