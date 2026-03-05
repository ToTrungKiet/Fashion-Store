import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
const Profile = () => {
  const { token } = useContext(ShopContext);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // LOAD PROFILE KHI MỞ TRANG
  const loadProfile = async () => {
    try {

      if (token) {

      const res = await axios.post(
        "http://localhost:4000/api/user/profile",
        { headers:{token} }
      );

      if (res.data.success) {

        const user = res.data.user;

        setForm({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          address: user.address || "",
          ward: user.ward || "",
          district: user.district || "",
          city: user.city || "",
          phone: user.phone || ""
        });

      }
    }

    } catch (error) {

      console.log(error);

    }
  };

  // chạy khi mở trang
  useEffect(() => {
    loadProfile();
  }, []);

  // LƯU PROFILE
  const saveProfile = async () => {

    try {

      if(token) {

      const res = await axios.post(
        "http://localhost:4000/api/user/update-profile",
        {
          
          ...form
        },
        { headers:{token} }
      );

      if (res.data.success) {

        toast.success("Lưu thông tin thành công!");

        // load lại dữ liệu mới
        loadProfile();

      } else {

        toast.error(res.data.message);

      }
    }

    } catch (error) {

      console.log(error);
      toast.error("Có lỗi xảy ra");

    }

  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h2 className="text-2xl font-semibold mb-6">
        Thông tin cá nhân
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Họ"
          className="border p-3 rounded"
        />

        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Tên"
          className="border p-3 rounded"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-3 rounded col-span-2"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Số nhà, tên đường"
          className="border p-3 rounded col-span-2"
        />

        <input
          name="ward"
          value={form.ward}
          onChange={handleChange}
          placeholder="Phường/Xã"
          className="border p-3 rounded"
        />

        <input
          name="district"
          value={form.district}
          onChange={handleChange}
          placeholder="Quận/Huyện"
          className="border p-3 rounded"
        />

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="Tỉnh/Thành phố"
          className="border p-3 rounded col-span-2"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Số điện thoại"
          className="border p-3 rounded col-span-2"
        />

      </div>

      <button
        onClick={saveProfile}
        className="mt-6 bg-black text-white px-6 py-2 rounded"
      >
        Lưu thông tin
      </button>

    </div>
  );
};

export default Profile;