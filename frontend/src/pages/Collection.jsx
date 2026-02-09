import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [ filterProducts, setFilterProducts ] = useState([]);
  const [ category, setCategory ] = useState([]);
  const [ subcategory, setSubCategory ] = useState([]);
  const [ sortType, setSortType ] = useState('relavent');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  }

  const toggleSubCategory = (e) => {
    if (subcategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    if (subcategory.length > 0) {
      productsCopy = productsCopy.filter(item => subcategory.includes(item.subCategory));
    }
    setFilterProducts(productsCopy);
  }

  const sortProduct = (e) => {
    let productsCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(productsCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(productsCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
      }
  }


  useEffect(() => {
    applyFilter();
  }, [category, subcategory, search, showSearch]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);


  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* BỘ LỌC */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>BỘ LỌC
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt='' />
        </p>
        {/* LỌC THEO DANH MỤC */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>DANH MỤC</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3 accent-rose-600' type='checkbox' value={'Men'} onChange={toggleCategory}/> Nam
            </p>
            <p className='flex gap-2'>
              <input className='w-3 accent-rose-600' type='checkbox' value={'Women'} onChange={toggleCategory}/> Nữ
            </p>
            <p className='flex gap-2'>
              <input className='w-3 accent-rose-600' type='checkbox' value={'Kids'} onChange={toggleCategory}/> Trẻ em
            </p>
          </div>
        </div>
        {/* LỌC THEO DANH MỤC PHỤ */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>LOẠI SẢN PHẨM</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Topwear'} onChange={toggleSubCategory}/> Áo 
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Bottomwear'} onChange={toggleSubCategory}/> Quần 
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Winterwear'} onChange={toggleSubCategory}/> Áo khoác
            </p>
          </div>
        </div>
      </div>

      {/* KHU VỰC SẢN PHẨM */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1='TẤT CẢ' text2='SẢN PHẨM'/>
          {/* SẮP XẾP SẢN PHẨM */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value='relavent'>Sắp xếp theo độ liên quan</option>
            <option value='low-high'>Giá: Thấp đến cao</option>
            <option value='high-low'>Giá: Cao đến thấp</option>
          </select>
        </div>

        {/* HIỂN THỊ SẢN PHẨM */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item, index) => (
              <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Collection
