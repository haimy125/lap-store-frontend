"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            email,
            firstName,
            lastName,
            phoneNumber,
            address,
            roleId: 2,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đăng ký không thành công");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {/* Chỉnh background thành xám đen */}
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-transform transform">
        {/* Chỉnh background của form thành xám đậm */}
        <div className="px-10 py-12">
          <h2 className="text-3xl font-semibold text-yellow-300 text-center mb-6">
            {/* Chỉnh màu chữ của tiêu đề thành vàng */}
            Đăng ký
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="bg-red-700 border border-red-900 text-white px-4 py-3 rounded relative"
                role="alert"
              >
                {/* Chỉnh màu background và chữ của thông báo lỗi */}
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-yellow-300"
              >
                {/* Chỉnh màu chữ của label thành vàng */}
                Tên đăng nhập
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-4 py-3 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md transition duration-300 hover:shadow-md bg-gray-900 text-white"
                />
                {/* Chỉnh màu background, border, focus và chữ của input */}
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-yellow-300"
              >
                {/* Chỉnh màu chữ của label thành vàng */}
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md transition duration-300 hover:shadow-md bg-gray-900 text-white"
                />
                {/* Chỉnh màu background, border, focus và chữ của input */}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-yellow-300"
              >
                {/* Chỉnh màu chữ của label thành vàng */}
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md transition duration-300 hover:shadow-md bg-gray-900 text-white"
                />
                {/* Chỉnh màu background, border, focus và chữ của input */}
              </div>
            </div>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-yellow-300"
              >
                {/* Chỉnh màu chữ của label thành vàng */}
                Tên
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="px-4 py-3 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md transition duration-300 hover:shadow-md bg-gray-900 text-white"
                />
                {/* Chỉnh màu background, border, focus và chữ của input */}
              </div>
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-yellow-300"
              >
                {/* Chỉnh màu chữ của label thành vàng */}
                Họ
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="px-4 py-3 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md transition duration-300 hover:shadow-md bg-gray-900 text-white"
                />
                {/* Chỉnh màu background, border, focus và chữ của input */}
              </div>
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-yellow-300"
              >
                {/* Chỉnh màu chữ của label thành vàng */}
                Số điện thoại
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="px-4 py-3 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md transition duration-300 hover:shadow-md bg-gray-900 text-white"
                />
                {/* Chỉnh màu background, border, focus và chữ của input */}
              </div>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-yellow-300"
              >
                {/* Chỉnh màu chữ của label thành vàng */}
                Địa chỉ
              </label>
              <div className="mt-1">
                <input
                  id="address"
                  type="text"
                  autoComplete="street-address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="px-4 py-3 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md transition duration-300 hover:shadow-md bg-gray-900 text-white"
                />
                {/* Chỉnh màu background, border, focus và chữ của input */}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="cursor-pointer group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-300 hover:scale-105"
              >
                {/* Chỉnh màu chữ và background của nút đăng ký */}
                Đăng ký
              </button>
            </div>
          </form>
          <div className="mt-2 text-center">
            <Link
              href="/login"
              className="text-sm text-yellow-300 hover:text-yellow-100"
            >
              {/* Chỉnh màu chữ và hover của link đăng nhập */}
              Đã có tài khoản? Đăng nhập ngay!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
