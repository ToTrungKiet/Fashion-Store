import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const navigate = useNavigate();
  const currency = 'VND';
  const delivery_fee = 30000;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({})
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('')

  const addToCart = async (itemId, size) => {
    let cartData = structuredClone(cartItems);
    if (!size) {
      toast.error('Vui lòng chọn size !')
      return;
    }
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      }
      else {
        cartData[itemId][size] = 1;
      }
    }
    else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers: {token}});
      } catch (error) {
        console.log(error);
        toast.error('Lỗi kết nối');
      }
    }
  }

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
          toast.error('Lỗi kết nối');
        }
      }
    }
    return totalCount;
  }

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    
    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers: {token}});
      } catch (error) {
        console.log(error);
        toast.error('Lỗi kết nối');
      }
    }
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (e) {

        }
      }
    }
    return totalAmount;
  }

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  }

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi kết nối');
    }
  }

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}});
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi kết nối');
    }
  }
  
  useEffect(() => {
    getProductsData();
  }, [])

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  }, [])

  useEffect(() => {
    if (token) {
      getUserCart(token);
    }
  }, [token])

  const value = {
    products, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, setCartItems, addToCart, getCartCount,
    updateQuantity, getCartAmount, formatPrice,
    navigate, backendUrl, token, setToken
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider;
