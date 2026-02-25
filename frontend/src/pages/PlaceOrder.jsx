import { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const PlaceOrder = () => {

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext)
  const [method, setMethod] = useState('cod')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    phone: ''
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }))
  }


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      }
      switch (method) {
          case 'cod': 
            const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: {token}})
            if (response.data.success) {
              setCartItems({})
              navigate('/orders')
              toast.success(response.data.message)
            } else {
              toast.error(response.data.message)
            }
            break;
          case 'momo': 
            break;
          case 'zalopay': 
            break;
          default: 
            break;
      }
      
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra !')
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* BÊN TRÁI */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'THÔNG TIN'} text2={'GIAO HÀNG'} />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Họ' required />
          <input onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Tên' required />
        </div>
        <input onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='email' placeholder='Email' required/>
        <input onChange={onChangeHandler} name='address' value={formData.address} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Số nhà, tên đường' required />
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='ward' value={formData.ward} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Phường/Xã' required />
          <input onChange={onChangeHandler} name='district' value={formData.district} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Quận/Huyện' required />
        </div>
        <input onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Tỉnh/Thành phố' required />
        <input onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='tel' placeholder='Sô điện thoại' pattern='0[0-9]{9}' required />
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
