import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import AddressSelector from "../components/AddressSelector";

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);
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

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Xử lý khi thay đổi địa chỉ từ AddressSelector
  const handleAddressChange = (addressData) => {
    setForm({
      ...form,
      city: addressData.city,
      district: addressData.district,
      ward: addressData.ward
    });
  };

  // LOAD PROFILE KHI MỞ TRANG
  const loadProfile = async () => {
    try {
      if (token) {
        const res = await axios.post(
          backendUrl + "/api/user/profile",
          {},
          { headers: { token } }
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
      toast.error("Lỗi khi tải hồ sơ");
    }
  };

  useEffect(() => {
    loadProfile();
  }, [token]);

  // LƯU PROFILE
  const saveProfile = async () => {
    try {
      if (token) {
        const res = await axios.post(
          backendUrl + "/api/user/update-profile",
          { ...form },
          { headers: { token } }
        );

        if (res.data.success) {
          toast.success("Lưu thông tin thành công!");
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

  // THAY ĐỔI MẬT KHẨU
  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp!");
        setLoading(false);
        return;
      }

      const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!strongPassword.test(passwordForm.newPassword)) {
        toast.error("Mật khẩu ít nhất 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt!");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        backendUrl + "/api/user/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setShowPasswordForm(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi thay đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Thông tin cá nhân</h2>

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

        {/* Address Selector - Dropdown cascade */}
        <AddressSelector
          value={{ city: form.city, district: form.district, ward: form.ward }}
          onChange={handleAddressChange}
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
        className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Lưu thông tin
      </button>

      {/* PHẦN THAY ĐỔI MẬT KHẨU */}
      <div className="mt-10 pt-6 border-t">
        <h3 className="text-xl font-semibold mb-4">Thay đổi mật khẩu</h3>

        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded"
          >
            Thay đổi mật khẩu
          </button>
        ) : (
          <form onSubmit={changePassword} className="grid grid-cols-1 gap-4">
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Mật khẩu hiện tại"
              className="border p-3 rounded"
              required
            />

            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="Mật khẩu mới"
              className="border p-3 rounded"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Xác nhận mật khẩu"
              className="border p-3 rounded"
              required
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                  });
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
