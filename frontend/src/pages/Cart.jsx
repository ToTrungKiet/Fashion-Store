import { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, formatPrice, navigate, selectedItems, toggleSelectItem, selectAllItems, deselectAllItems, deleteSelectedItems, getSelectedCount } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const [size, color] = item.split('-');
            tempData.push({
              _id: items,
              size: size,
              color: color,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  const totalAmount = cartData.reduce((total, item) => {
    const product = products.find(p => p._id === item._id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const selectedAmount = cartData.reduce((total, item) => {
    const key = `${item._id}-${item.size}-${item.color}`;
    if (selectedItems[key]) {
      const product = products.find(p => p._id === item._id);
      return total + (product ? product.price * item.quantity : 0);
    }
    return total;
  }, 0);

  const isAllSelected = cartData.length > 0 && cartData.every(item => selectedItems[`${item._id}-${item.size}-${item.color}`]);

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'KIỂM TRA'} text2={'ĐƠN HÀNG'} />
      </div>

      {cartData.length > 0 && (
        <div className='mb-6 flex items-center gap-4 p-4 bg-gray-100 rounded'>
          <input 
            type='checkbox' 
            checked={isAllSelected}
            onChange={() => isAllSelected ? deselectAllItems() : selectAllItems()}
            className='w-5 h-5 cursor-pointer'
          />
          <span className='font-medium'>Chọn tất cả ({getSelectedCount()}/{cartData.length})</span>
          {getSelectedCount() > 0 && (
            <button 
              onClick={deleteSelectedItems}
              className='ml-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
            >
              Xóa đã chọn ({getSelectedCount()})
            </button>
          )}
        </div>
      )}

      <div>
        {
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            const sizeColorKey = `${item.size}-${item.color}`;
            const sizeColorQuantity = productData?.sizeColorQuantity?.[sizeColorKey] || 0;
            const key = `${item._id}-${item.size}-${item.color}`;
            const isSelected = selectedItems[key] || false;
            return (
              <div key={index} className={`py-4 border-t border-b text-gray-700 grid grid-cols-[0.5fr_4fr_0.5fr_0.5fr] sm:grid-cols-[0.5fr_4fr_2fr_0.5fr] items-center gap-4 ${isSelected ? 'bg-blue-50' : ''}`}>
                <input 
                  type='checkbox'
                  checked={isSelected}
                  onChange={() => toggleSelectItem(item._id, item.size, item.color)}
                  className='w-5 h-5 cursor-pointer'
                />
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt='' />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{formatPrice(productData.price)} {currency}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.color}</p>
                    </div>
                    <p className={`text-xs mt-2 ${sizeColorQuantity < 5 && sizeColorQuantity > 0 ? 'text-red-600 font-medium' : sizeColorQuantity === 0 ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                      Tồn kho size {item.size} - {item.color}: {sizeColorQuantity} sản phẩm
                    </p>
                  </div>
                </div>
                <input 
                  onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, item.color, Number(e.target.value))} 
                  className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' 
                  type='number' 
                  min={1} 
                  max={sizeColorQuantity}
                  value={item.quantity} 
                />
                <img onClick={() => updateQuantity(item._id, item.size, item.color, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt='' />
              </div>
            )
          })
        }
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal amount={selectedAmount} />
          <div className='w-full text-end'>
            <button onClick={() => {
              if (selectedAmount === 0) return;
              navigate('/place-order')}} 
              disabled={selectedAmount === 0}
              className='bg-rose-500 hover:bg-rose-600 text-white rounded-full my-8 px-8 py-3 text-sm active:bg-rose-700 cursor-pointer disabled:bg-gray-400'>
              TIẾN HÀNH THANH TOÁN ({getSelectedCount()})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
