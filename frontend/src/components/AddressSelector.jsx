import { useState, useEffect } from 'react'
import axios from 'axios'

const AddressSelector = ({ value, onChange }) => {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')

  // Load danh sách tỉnh/thành phố khi component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get('https://provinces.open-api.vn/api/p/')
        setProvinces(res.data)
      } catch (error) {
        console.log('Error fetching provinces:', error)
      }
    }
    fetchProvinces()
  }, [])

  // Khi có value từ props (load từ database), set giá trị ban đầu
  useEffect(() => {
    if (value.city && provinces.length > 0) {
      const province = provinces.find(p => p.name === value.city)
      if (province) {
        setSelectedProvince(province.code)
      }
    }
  }, [value.city, provinces])

  // Load quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const res = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
          setDistricts(res.data.districts || [])
          
          // Reset quận và phường khi đổi tỉnh
          if (!value.district) {
            setSelectedDistrict('')
            setSelectedWard('')
            setWards([])
          }
        } catch (error) {
          console.log('Error fetching districts:', error)
        }
      }
      fetchDistricts()
    } else {
      setDistricts([])
      setWards([])
    }
  }, [selectedProvince])

  // Khi districts load xong, tìm district từ value
  useEffect(() => {
    if (value.district && districts.length > 0) {
      const district = districts.find(d => d.name === value.district)
      if (district) {
        setSelectedDistrict(district.code)
      }
    }
  }, [value.district, districts])

  // Load phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const res = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
          setWards(res.data.wards || [])
          
          // Reset phường khi đổi quận
          if (!value.ward) {
            setSelectedWard('')
          }
        } catch (error) {
          console.log('Error fetching wards:', error)
        }
      }
      fetchWards()
    } else {
      setWards([])
    }
  }, [selectedDistrict])

  // Khi wards load xong, tìm ward từ value
  useEffect(() => {
    if (value.ward && wards.length > 0) {
      const ward = wards.find(w => w.name === value.ward)
      if (ward) {
        setSelectedWard(ward.code)
      }
    }
  }, [value.ward, wards])

  // Xử lý khi chọn tỉnh/thành phố
  const handleProvinceChange = (e) => {
    const code = e.target.value
    setSelectedProvince(code)
    setSelectedDistrict('')
    setSelectedWard('')
    
    const province = provinces.find(p => p.code === Number(code))
    onChange({
      city: province ? province.name : '',
      district: '',
      ward: ''
    })
  }

  // Xử lý khi chọn quận/huyện
  const handleDistrictChange = (e) => {
    const code = e.target.value
    setSelectedDistrict(code)
    setSelectedWard('')
    
    const district = districts.find(d => d.code === Number(code))
    onChange({
      city: value.city,
      district: district ? district.name : '',
      ward: ''
    })
  }

  // Xử lý khi chọn phường/xã
  const handleWardChange = (e) => {
    const code = e.target.value
    setSelectedWard(code)
    
    const ward = wards.find(w => w.code === Number(code))
    onChange({
      city: value.city,
      district: value.district,
      ward: ward ? ward.name : ''
    })
  }

  return (
    <>
      {/* Tỉnh/Thành phố */}
      <select
        value={selectedProvince}
        onChange={handleProvinceChange}
        className="border p-3 rounded col-span-2 bg-white"
      >
        <option value="">-- Chọn Tỉnh/Thành phố --</option>
        {provinces.map((province) => (
          <option key={province.code} value={province.code}>
            {province.name}
          </option>
        ))}
      </select>

      {/* Quận/Huyện */}
      <select
        value={selectedDistrict}
        onChange={handleDistrictChange}
        className="border p-3 rounded bg-white"
        disabled={!selectedProvince}
      >
        <option value="">-- Chọn Quận/Huyện --</option>
        {districts.map((district) => (
          <option key={district.code} value={district.code}>
            {district.name}
          </option>
        ))}
      </select>

      {/* Phường/Xã */}
      <select
        value={selectedWard}
        onChange={handleWardChange}
        className="border p-3 rounded bg-white"
        disabled={!selectedDistrict}
      >
        <option value="">-- Chọn Phường/Xã --</option>
        {wards.map((ward) => (
          <option key={ward.code} value={ward.code}>
            {ward.name}
          </option>
        ))}
      </select>
    </>
  )
}

export default AddressSelector
