import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets.js'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px] font-medium'>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg' to='/dashboard'>
                <img className='w-5 h-5' src={assets.dashboard_icon} alt="" />
                <p className='hidden md:block'>Thống kê và báo cáo</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg' to='/add'>
                <img className='w-5 h-5' src={assets.add_icon} alt="" />
                <p className='hidden md:block'>Thêm sản phẩm</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg' to='/list'>
                <img className='w-5 h-5' src={assets.order_icon} alt="" />
                <p className='hidden md:block'>Danh sách sản phẩm</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg' to='/orders'>
                <img className='w-5 h-5' src={assets.add_icon} alt="" />
                <p className='hidden md:block'>Quản lý đơn hàng</p>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar
