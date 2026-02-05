import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {

  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-sm md:text-base text-gray-700'>
      <div>
        <img className='w-12 m-auto mb-5' src={assets.exchange_icon} alt='' />
        <p className='font-semibold'>Chính sách đổi trả dễ dàng</p>
        <p className='text-gray-400'>Chúng tôi hỗ trợ đổi trả nhanh chóng và thuận tiện cho tất cả sản phẩm.</p>
      </div>
      <div>
        <img className='w-12 m-auto mb-5' src={assets.quality_icon} alt='' />
        <p className='font-semibold'>Chính sách đổi trả 7 ngày</p>
        <p className='text-gray-400'>Chúng tôi cung cấp chính sách 7 ngày đổi trả miễn phí.</p>
      </div>
      <div>
        <img className='w-12 m-auto mb-5' src={assets.support_img} alt='' />
        <p className='font-semibold'>Hỗ trợ khách hàng 24/7</p>
        <p className='text-gray-400'>Chúng tôi hỗ trợ khách hàng 24/7 để giải đáp mọi thắc mắc của bạn.</p>
      </div>
    </div>
  )
}

export default OurPolicy
