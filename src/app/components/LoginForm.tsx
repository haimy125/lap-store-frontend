"use client";

import Link from "next/link"; // Import Link
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getServerCookie } from "./GetServerCookie";
import { setServerCookie } from "./setServerCookie";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkLoginStatus() {
      const token = await getServerCookie("jwtToken"); // Lấy token từ server
      if (token) {
        setIsLoggedIn(true);
        router.push("/"); // Nếu đã đăng nhập, chuyển hướng về trang chủ
      }
    }
    checkLoginStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/authenticate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
      }

      const data = await response.json();

      document.cookie = `jwtToken=${data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`;
      document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${
        30 * 24 * 60 * 60
      }`;

      await setServerCookie("jwtToken", data.token, 7);
      await setServerCookie("refreshToken", data.token, 30);

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {/* Background được đổi thành xám đen */}
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-transform transform">
        {/* Background chính được đổi thành xám đậm */}
        <div className="px-10 py-12">
          <h2 className="text-3xl font-semibold text-yellow-300 text-center mb-6">
            {/* Màu chữ được đổi thành vàng */}
            Đăng nhập
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="bg-red-700 border border-red-900 text-white px-4 py-3 rounded relative"
                role="alert"
              >
                {/* Background và chữ được đổi */}
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-yellow-300"
              >
                {/* Màu chữ được đổi thành vàng */}
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
                {/* Màu background, border và chữ được đổi */}
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-yellow-300"
              >
                {/* Màu chữ được đổi thành vàng */}
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md transition duration-300 hover:shadow-md bg-gray-900 text-white"
                />
                {/* Màu background, border và chữ được đổi */}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="cursor-pointer group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-300 hover:scale-105"
              >
                {/* Chữ và màu nền được đổi */}
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {/* Heroicon name: solid/lock-closed */}
                  <svg
                    className="h-5 w-5 text-yellow-300 group-hover:text-yellow-200 transition duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    {/* Màu icon được đổi */}
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Đăng nhập
              </button>
            </div>
          </form>

          <div className="mt-2 text-center">
            <Link
              href="/register"
              className="text-sm text-yellow-300 hover:text-yellow-100"
            >
              {/* Màu chữ và hover được đổi */}
              Bạn chưa có tài khoản? Đăng ký ngay!
            </Link>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
                {/* Màu border được đổi */}
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  {/* Background và chữ được đổi */}
                  Hoặc đăng nhập bằng
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGoogleLogin}
                className="cursor-pointer relative inline-flex items-center px-4 py-3 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-300 hover:scale-105"
              >
                {/* Background, border và chữ được đổi */}
                <span className="sr-only">Đăng nhập với Google</span>
                <FcGoogle className="h-5 w-5" />{" "}
                {/* Sử dụng icon Google từ react-icons */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
