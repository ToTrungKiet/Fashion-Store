import { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, Link } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag } from "react-icons/fi";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to='/'>
        <img src={assets.logo_img} className='w-36 cursor-pointer' alt='logo' />
      </Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p className='transition hover:text-red-400'>TRANG CHỦ</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-red-600 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p className='transition hover:text-red-400'>BỘ SƯU TẬP</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-red-600 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p className='transition hover:text-red-400'>GIỚI THIỆU</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-red-600 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p className='transition hover:text-red-400'>LIÊN HỆ</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-red-600 hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        <FiSearch className="w-6 h-6 cursor-pointer hover:text-red-500 transition" />

        <div className='group relative'>
          <FiUser className='w-6 h-6 cursor-pointer hover:text-red-500 transition' />

          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
            <div className='flex flex-col gap-2 w-38 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
              <p className='cursor-pointer hover:text-red-500'>Hồ sơ của tôi</p>
              <p className='cursor-pointer hover:text-red-500'>Đơn hàng</p>
              <p className='cursor-pointer hover:text-red-500'>Đăng xuất</p>
            </div>
          </div>
        </div>

        <Link to='/cart' className='relative'>
          <FiShoppingBag className="w-6 h-6 cursor-pointer hover:text-red-500 transition" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            10
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt='menu_icon'
        />
      </div>

      {/* Menu dành cho màn hình nhỏ */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'} z-50`}
      >
        <div className='flex flex-col text-gray-600'>
          <div
            onClick={() => setVisible(false)}
            className='flex items-center gap-4 p-3 cursor-pointer'
          >
            <img
              src={assets.dropdown_icon}
              className='h-4 rotate-180'
              alt='dropdown_icon'
            />
            <p>Trở lại</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className='py-2 pl-6 border'
            to='/'
          >
            TRANG CHỦ
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className='py-2 pl-6 border'
            to='/collection'
          >
            BỘ SƯU TẬP
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className='py-2 pl-6 border'
            to='/about'
          >
            GIỚI THIỆU
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className='py-2 pl-6 border'
            to='/contact'
          >
            LIÊN HỆ
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
