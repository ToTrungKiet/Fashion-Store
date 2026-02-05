import React from 'react'

const NewsletterBox = () => {

  const onSubmitHandler = (e) => {
    e.preventDefault();
  }

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Đăng ký ngay và nhận 20% giảm giá</p>
      <p className='text-gray-400 mt-3'>Đăng ký nhanh chóng để nhận ưu đãi đặc biệt và cập nhật các sản phẩm mới nhất.</p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input type='email' placeholder='Nhập email của bạn' className='w-full sm:flex-1 outline-none' required/>
        <button type='submit' className='bg-red-500 hover:bg-red-600 text-white md:text-sm text-xs px-10 py-4 cursor-pointer tracking-wide'>ĐĂNG KÝ</button>
      </form>
    </div>
  )
}

export default NewsletterBox
