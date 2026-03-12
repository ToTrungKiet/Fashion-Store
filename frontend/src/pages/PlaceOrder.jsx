import { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import AddressSelector from '../components/AddressSelector'

const PlaceOrder = () => {

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
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

  // Load thông tin từ profile nếu đã đăng nhập
  useEffect(() => {
    const loadUserProfile = async () => {
      if (token) {
        try {
          const res = await axios.post(
            backendUrl + '/api/user/profile',
            {},
            { headers: { token } }
          )
          if (res.data.success) {
            const user = res.data.user
            setFormData({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              address: user.address || '',
              ward: user.ward || '',
              district: user.district || '',
              city: user.city || '',
              phone: user.phone || ''
            })
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    loadUserProfile()
  }, [token, backendUrl])

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  const handlePayment = async () => {

  // Xử lý khi thay đổi địa chỉ từ AddressSelector
  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      city: addressData.city,
      district: addressData.district,
      ward: addressData.ward
    }))
  }
    const res = await axios.post(
      "http://localhost:4000/api/payment/create-payment",
      {
        amount: totalAmount
      }
    );

    window.location.href = res.data.paymentUrl;

  };

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    
    // Validate địa chỉ
    if (!formData.city || !formData.district || !formData.ward) {
      toast.error('Vui lòng chọn đầy đủ địa chỉ giao hàng!')
      return
    }
    
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
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
            toast.success(response.data.message)
          } else {
            toast.error(response.data.message)
          }
          break
        case 'momo':
          break
        case 'zalopay':
          break
        default:
          break
      }

    } catch (error) {
      console.log(error)
          break;
        case 'momo':
          break;
          case 'VNPay':
  const responseVNpay = await axios.post(
    backendUrl + "/api/payment/create-payment",
    orderData,
    { headers: { token } }
  );

  if (responseVNpay.data.success) {
    window.location.href = responseVNpay.data.paymentUrl;
  } else {
    toast.error(responseVNpay.data.message);
  }
  break;
      }

    } catch (error) {
      console.log(error);
      console.log("method:", method);
      toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra !')
    }
  }

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
        <input onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='email' placeholder='Email' required />
        <input onChange={onChangeHandler} name='address' value={formData.address} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Số nhà, tên đường' required />
        
        {/* Address Selector - Dropdown cascade */}
        <div className='grid grid-cols-2 gap-3'>
          <AddressSelector
            value={{ city: formData.city, district: formData.district, ward: formData.ward }}
            onChange={handleAddressChange}
          />
        </div>
        
        <input onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='tel' placeholder='Số điện thoại' pattern='0[0-9]{9}' required />
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

            {/* MOMO */}
            <div
              onClick={() => setMethod('momo')}
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer'
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'momo' ? 'bg-red-500' : ''}`}></p>
              <img className='h-6 mx-4' src={assets.momo_logo} alt='' />
            </div>

            {/* VNPAY */}
            <div
              onClick={() => setMethod('VNPay')}
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer'
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'VNPay' ? 'bg-red-500' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>Thanh toán VNPAY</p>
            </div>

            {/* COD */}
            <div
              onClick={() => setMethod('cod')}
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer'
            >
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
