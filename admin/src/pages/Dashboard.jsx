import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl, currency, formatPrice } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

 
  const fetchStats = async () => {
    try {
      setLoading(true)
      
      const productsRes = await axios.get(backendUrl + '/api/product/list')
      const productCount = productsRes.data.success ? productsRes.data.products.length : 0

      const ordersRes = await axios.post(backendUrl + '/api/order/list', {}, {headers: { token }})

      if (ordersRes.data.success) {
        const orders = ordersRes.data.orders
        const completedOrders = orders.filter(order => order.status === 'Đã giao thành công')
        const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.amount || 0), 0)
        const completedCount = completedOrders.length

        setStats({
          totalProducts: productCount,
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          completedOrders: completedCount
        })

        setRecentOrders(orders.slice(0, 10))
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi khi tải dữ liệu dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchStats()
    }
  }, [token])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đơn hàng đã đặt':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'Đang đóng gói':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'Đã gửi hàng':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'Đang giao hàng':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'Đã giao thành công':
        return 'bg-green-100 text-green-700 border-green-300'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  return (
    <div className='w-full'>
      <h1 className='text-3xl font-bold mb-8 text-gray-800'>Bảng điều khiển</h1>

      {loading ? (
        <div className='flex items-center justify-center h-screen'>
          <p className='text-gray-500 text-lg'>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
            <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500 text-sm font-medium uppercase tracking-wide'>
                    Tổng sản phẩm
                  </p>
                  <p className='text-3xl font-bold text-gray-800 mt-2'>
                    {stats.totalProducts}
                  </p>
                </div>
                <div className='bg-blue-100 p-4 rounded-full'>
                  <svg className='w-8 h-8 text-blue-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M3 1a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3z' />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500 text-sm font-medium uppercase tracking-wide'>
                    Tổng đơn hàng
                  </p>
                  <p className='text-3xl font-bold text-gray-800 mt-2'>
                    {stats.totalOrders}
                  </p>
                </div>
                <div className='bg-purple-100 p-4 rounded-full'>
                  <svg className='w-8 h-8 text-purple-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z' />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500 text-sm font-medium uppercase tracking-wide'>
                    Tổng doanh thu
                  </p>
                  <p className='text-3xl font-bold text-gray-800 mt-2'>
                    {formatPrice(stats.totalRevenue)}
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>{currency}</p>
                </div>
                <div className='bg-green-100 p-4 rounded-full'>
                  <svg className='w-8 h-8 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                  </svg>
                </div>
              </div>
            </div>

            {/* Completed Orders */}
            <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500 text-sm font-medium uppercase tracking-wide'>
                    Đơn hoàn thành
                  </p>
                  <p className='text-3xl font-bold text-gray-800 mt-2'>
                    {stats.completedOrders}
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>
                    {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                  </p>
                </div>
                <div className='bg-orange-100 p-4 rounded-full'>
                  <svg className='w-8 h-8 text-orange-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-800 mb-6'>
              🔔 Đơn hàng gần nhất
            </h2>

            {recentOrders.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gray-50 border-b border-gray-200'>
                      <th className='text-left px-4 py-3 text-gray-600 font-semibold text-sm'>
                        ID đơn hàng
                      </th>
                      <th className='text-left px-4 py-3 text-gray-600 font-semibold text-sm'>
                        Số lượng
                      </th>
                      <th className='text-left px-4 py-3 text-gray-600 font-semibold text-sm'>
                        Tổng tiền
                      </th>
                      <th className='text-left px-4 py-3 text-gray-600 font-semibold text-sm'>
                        Trạng thái
                      </th>
                      <th className='text-left px-4 py-3 text-gray-600 font-semibold text-sm'>
                        Phương thức TT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr
                        key={order._id || index}
                        className='border-b border-gray-100 hover:bg-gray-50 transition-colors'
                      >
                        <td className='px-4 py-4 text-gray-800 font-medium text-sm'>
                          {order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className='px-4 py-4 text-gray-600 text-sm'>
                          {order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0}
                        </td>
                        <td className='px-4 py-4 text-gray-800 font-semibold text-sm'>
                          {formatPrice(order.amount)} {currency}
                        </td>
                        <td className='px-4 py-4'>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                            {order.status || 'N/A'}
                          </span>
                        </td>
                        <td className='px-4 py-4 text-gray-600 text-sm'>
                          {order.paymentMethod || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-gray-500 text-center py-8'>
                Chưa có đơn hàng nào
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
