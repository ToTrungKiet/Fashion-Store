import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { backendUrl, currency, formatPrice } from '../App.jsx'

const Warehouse = ({ token }) => {
  const [products, setProducts] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('inventory')
  const [restockData, setRestockData] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedProduct, setExpandedProduct] = useState(null)

  useEffect(() => {
    fetchInventory()
    fetchBestSellers()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/product/inventory`, {
        method: 'GET',
        headers: { token }
      })
      const data = await response.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu kho hàng')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBestSellers = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/product/best-sellers`, {
        method: 'GET',
        headers: { token }
      })
      const data = await response.json()
      if (data.success) {
        setBestSellers(data.products)
      }
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu sản phẩm bán chạy')
      console.error(error)
    }
  }

  const getTotalQuantity = (product) => {
    if (!product.sizeColorQuantity) return 0
    return Object.values(product.sizeColorQuantity).reduce((sum, qty) => sum + qty, 0)
  }

  const handleRestock = async (productId, size, color) => {
    const key = `${productId}-${size}-${color}`
    const quantity = restockData[key]
    if (!quantity || quantity <= 0) {
      toast.error('Vui lòng nhập số lượng hợp lệ')
      return
    }
    try {
      const response = await fetch(`${backendUrl}/api/product/restock`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({ id: productId, size, color, addQuantity: Number(quantity) })
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Nhập hàng thành công')
        setRestockData(prev => ({ ...prev, [key]: '' }))
        fetchInventory()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Lỗi khi nhập hàng')
      console.error(error)
    }
  }

  const handleQuantityUpdate = async (productId, size, color, newQuantity) => {
    try {
      const response = await fetch(`${backendUrl}/api/product/update-quantity`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({ id: productId, size, color, quantity: Number(newQuantity) })
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Cập nhật số lượng thành công')
        fetchInventory()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật số lượng')
      console.error(error)
    }
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getProductStatus = (product) => {
    const total = getTotalQuantity(product)
    if (total === 0) return 'out'
    if (total <= 5) return 'low'
    return 'good'
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'out': return 'bg-red-100'
      case 'low': return 'bg-yellow-100'
      default: return 'bg-green-100'
    }
  }

  if (loading) return <div className='text-center py-10'>Đang tải...</div>

  return (
    <div className='p-4'>
      <h1 className='text-3xl font-bold mb-6'>Quản lý Kho Hàng</h1>

      <div className='flex gap-4 mb-6'>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === 'inventory' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Tồn Kho ({filteredProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('bestSellers')}
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === 'bestSellers' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Sản Phẩm Bán Chạy
        </button>
      </div>

      {activeTab === 'inventory' && (
        <div>
          <div className='mb-6'>
            <input
              type='text'
              placeholder='Tìm kiếm sản phẩm...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border rounded-lg'
            />
          </div>

          <div className='space-y-4'>
            {filteredProducts.map(product => {
              const status = getProductStatus(product)
              const totalQty = getTotalQuantity(product)
              const isExpanded = expandedProduct === product._id
              
              return (
                <div 
                  key={product._id} 
                  className={`border rounded-lg p-4 ${getStatusColor(status)}`}
                >
                  <div 
                    className='flex items-center justify-between cursor-pointer'
                    onClick={() => setExpandedProduct(isExpanded ? null : product._id)}
                  >
                    <div className='flex-1'>
                      <h3 className='font-bold text-lg'>{product.name}</h3>
                      <p className='text-sm text-gray-600'>{formatPrice(product.price)} {currency}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold'>
                        {totalQty} 
                        <span className='text-sm ml-2 font-normal'>sản phẩm</span>
                      </p>
                      <p className='text-xs text-gray-600'>Tất cả size</p>
                    </div>
                    <span className='ml-4 text-2xl'>{isExpanded ? '▼' : '▶'}</span>
                  </div>

                  {isExpanded && (
                    <div className='mt-4 space-y-3 border-t pt-4'>
                      <div className='grid grid-cols-2 gap-3 mb-4'>
                        {product.sizes?.map(size => (
                          product.colors?.map(color => {
                            const key = `${size}-${color}`;
                            const currentQty = product.sizeColorQuantity?.[key] || 0;
                            const restockKey = `${product._id}-${size}-${color}`;
                            
                            return (
                              <div key={key} className='border rounded p-3 bg-white'>
                                <div className='flex justify-between items-center mb-2'>
                                  <span className='font-medium text-sm'>{size} - {color}</span>
                                  <span className='text-lg font-bold text-blue-600'>{currentQty}</span>
                                </div>
                                <div className='flex gap-2'>
                                  <input
                                    type='number'
                                    min='1'
                                    value={restockData[restockKey] || ''}
                                    onChange={(e) => setRestockData(prev => ({
                                      ...prev,
                                      [restockKey]: e.target.value
                                    }))}
                                    placeholder='Số lượng'
                                    className='flex-1 px-2 py-1 border rounded text-center text-xs'
                                  />
                                  <button
                                    onClick={() => handleRestock(product._id, size, color)}
                                    className='px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600'
                                  >
                                    +Nhập
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'bestSellers' && (
        <div>
          <h2 className='text-2xl font-bold mb-4'>Top Sản Phẩm Bán Chạy Nhất</h2>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead className='bg-blue-100'>
                <tr>
                  <th className='border p-3 text-left'>STT</th>
                  <th className='border p-3 text-left'>Tên Sản Phẩm</th>
                  <th className='border p-3 text-left'>Giá</th>
                  <th className='border p-3 text-center'>Đã Bán</th>
                  <th className='border p-3 text-center'>Tồn Kho</th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.slice(0, 20).map((product, index) => (
                  <tr key={product._id} className='hover:bg-gray-50'>
                    <td className='border p-3 font-bold'>{index + 1}</td>
                    <td className='border p-3'>{product.name}</td>
                    <td className='border p-3'>{formatPrice(product.price)} {currency}</td>
                    <td className='border p-3 text-center'>
                      <span className='bg-blue-200 px-3 py-1 rounded'>{product.sold}</span>
                    </td>
                    <td className='border p-3 text-center'>
                      <span className={`px-3 py-1 rounded ${
                        getTotalQuantity(product) === 0 ? 'bg-red-200' : 
                        getTotalQuantity(product) <= 5 ? 'bg-yellow-200' : 'bg-green-200'
                      }`}>
                        {getTotalQuantity(product)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Warehouse
