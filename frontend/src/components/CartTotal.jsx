import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

  const { currency, delivery_fee, getCartAmount, formatPrice } = useContext(ShopContext);

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'TỔNG'} text2={'ĐƠN HÀNG'} />
      </div>
      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
            <p>TỔNG TIỀN HÀNG</p>
            <p>{formatPrice(getCartAmount())} {currency}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <p>PHÍ VẬN CHUYỂN</p>
            <p>{formatPrice(delivery_fee)} {currency}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <b>TỔNG</b>
            <b>{getCartAmount() === 0 ? 0 : formatPrice(getCartAmount() + delivery_fee)} {currency}</b>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
