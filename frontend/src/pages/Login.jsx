import { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Đăng nhập');
  const {token, setToken, navigate, backendUrl} = useContext(ShopContext);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentState === 'Đăng ký') {
        const response = await axios.post(backendUrl + '/api/user/register', {name, email, password})
        if (response.data.success) {
          toast.success(response.data.message);
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          setName('');
          setEmail('');
          setPassword('');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', {email, password})
        if (response.data.success) {
          toast.success(response.data.message);
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi kết nối');
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState === 'Đăng nhập' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type='text' className='w-full px-3 py-2 border border-gray-800' placeholder='Họ tên' required />}
      <input onChange={(e) => setEmail(e.target.value)} value={email} type='email' className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
      <input onChange={(e) => setPassword(e.target.value)} value={password} type='password' className='w-full px-3 py-2 border border-gray-800' placeholder='Mật khẩu' required />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='hover:text-rose-600 active:text-rose-700 cursor-pointer'>Quên mật khẩu ?</p>
        {
          currentState === 'Đăng nhập' ? 
          <p onClick={() => setCurrentState('Đăng ký')} className='hover:text-rose-600 active:text-rose-700 cursor-pointer'>Tạo tài khoản</p> : 
          <p onClick={() => setCurrentState('Đăng nhập')} className='hover:text-rose-600 active:text-rose-700 cursor-pointer'>Đăng nhập ở đây</p>
        }
      </div>
      <button className='bg-rose-500 hover:bg-rose-600 active:bg-rose-700 cursor-pointer rounded-full text-white font-light px-8 py-2 mt-4'>
        {currentState === 'Đăng nhập' ? 'Đăng nhập' : 'Đăng ký'}
      </button>
    </form>
  )
}

export default Login
