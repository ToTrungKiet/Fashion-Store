import React from 'react'
import { assets } from '../assets/assets.js'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img src={assets.logo_img} className='w-36 cursor-pointer' alt='logo' />
      <button onClick={() => setToken('')} className='bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer'>Đăng xuất</button>
    </div>
  )
}

export default Navbar
