import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = () => {
  const { backendUrl, token, currency, formatPrice } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])
  const [retryingOrderId, setRetryingOrderId] = useState(null)

  const loadOrderData = async () => {
    try {
      if (!token) return

      const response = await axios.post(
        backendUrl + '/api/order/user-orders',
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        // Lưu thông tin đơn hàng đầy đủ (bao gồm orderId)
        let allOrdersItem = []

        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['orderId'] = order._id
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['orderDate'] = order.createdAt
            item['orderAmount'] = order.amount
            allOrdersItem.push(item)
          })
        })

        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  // Polling: cập nhật status mỗi 10 giây
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrderData()
    }, 10000)
    
    return () => clearInterval(interval)
  }, [token, backendUrl])

  // Xử lý retry payment
  const handleRetryPayment = async (orderId) => {
    try {
      setRetryingOrderId(orderId)
      
      const response = await axios.post(
        backendUrl + '/api/payment/retry-payment',
        { orderId },
        { headers: { token } }
      )

      if (response.data.success) {
        // Chuyển hướng đến trang thanh toán VNPay
        window.location.href = response.data.paymentUrl
      } else {
        toast.error(response.data.message || 'Không thể thanh toán lại')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setRetryingOrderId(null)
    }
  }

  // Hàm hiển thị trạng thái
  const getStatusDisplay = (item) => {
    // Nếu đã thanh toán VNPay thành công, hiển thị "Đơn hàng đã đặt"
    if (item.paymentMethod === 'vnpay' && item.payment === true) {
      return item.status || 'Đơn hàng đã đặt'
    }
    return item.status
  }

  // Hàm lấy màu của status dot
  const getStatusColor = (item) => {
    const status = item.status
    if (status === 'Đã giao thành công') return 'bg-green-500'
    if (status === 'Đang xử lý' || status === 'Đang giao hàng') return 'bg-yellow-500'
    if (status === 'Chờ thanh toán') return 'bg-orange-500'
    if (status === 'Thanh toán thất bại') return 'bg-red-500'
    if (status === 'Đơn hàng đã đặt') return 'bg-blue-500'
    return 'bg-gray-500'
  }

  // Kiểm tra xem đơn hàng có thể retry payment không
  const canRetryPayment = (item) => {
    return item.paymentMethod === 'vnpay' && 
           item.payment === false && 
           (item.status === 'Chờ thanh toán' || item.status === 'Thanh toán thất bại')
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'ĐƠN HÀNG'} text2={'CỦA TÔI'} />
      </div>

      <div>
        {orderData && orderData.length > 0 ? (
          orderData.map((item, index) => (
            <div
              key={index}
              className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'
            >
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt='' />

                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>

                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p className='text-lg'>
                      {formatPrice(item.price)} {currency}
                    </p>
                    <p>Số lượng: {item.quantity}</p>
                    <p>Kích cỡ: {item.size}</p>
                  </div>

                  <p className='mt-2'>
                    Ngày:{' '}
                    <span className='text-gray-400'>
                      {new Date(item.orderDate).toLocaleDateString('vi-VN')}
                    </span>
                  </p>

                  <p className='mt-2'>
                    Phương thức thanh toán:{' '}
                    <span className='text-gray-400'>
                      {item.paymentMethod === 'vnpay'
                        ? 'VNPAY'
                        : item.paymentMethod === 'cod'
                        ? 'COD'
                        : item.paymentMethod}
                    </span>
                  </p>

                  {/* Trạng thái thanh toán */}
                  <p className='mt-2'>
                    Trạng thái thanh toán:{' '}
                    <span
                      className={`font-medium ${
                        item.payment ? 'text-green-500' : 'text-orange-500'
                      }`}
                    >
                      {item.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </p>
                </div>
              </div>

              <div className='md:w-1/2 flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <p className={`min-w-2 h-2 rounded-full ${getStatusColor(item)}`}></p>
                  <p className='text-sm md:text-base'>{getStatusDisplay(item)}</p>
                </div>

                {/* Nút thanh toán lại hoặc theo dõi đơn hàng */}
                {canRetryPayment(item) ? (
                  <button 
                    onClick={() => handleRetryPayment(item.orderId)}
                    disabled={retryingOrderId === item.orderId}
                    className='border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors disabled:opacity-50'
                  >
                    {retryingOrderId === item.orderId ? 'Đang xử lý...' : 'Thanh toán ngay'}
                  </button>
                ) : (
                  <button className='border px-4 py-2 text-sm font-medium rounded-sm'>
                    Theo dõi đơn hàng
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500 py-8 text-2xl'>
            KHÔNG CÓ ĐƠN HÀNG NÀO
          </p>
        )}
      </div>
    </div>
  )
}

export default Orders
