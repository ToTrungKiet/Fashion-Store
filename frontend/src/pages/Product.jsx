import { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart, formatPrice } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  return productData ? (
    <div>
      <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
        {/* Dữ liệu sản phẩm */}
        <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
          {/* Ảnh sản phẩm */}
          <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
            <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item, index) => (
                  <img onClick={() => setImage(item)} src={item} alt='' key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' />
                ))
              }
            </div>
            <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto' src={image} alt='' />
            </div>
          </div>
          {/* Thông tin sản phẩm */}
          <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <div className='flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt='' className="w-3 5" />
              <img src={assets.star_icon} alt='' className="w-3 5" />
              <img src={assets.star_icon} alt='' className="w-3 5" />
              <img src={assets.star_icon} alt='' className="w-3 5" />
              <img src={assets.star_dull_icon} alt='' className="w-3 5" />
              <p className='pl-2'>(122)</p>
            </div>
            <p className='mt-5 text-3xl font-medium'>{formatPrice(productData.price)} {currency}</p>
            <div className='mt-5 flex items-center gap-4'>
              {(() => {
                const sizeColorKey = size && color ? `${size}-${color}` : '';
                const sizeColorQty = sizeColorKey && productData.sizeColorQuantity ? 
                  (productData.sizeColorQuantity[sizeColorKey] || 0) : 0;
                
                const totalQty = productData.sizeColorQuantity ? 
                  Object.values(productData.sizeColorQuantity).reduce((sum, qty) => sum + qty, 0) : 0;
                
                return (
                  <>
                    {totalQty > 0 ? (
                      <p className='text-green-600 font-medium'>
                        {!size || !color ? (
                          <>Tổng cộng: <span className='font-bold'>{totalQty}</span> sản phẩm</>
                        ) : (
                          <>Size {size} - {color}: <span className='font-bold'>{sizeColorQty}</span> sản phẩm</>
                        )}
                      </p>
                    ) : (
                      <p className='text-red-600 font-bold'>Sản phẩm hết hàng</p>
                    )}
                  </>
                );
              })()}
            </div>
            <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
            <div className='flex flex-col gap-4 my-8'>
              <div>
                <p>Chọn màu sắc</p>
                <div className='flex gap-3 mt-3'>
                  {productData.colors?.map((item, index) => (
                    <button 
                      key={index} 
                      onClick={() => setColor(item)} 
                      className={`border py-2 px-4 rounded transition-all ${item === color ? 'border-rose-500 bg-rose-500 text-white' : 'border-gray-300 bg-white text-black hover:border-rose-500'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p>Chọn kích cỡ</p>
                <div className='flex gap-2 mt-3'>
                  {productData.sizes.map((item, index) => (
                    <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-rose-500 text-white bg-rose-400' : ''} cursor-pointer`} key={index}>{item}</button>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={() => addToCart(productData._id, size, color)} 
              disabled={(() => {
                if (!size || !color) return true;
                const sizeColorKey = `${size}-${color}`;
                const qty = productData.sizeColorQuantity?.[sizeColorKey] || 0;
                return qty === 0;
              })()}
              className={`${(() => {
                if (!size || !color) return 'bg-gray-400 cursor-not-allowed';
                const sizeColorKey = `${size}-${color}`;
                const qty = productData.sizeColorQuantity?.[sizeColorKey] || 0;
                return qty === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 cursor-pointer';
              })()} text-white px-8 py-3 text-sm rounded-full`}>
              {(() => {
                if (!size || !color) return 'CHỌN SIZE VÀ MÀU';
                const sizeColorKey = `${size}-${color}`;
                const qty = productData.sizeColorQuantity?.[sizeColorKey] || 0;
                return qty === 0 ? 'SẢN PHẨM HẾT HÀNG' : 'THÊM VÀO GIỎ HÀNG';
              })()}
            </button>
            <hr className='mt-8 sm:w-4/5' />
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% sản phẩm chính hãng.</p>
              <p>Hỗ trợ thanh toán khi nhận hàng (COD).</p>
              <p>Đổi trả dễ dàng trong vòng 7 ngày.</p>
            </div>
          </div>
        </div>
        {/* Mô tả & Phần đánh giá */}
        <div className='mt-20'>
          <div className='flex'>
            <b className='border px-5 py-3 text-sm'>Mô tả</b>
            <p className='border px-5 py-3 text-sm'>Đánh giá (122)</p>
          </div>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>Sản phẩm có chất liệu tốt, đường may chắc chắn và form mặc rất đẹp.
            Màu sắc giống hình, không bị phai sau khi giặt.
            Thời gian giao hàng nhanh, đóng gói cẩn thận.
            Rất đáng tiền và sẽ ủng hộ shop trong những lần mua tiếp theo.
          </p>
          <p>
            Mình mua về mặc rất vừa, vải mềm và không bị nóng.
            Shop tư vấn nhiệt tình, giao hàng nhanh.
            Nói chung là rất hài lòng 👍
          </p>
        </div>
      </div>
      {/* Hiển thị sản phẩm liên quan */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
