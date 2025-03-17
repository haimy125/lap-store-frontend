// components/BrandList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Brand {
  brandId: number;
  brandName: string;
}

const BrandList = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8080/api/brands/all");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Brand[] = await response.json();
        setBrands(data);
      } catch (e: any) {
        setError(e.message);
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
    <div className="flex flex-row space-x-4 pt-2">
      {" "}
      {/* Sử dụng flex để hiển thị ngang */}
      {brands.map((brand) => (
        <Link
          key={brand.brandId}
          href={`/brands/${brand.brandId}?brandName=${encodeURIComponent(brand.brandName)}`} // Sử dụng dynamic route
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
        >
          {brand.brandName}
        </Link>
      ))}
    </div>
  );
};

export default BrandList;
