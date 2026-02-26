import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { backendUrl, currency, formatPrice } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({token}) => {

  const [list, setList] = useState([])
  const navigate = useNavigate()

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Lấy danh sách sản phẩm thất bại !')
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, {headers: {token}})
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Xóa sản phẩm thất bại !')
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='text-2xl font-bold mb-6 text-gray-800'>Danh sách tất cả sản phẩm</p>
      <div className='flex flex-col gap-2'>
        {/* Danh sách tiêu đề bảng */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Hình ảnh</b>
          <b>Tên sản phẩm</b>
          <b>Danh mục</b>
          <b>Giá</b>
          <b className='text-center'>Hành động</b>
        </div>
        {/* Danh sách sản phẩm */}
        {
          list.map((item, index) => (
            <div key={index} className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'>
              <img className='w-28 object-cover' src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{formatPrice(item.price)} {currency}</p>
              <div className='flex justify-end md:justify-center gap-2'>
                <span onClick={() => removeProduct(item._id)} className='cursor-pointer text-lg'>X</span>
                <span onClick={() => navigate(`/edit/${item._id}`)} className='cursor-pointer text-lg'>✎</span>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default List
