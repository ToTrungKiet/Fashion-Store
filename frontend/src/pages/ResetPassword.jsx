import { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { backendUrl } = useContext(ShopContext)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error('Token không hợp lệ')
      navigate('/login')
    }
  }, [token, navigate])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Decode token từ URL
      const decodedToken = decodeURIComponent(token);
      
      // Kiểm tra mật khẩu nhập
      if (!newPassword || !confirmPassword) {
        toast.error('Vui lòng nhập đầy đủ thông tin')
        setLoading(false)
        return
      }

      if (newPassword !== confirmPassword) {
        toast.error('Mật khẩu xác nhận không khớp')
        setLoading(false)
        return
      }

      // Kiểm tra mật khẩu mạnh
      const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
      if (!strongPassword.test(newPassword)) {
        toast.error('Mật khẩu ít nhất 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt')
        setLoading(false)
        return
      }

      const response = await axios.post(
        backendUrl + '/api/user/reset-password',
        { token: decodedToken, newPassword, confirmPassword },
        {
          timeout: 10000
        }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        setTimeout(() => navigate('/login'), 2000)
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.log(error)
      if (error.code === 'ECONNABORTED') {
        toast.error('Kết nối timeout, vui lòng thử lại')
      } else if (error.response) {
        toast.error(error.response.data?.message || 'Lỗi từ server')
      } else if (error.request) {
        toast.error('Lỗi kết nối server. Vui lòng kiểm tra kết nối internet')
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleResetPassword}
      className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
    >
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Đặt lại mật khẩu</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      <input
        onChange={(e) => setNewPassword(e.target.value)}
        value={newPassword}
        type='password'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Mật khẩu mới'
        required
      />

      <input
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        type='password'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Xác nhận mật khẩu'
        required
      />

      <button
        disabled={loading}
        className='bg-rose-500 hover:bg-rose-600 cursor-pointer rounded-full text-white font-light px-8 py-2 mt-4 disabled:opacity-50'
      >
        {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
      </button>
    </form>
  )
}

export default ResetPassword
