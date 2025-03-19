"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Product {
  idProduct: number;
  brand: number;
  brandName: string;
  modelName: string;
  cpu: string;
  ram: string;
  ssd: string;
  gpu: string;
  screen: string;
  battery: string;
  price: number;
  location: string;
  touchscreen: boolean;
  convertible: boolean;
  grade: string;
  keyboardLed: boolean;
  numpad: boolean;
  fullFunction: boolean;
  notes: string;
  imageUrl: string;
  warranty?: string;
  enabled: boolean;
}

interface ProductDetailProps {
  idProduct: number;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ idProduct }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products/${idProduct}`
        );
        if (!response.ok) {
          throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            `Mong đợi kiểu dữ liệu application/json nhưng nhận được ${contentType}`
          );
        }

        try {
          const data: Product = await response.json();

          const trimmedData: Product = {
            ...data,
            brandName: data.brandName.trim(),
            modelName: data.modelName.trim(),
            cpu: data.cpu.trim(),
            ram: data.ram.trim(),
            ssd: data.ssd.trim(),
            gpu: data.gpu.trim(),
            screen: data.screen.trim(),
            battery: data.battery.trim(),
            location: data.location.trim(),
            grade: data.grade.trim(),
            notes: data.notes.trim(),
            warranty: data.warranty ? data.warranty.trim() : undefined, // optional field
          };

          setProduct(trimmedData);
        } catch (jsonError: unknown) {
          console.error("Lỗi phân tích cú pháp JSON:", jsonError);
          setError("Lỗi phân tích cú pháp JSON từ server");
        }
      } catch (error: unknown) {
        console.error("Lỗi Fetch:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Không thể tải chi tiết sản phẩm.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [idProduct]);

  if (loading) {
    return <div className="text-yellow-300">Đang tải chi tiết sản phẩm...</div>;
  }

  if (error) {
    return <div className="text-red-400">Lỗi: {error}</div>;
  }

  if (!product) {
    return <div className="text-yellow-300">Không tìm thấy sản phẩm.</div>;
  }

  const touchscreenText = product.touchscreen ? "Có" : "Không";
  const convertibleText = product.convertible ? "Có" : "Không";
  const keyboardLedText = product.keyboardLed ? "Có" : "Không";
  const numpadText = product.numpad ? "Có" : "Không";
  const fullFunctionText = product.fullFunction ? "Có" : "Không";
  const enabledText = product.enabled ? "Còn hàng" : "Hết hàng";

  return (
    <div className="container mx-auto mt-8 text-yellow-300">
      {/* Set text color to yellow-300 for the entire component */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.imageUrl}
            alt={product.modelName}
            width={500}
            height={300}
            className="w-full rounded-lg shadow-md"
            priority
          />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-yellow-500 mb-4 text-shadow">
            {" "}
            {product.brandName} {product.modelName}
          </h2>
          <p className="mb-2">
            <span className="font-semibold text-red-500 text-shadow">
              {enabledText}
            </span>{" "}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              CPU:
            </span>{" "}
            {/* Thông tin quan trọng màu sắc - yellow - có shadow*/}
            {product.cpu}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              RAM:
            </span>{" "}
            {product.ram}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              SSD:
            </span>{" "}
            {product.ssd}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              GPU:
            </span>{" "}
            {product.gpu}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              Màn hình:
            </span>{" "}
            {product.screen}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              Pin:
            </span>{" "}
            {product.battery}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              Địa chỉ:
            </span>{" "}
            {product.location}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              Cảm ứng:
            </span>{" "}
            {touchscreenText}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              Xoay gập:
            </span>{" "}
            {convertibleText}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              Ngoại hình:
            </span>{" "}
            {product.grade}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              Đèn bàn phím:
            </span>{" "}
            {keyboardLedText}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              Bàn phím số:
            </span>{" "}
            {numpadText}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              Đầy đủ chức năng:
            </span>{" "}
            {fullFunctionText}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              Ghi chú:
            </span>{" "}
            {product.notes}
          </p>
          {product.warranty && (
            <p className="mb-2">
              <span className="font-semibold text-yellow-400 text-shadow">
                Bảo hành:
              </span>{" "}
              {product.warranty}
            </p>
          )}
          <p className="mb-2">
            <span className="font-semibold text-yellow-400 text-shadow">
              Giá:
            </span>{" "}
            <span className="text-red-500 font-bold text-shadow">
              {product.price.toLocaleString()} VNĐ
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
