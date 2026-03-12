import { useState, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ForgotPasswordModal = ({ onClose }) => {
  
  const { backendUrl } = useContext(ShopContext)
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(
        backendUrl + '/api/user/forgot-password',
        { email }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        setSent(true)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setSent(false)
    onClose()
  }

  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>

      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Quên mật khẩu</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {!sent ? (
        <form onSubmit={handleForgotPassword} className='w-full flex flex-col gap-4'>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type='email'
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Nhập email của bạn'
            required
          />
          <button 
            type='submit'
            disabled={loading}
            className='bg-rose-500 hover:bg-rose-600 cursor-pointer rounded-full text-white font-light px-8 py-2 mt-4 disabled:opacity-50 mx-auto'
          >
            {loading ? 'Đang gửi...' : 'Gửi email'}
          </button>
        </form>
      ) : (
        <div className='text-center'>
          <div className='text-green-500 text-5xl mb-4'>✓</div>
          <p className='text-gray-700 mb-2'>Email đã được gửi thành công!</p>
          <p className='text-gray-500 text-sm mb-4'>
            Vui lòng kiểm tra hộp thư của bạn và nhấp vào link để đặt lại mật khẩu.
          </p>
          <button
            type='button'
            onClick={handleClose}
            className='bg-rose-500 hover:bg-rose-600 cursor-pointer rounded-full text-white font-light px-8 py-2 mt-4'
          >
            Đóng
          </button>
        </div>
      )}

      {!sent && (
        <div className='w-full flex justify-between text-sm mt-2'>
          <button
            type='button'
            onClick={handleClose}
            className='text-gray-500 hover:text-rose-600 cursor-pointer'
          >
            Quay lại
          </button>
        </div>
      )}

    </div>
  )
}

export default ForgotPasswordModal
