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
  const [userId, setUserId] = useState('')
  const [selectedItems, setSelectedItems] = useState({})

  const addToCart = async (itemId, size, color) => {
    let cartData = structuredClone(cartItems);
    const product = products.find(p => p._id === itemId);

    if (!token) {
      toast.error('Vui lòng đăng nhập !')
      navigate('/login')
      return;
    }

    if (!size) {
      toast.error('Vui lòng chọn size !')
      return;
    }

    if (!color) {
      toast.error('Vui lòng chọn màu !')
      return;
    }

    if (!product) {
      toast.error('Không tìm thấy sản phẩm !')
      return;
    }

    const sizeColorKey = `${size}-${color}`;
    const sizeColorQuantity = product.sizeColorQuantity?.[sizeColorKey] || 0;
    if (sizeColorQuantity === 0) {
      toast.error(`Size ${size} - Màu ${color} hết hàng!`)
      return;
    }

    const currentQuantity = cartData[itemId]?.[sizeColorKey] || 0;
    if (currentQuantity >= sizeColorQuantity) {
      toast.error(`Size ${size} - Màu ${color} chỉ còn ${sizeColorQuantity} chiếc. Vui lòng giảm số lượng!`)
      return;
    }

    if (token) {
      try {
        const response = await axios.post(backendUrl + '/api/cart/add', { itemId, size, color }, { headers: { token } });
        if (response.data.success) {
          if (cartData[itemId]) {
            if (cartData[itemId][sizeColorKey]) {
              cartData[itemId][sizeColorKey] += 1;
            }
            else {
              cartData[itemId][sizeColorKey] = 1;
            }
          }
          else {
            cartData[itemId] = {};
            cartData[itemId][sizeColorKey] = 1;
          }
          setCartItems(cartData);
          toast.success(response.data.message)
        } else {
          toast.error(response.data.message)
        }
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

  const updateQuantity = async (itemId, size, color, quantity) => {
    let cartData = structuredClone(cartItems);
    const product = products.find(p => p._id === itemId);

    if (!product) {
      toast.error('Không tìm thấy sản phẩm !')
      return;
    }

    const sizeColorKey = `${size}-${color}`;
    const sizeColorQuantity = product.sizeColorQuantity?.[sizeColorKey] || 0;
    if (quantity > sizeColorQuantity) {
      toast.error(`Size ${size} - Màu ${color} chỉ còn ${sizeColorQuantity} chiếc. Vui lòng giảm số lượng!`)
      cartData[itemId][sizeColorKey] = sizeColorQuantity;
      setCartItems(cartData);
      return;
    }

    cartData[itemId][sizeColorKey] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/update', { itemId, size, color, quantity }, { headers: { token } });
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
          console.log(e)
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
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi kết nối');
    }
  }

  const toggleSelectItem = (itemId, size, color) => {
    const key = `${itemId}-${size}-${color}`;
    setSelectedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  const selectAllItems = () => {
    const newSelected = {};
    for (const itemId in cartItems) {
      for (const sizeColor in cartItems[itemId]) {
        if (cartItems[itemId][sizeColor] > 0) {
          const [size, color] = sizeColor.split('-');
          newSelected[`${itemId}-${size}-${color}`] = true;
        }
      }
    }
    setSelectedItems(newSelected);
  }

  const deselectAllItems = () => {
    setSelectedItems({});
  }

  const deleteSelectedItems = async () => {
    for (const key in selectedItems) {
      if (selectedItems[key]) {
        const lastDashIndex = key.lastIndexOf('-');
        const color = key.substring(lastDashIndex + 1);
        const secondLastDashIndex = key.lastIndexOf('-', lastDashIndex - 1);
        const size = key.substring(secondLastDashIndex + 1, lastDashIndex);
        const itemId = key.substring(0, secondLastDashIndex);
        await updateQuantity(itemId, size, color, 0);
      }
    }
    setSelectedItems({});
  }

  const getSelectedCount = () => {
    return Object.values(selectedItems).filter(Boolean).length;
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
      try {
        // Decode JWT token để lấy userId
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        setUserId(decoded.id);
      } catch (error) {
        console.log('Error decoding token:', error);
      }
    }
  }, [token])

  const value = {
    products, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, setCartItems, addToCart, getCartCount,
    updateQuantity, getCartAmount, formatPrice,
    navigate, backendUrl, token, setToken, userId,
    selectedItems, toggleSelectItem, selectAllItems, deselectAllItems, deleteSelectedItems, getSelectedCount
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider;
