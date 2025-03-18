// app/brands/[brandId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import ProductList from "@/app/components/ProductList";
import { Product } from "@/interfaces";
import { useParams, useSearchParams } from "next/navigation";

interface Props {}

const BrandProductsPage: React.FC<Props> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { brandId } = useParams();
  const searchParams = useSearchParams();

  const brandName = searchParams.get("brandName") || "Unknown Brand";

  useEffect(() => {
    const fetchProductsByBrand = async () => {
      if (!brandId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:8080/api/brands/${brandId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByBrand();
  }, [brandId]);

  if (loading) {
    return <div>Đang tải sản phẩm theo thương hiệu...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  if (!brandId) {
    return <div>Không tìm thấy trang.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Sản phẩm theo thương hiệu <span className="text-red-500">{brandName}</span>
      </h1>
      <ProductList products={products} apiUrl="" pageSize={8} />
    </div>
  );
};

export default BrandProductsPage;
