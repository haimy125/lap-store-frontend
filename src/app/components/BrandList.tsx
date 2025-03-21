"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Brand {
  brandId: number;
  brandName: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const BrandList = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/brands/all`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Brand[] = await response.json();
        setBrands(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return <div>Đang tải danh sách thương hiệu...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="relative pt-2 snap-x snap-mandatory">
      <div className="overflow-x-auto hide-scrollbar snap-mandatory snap-x">
        <div className="flex flex-row space-x-4 items-center lg:justify-center">
          {" "}
          {brands.map((brand) => (
            <Link
              key={brand.brandId}
              href={`/brands/${brand.brandId}?brandName=${encodeURIComponent(
                brand.brandName
              )}`}
              className="px-4 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors duration-200 whitespace-nowrap inline-block shadow-md snap-start"
            >
              {brand.brandName}
            </Link>
          ))}
        </div>
      </div>
      <div
        className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-gray-900 to-transparent"
        style={{ pointerEvents: "none" }}
      ></div>
      <div
        className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-gray-900 to-transparent"
        style={{ pointerEvents: "none" }}
      ></div>
    </div>
  );
};

export default BrandList;
