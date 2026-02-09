import { useEffect, useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(location.pathname.includes('collection') && showSearch);
  }, [location, showSearch]);

  return visible ? (
    <div className='border-t border-b bg-gray-50 text-center'>
      <div className='inline-flex items-center justify-center
                  border border-gray-400
                  px-5 py-2 my-5 mx-3
                  rounded-full
                  w-3/4 sm:w-1/2
                  transition
                  focus-within:border-red-400
                  focus-within:shadow-[0_0_0_2px_rgba(248,113,113,0.5)]'>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 bg-inherit text-sm outline-none'
          type='text'
          placeholder='Tìm kiếm'
        />

        <img className='w-4' src={assets.search_icon} alt='' />
      </div>

      <img
        onClick={() => setShowSearch(false)}
        className='inline w-3 cursor-pointer hover:scale-110 transition'
        src={assets.cross_icon}
        alt=''
      />
    </div>
  ) : null
}

export default SearchBar
