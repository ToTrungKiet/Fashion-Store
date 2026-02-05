import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
           <img src={assets.logo_img} alt='' className='mb-5 w-32'/>
           <p className='w-full md:w-2/3 text-gray-600'>
              Chúng tôi cung cấp các sản phẩm chất lượng cao với thiết kế hiện đại, giá cả hợp lý
              và dịch vụ chăm sóc khách hàng tận tâm. Cam kết mang đến trải nghiệm mua sắm
              an toàn và tiện lợi cho mọi khách hàng.
           </p>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>CÔNG TY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Trang chủ</li>
                <li>Về chúng tôi</li>
                <li>Vận chuyển</li>
                <li>Chính sách bảo mật</li>
            </ul>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>LIÊN HỆ</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM</li>
                <li>Email: info@fashionstore.com</li>
                <li>Điện thoại: (028) 1234 5678</li>
            </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>© 2026 Fashion Store. Tất cả các quyền được bảo lưu.</p>
      </div>
    </div>
  )
}

export default Footer
