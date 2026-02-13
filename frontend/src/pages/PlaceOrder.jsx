import { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod')
  const { navigate } = useContext(ShopContext)

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/orders');
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* BÊN TRÁI */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'THÔNG TIN'} text2={'GIAO HÀNG'} />
        </div>
        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Họ' required />
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Tên' required />
        </div>
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='email' placeholder='Email' />
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Số nhà, tên đường' required />
        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Phường/Xã' required />
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Quận/Huyện' required />
        </div>
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Tỉnh/Thành phố' required />
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='tel' placeholder='Sô điện thoại' pattern='0[0-9]{10}' required />
      </div>
      {/* BÊN PHẢI */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PHƯƠNG THỨC'} text2={'THANH TOÁN'} />
          {/* CHỌN PHƯƠNG THỨC THANH TOÁN */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('momo')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'momo' ? 'bg-red-500' : ''}`}></p>
              <img className='h-6 mx-4' src={assets.momo_logo} alt='' />
            </div>
            <div onClick={() => setMethod('zalopay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'zalopay' ? 'bg-red-500' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.zalopay_logo} alt='' />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-red-500' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>COD</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-rose-500 hover:bg-rose-600 rounded-full text-white px-16 py-3 text-sm active:bg-rose-700 cursor-pointer'>ĐẶT HÀNG</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
