// src/app/components/Header.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getServerCookie } from "./GetServerCookie";
import { deleteServerCookie } from "./deleteServerCookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Product } from "@/types/product";

interface HeaderProps {
  onSearchResults: (results: Product[]) => void;
}

// Khai báo một interface cho JWT payload của bạn
interface MyJwtPayload extends JwtPayload {
  role: string[]; // Thay đổi 'string' nếu kiểu dữ liệu của role khác
  // Thêm các claims khác nếu cần
}

const priceRanges = [
  { label: "Dưới 5 triệu", min: 0, max: 5000000 },
  { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
  { label: "10 - 15 triệu", min: 10000000, max: 15000000 },
  { label: "15 - 20 triệu", min: 15000000, max: 20000000 },
  { label: "20 - 25 triệu", min: 20000000, max: 25000000 },
  { label: "25 - 30 triệu", min: 25000000, max: 30000000 },
  { label: "30 - 35 triệu", min: 30000000, max: 35000000 },
  { label: "35 - 40 triệu", min: 35000000, max: 40000000 },
  { label: "40 - 45 triệu", min: 40000000, max: 45000000 },
  { label: "45 - 50 triệu", min: 45000000, max: 50000000 },
  { label: "Trên 50 triệu", min: 50000000, max: 1000000000 },
];

export default function Header({ onSearchResults }: HeaderProps) {
  // State variables

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  // Check if the current page is the product detail page
  const isProductDetailPage = pathname?.startsWith("/products/");

  useEffect(() => {
    async function fetchToken() {
      try {
        const serverToken = await getServerCookie("jwtToken");
        if (!serverToken) {
          console.log("Token không tồn tại");
          return;
        }

        // Ép kiểu decodedToken về MyJwtPayload
        const decodedToken = jwtDecode<MyJwtPayload>(serverToken);
        const roles = decodedToken.role;

        setIsLoggedIn(!!serverToken);
        setIsAdmin(roles[0] === "ROLE_ADMIN");
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }

    fetchToken();
  }, []);

  const handleLogout = async () => {
    await deleteServerCookie("jwtToken");
    await deleteServerCookie("refreshToken");
    setIsLoggedIn(false);
    router.replace("/login");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPriceRange(e.target.value);
    const range = priceRanges.find((r) => r.label === e.target.value);
    if (range) {
      fetchProductsByPriceRange(range.min, range.max);
    } else {
      onSearchResults([]);
    }
  };

  const handleCustomPriceSearch = () => {
    const minPrice = parseFloat(minPriceInput);
    const maxPrice = parseFloat(maxPriceInput);

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      fetchProductsByPriceRange(minPrice, maxPrice);
    } else {
      alert("Vui lòng nhập khoảng giá hợp lệ.");
    }
  };

  const fetchProductsByPriceRange = async (
    minPrice: number,
    maxPrice: number
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      onSearchResults(data);
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm theo giá:", error);
      onSearchResults([]);
    }
  };

  if (isLoggedIn === null) {
    return null;
  }
  return (
    <header className="fixed top-0 left-0 w-full bg-[rgba(0,0,0,0.4)] text-white shadow-xl z-50 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-yellow-500">
              MPH - Laptop
            </span>
            <span className="text-xs sm:text-sm font-semibold text-yellow-300">
              Chính hãng
            </span>
          </Link>
        </div>

        {/* Navigation Section (Desktop) */}
        <nav className="hidden sm:block custom-md:block">
          <ul className="flex items-center space-x-4 sm:space-x-8">
            {!isProductDetailPage && (
              <div className="hidden md:flex items-center space-x-4">
                <li>
                  <select
                    value={selectedPriceRange}
                    onChange={handlePriceRangeChange}
                    className="form-select cursor-pointer bg-black text-white rounded border-yellow-500 font-bold text-sm"
                    style={{ borderColor: "yellow" }}
                  >
                    <option value="">Chọn khoảng giá</option>
                    {priceRanges.map((range) => (
                      <option key={range.label} value={range.label}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </li>
                <li className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Giá tối thiểu"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="form-input text-white bg-black rounded border-yellow-500 font-bold text-sm"
                    style={{ borderColor: "yellow" }}
                  />
                  <input
                    type="number"
                    placeholder="Giá tối đa"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="form-input text-white bg-black rounded border-yellow-500 font-bold text-sm"
                    style={{ borderColor: "yellow" }}
                  />
                  <button
                    onClick={handleCustomPriceSearch}
                    className="btn-primary cursor-pointer relative group font-bold text-sm"
                  >
                    Tìm kiếm
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </li>
              </div>
            )}

            {/* Authentication Links */}
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <li>
                    <Link
                      href="/dashboard"
                      className="nav-link relative group text-white font-bold text-sm"
                    >
                      Dashboard
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/profile"
                    className="nav-link relative group text-white font-bold text-sm"
                  >
                    Profile
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary cursor-pointer relative group font-bold text-sm"
                  >
                    Logout
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="btn-primary cursor-pointer relative group font-bold text-sm"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden">
          <button
            className="text-white focus:outline-none cursor-pointer"
            onClick={toggleMobileMenu}
          >
            {/* Đổi màu icon menu */}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-black shadow-md rounded-md overflow-hidden">
              <ul className="py-2">
                <li>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-white hover:bg-gray-800 cursor-pointer font-bold relative group"
                    onClick={toggleMobileMenu}
                  >
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                {!isProductDetailPage && (
                  <>
                    {/* Mobile Price Search - Always Visible in Mobile Menu */}
                    <li>
                      <select
                        value={selectedPriceRange}
                        onChange={handlePriceRangeChange}
                        className="block px-4 py-2 text-white hover:bg-gray-800 w-full text-left bg-black cursor-pointer font-bold"
                        style={{ borderColor: "yellow" }}
                      >
                        <option value="">Chọn khoảng giá</option>
                        {priceRanges.map((range) => (
                          <option key={range.label} value={range.label}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                    </li>
                    <li>
                      <div className="flex flex-col">
                        <input
                          type="number"
                          placeholder="Giá tối thiểu"
                          value={minPriceInput}
                          onChange={(e) => setMinPriceInput(e.target.value)}
                          className="block px-4 py-2 text-white hover:bg-gray-800 w-full text-left bg-black border-yellow-500 font-bold"
                          style={{ borderColor: "yellow" }}
                        />
                        <input
                          type="number"
                          placeholder="Giá tối đa"
                          value={maxPriceInput}
                          onChange={(e) => setMaxPriceInput(e.target.value)}
                          className="block px-4 py-2 text-white hover:bg-gray-800 w-full text-left bg-black border-yellow-500 font-bold"
                          style={{ borderColor: "yellow" }}
                        />
                        <button
                          onClick={handleCustomPriceSearch}
                          className="cursor-pointer block px-4 py-2 text-black hover:bg-yellow-600 w-full text-left bg-yellow-500 transition-colors duration-200 font-bold relative group"
                        >
                          {/* Mobile custom search button with hover effect */}
                          Tìm kiếm
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                        </button>
                      </div>
                    </li>
                  </>
                )}
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <li>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-white hover:bg-gray-800 cursor-pointer font-bold relative group"
                          onClick={toggleMobileMenu}
                        >
                          Dashboard
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-white hover:bg-gray-800 cursor-pointer font-bold relative group"
                        onClick={toggleMobileMenu}
                      >
                        Profile
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMobileMenu();
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-200 relative group"
                      >
                        Logout
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      href="/login"
                      className="bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded shadow-md transition-colors duration-200 inline-block relative group"
                      onClick={toggleMobileMenu}
                    >
                      Login
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
