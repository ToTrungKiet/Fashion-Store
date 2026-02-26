import { useState, useEffect } from 'react'
import { assets } from '../assets/assets.js'
import axios from 'axios'
import { backendUrl } from '../App.jsx'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const Edit = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  const fetchProduct = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/product/single', { productId: id })
      if (response.data.success) {
        const p = response.data.product
        setName(p.name)
        setDescription(p.description)
        setPrice(p.price)
        setCategory(p.category)
        setSubCategory(p.subCategory)
        setBestseller(p.bestseller)
        setSizes(p.sizes || [])
        
        setImage1(p.image[0] || false)
        setImage2(p.image[1] || false)
        setImage3(p.image[2] || false)
        setImage4(p.image[3] || false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Không tải được sản phẩm')
    }
  }

  useEffect(() => {
    if (id) fetchProduct()
  }, [id])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('id', id)
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))
      
      if (image1 && image1 instanceof File) formData.append('image1', image1)
      if (image2 && image2 instanceof File) formData.append('image2', image2)
      if (image3 && image3 instanceof File) formData.append('image3', image3)
      if (image4 && image4 instanceof File) formData.append('image4', image4)

      const response = await axios.post(backendUrl + '/api/product/update', formData, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/list')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
      toast.error(error?.response?.data?.message || 'Lỗi kết nối');
    }
  }

  const preview = (img) => {
    if (!img) return assets.upload_area
    if (typeof img === 'string') return img
    return URL.createObjectURL(img)
  }

  return (
    <div>
      <p className='mb-4 text-lg font-semibold'>Chỉnh sửa sản phẩm</p>
      <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>Tải hình ảnh (chỉ chọn nếu muốn đổi)</p>
          <div className='flex gap-4'>
            <label htmlFor="image1" className='cursor-pointer'>
              <img className='w-40' src={preview(image1)} alt="" />
              <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
            </label>
            <label htmlFor="image2" className='cursor-pointer'>
              <img className='w-40' src={preview(image2)} alt="" />
              <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
            </label>
            <label htmlFor="image3" className='cursor-pointer'>
              <img className='w-40' src={preview(image3)} alt="" />
              <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
            </label>
            <label htmlFor="image4" className='cursor-pointer'>
              <img className='w-40' src={preview(image4)} alt="" />
              <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Tên sản phẩm</p>
          <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nhập tên sản phẩm' required />
        </div>
        <div className='w-full'>
          <p className='mb-2'>Mô tả sản phẩm</p>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Nhập mô tả sản phẩm' required />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-2'>Danh mục sản phẩm</p>
            <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2 mb-2'>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Trẻ em">Trẻ em</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Loại sản phẩm</p>
            <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 mb-2'>
              <option value="Áo">Áo</option>
              <option value="Quần">Quần</option>
              <option value="Áo khoác">Áo khoác</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Giá sản phẩm</p>
            <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full sm:w-[120px] px-3 py-2' type="Number" placeholder='100000' />
          </div>
        </div>
        <div>
          <p className='mb-2'>Kích cỡ sản phẩm</p>
          <div className='flex gap-3'>
            {['S','M','L','XL','XXL'].map(sz => (
              <div key={sz} onClick={() => setSizes(prev => prev.includes(sz) ? prev.filter(item => item !== sz) : [...prev, sz])}>
                <p className={`${sizes.includes(sz) ? 'bg-rose-300' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>{sz}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller'/>
          <label htmlFor="bestseller" className='cursor-pointer'>Thêm vào sản phẩm nổi bật</label>
        </div>
        <button type="submit" className='w-36 py-3 mt-4 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 cursor-pointer text-white rounded-full'>Cập nhật sản phẩm</button>
      </form>
    </div>
  )
}

export default Edit
