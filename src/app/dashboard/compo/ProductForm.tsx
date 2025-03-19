"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { getServerCookie } from "@/app/components/GetServerCookie";
import ProductTable from "./ProductTable";
import { Product } from "@/types/product";
import { BrandDTO } from "@/types/brand";
import Image from "next/image";

interface ProductFormProps {
  onProductCreated: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ProductForm: React.FC<ProductFormProps> = ({ onProductCreated }) => {
  const [product, setProduct] = useState<Product>({
    idProduct: 0,
    brand: 0,
    modelName: "",
    cpu: "",
    ram: "",
    ssd: "",
    gpu: "",
    screen: "",
    battery: "",
    price: 0,
    location: "",
    touchscreen: false,
    convertible: false,
    grade: "Like New",
    keyboardLed: false,
    numpad: false,
    fullFunction: true,
    notes: "Không có",
    imageUrl: "",
    warranty: "3 tháng tại cửa hàng",
    enabled: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [brands, setBrands] = useState<BrandDTO[]>([]);
  const [showTable, setShowTable] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchToken() {
      const serverToken = await getServerCookie("jwtToken");
      if (serverToken) {
        setToken(serverToken);
      } else {
        const storedToken = Cookies.get("jwtToken");
        setToken(storedToken || null);
      }
    }

    async function fetchBrands() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/brands/all`);
        if (!response.ok) {
          throw new Error(`Failed to fetch brands: ${response.status}`);
        }
        const data: BrandDTO[] = await response.json();
        setBrands(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }

    fetchToken();
    fetchBrands();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;

    setProduct({
      ...product,
      [name]:
        type === "checkbox"
          ? checked
          : name === "brand"
          ? Number(value)
          : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedProduct: Product = {
      ...product,
      modelName: product.modelName.trim(),
      cpu: product.cpu.trim(),
      ram: product.ram.trim(),
      ssd: product.ssd.trim(),
      gpu: product.gpu.trim(),
      screen: product.screen.trim(),
      battery: product.battery.trim(),
      location: product.location.trim(),
      grade: product.grade.trim(),
      notes: product.notes.trim(),
      imageUrl: product.imageUrl.trim(),
      warranty: product.warranty.trim(),
    };

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(trimmedProduct)], { type: "application/json" })
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const endpoint = selectedProduct
        ? `${API_BASE_URL}/admin/api/products/${selectedProduct.idProduct}/update`
        : `${API_BASE_URL}/admin/api/products/add`;

      const method = selectedProduct ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (Array.isArray(errorData)) {
          setError(errorData.join(", "));
        } else {
          throw new Error(
            `Failed to ${method === "PUT" ? "update" : "create"} product: ${
              response.status
            }`
          );
        }
        return;
      }

      await response.json();

      onProductCreated();

      scrollToTop();

      setProduct({
        idProduct: 0,
        brand: 0,
        modelName: "",
        cpu: "",
        ram: "",
        ssd: "",
        gpu: "",
        screen: "",
        battery: "",
        price: 0,
        location: "",
        touchscreen: false,
        convertible: false,
        grade: "Like New",
        keyboardLed: false,
        numpad: false,
        fullFunction: true,
        notes: "Không có",
        imageUrl: "",
        warranty: "3 tháng tại cửa hàng",
        enabled: true,
      });
      setImageFile(null);
      setSelectedProduct(null);
      setImagePreviewUrl(null);

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    setProduct(product);
  }, []);

  const toggleTableVisibility = () => {
    setShowTable(!showTable);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="md:hidden p-4">
        <button
          onClick={toggleTableVisibility}
          className="cursor-pointer bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded"
        >
          {showTable ? "Ẩn danh sách sản phẩm" : "Hiện danh sách sản phẩm"}
        </button>
      </div>
      <div className="flex flex-col md:flex-row p-1">
        <div
          className={`w-full md:w-3/5 p-1 ${
            showTable ? "block" : "hidden md:block"
          }`}
        >
          <ProductTable
            apiUrl={`${API_BASE_URL}/api/products/all`}
            onProductSelect={handleProductSelect}
          />
        </div>

        <div className="w-full md:w-2/5 p-1">
          <div className="w-full bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <h2 className="text-2xl font-semibold text-yellow-500 text-center mb-8">
                {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div
                    className="bg-red-700 border border-red-900 text-white px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    Thương hiệu
                  </label>
                  <div className="mt-1">
                    <select
                      id="brand"
                      name="brand"
                      value={product.brand}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    >
                      <option value="">Chọn thương hiệu</option>
                      {brands.map((brand) => (
                        <option key={brand.brandId} value={brand.brandId}>
                          {brand.brandName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="modelName"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    Tên sản phẩm
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="modelName"
                      name="modelName"
                      value={product.modelName}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cpu"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    CPU
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="cpu"
                      name="cpu"
                      value={product.cpu}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ram"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    RAM
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="ram"
                      name="ram"
                      value={product.ram}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ssd"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    SSD
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="ssd"
                      name="ssd"
                      value={product.ssd}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="gpu"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    GPU
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="gpu"
                      name="gpu"
                      value={product.gpu}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="screen"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    Màn hình
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="screen"
                      name="screen"
                      value={product.screen}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="battery"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    Pin
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="battery"
                      name="battery"
                      value={product.battery}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    Giá
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    Địa chỉ
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={product.location}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="warranty"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    Bảo hành
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="warranty"
                      name="warranty"
                      value={product.warranty}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="grade"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    Ngoại hình
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="grade"
                      name="grade"
                      value={product.grade}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="touchscreen" className="flex items-center">
                      <input
                        type="checkbox"
                        id="touchscreen"
                        name="touchscreen"
                        checked={product.touchscreen}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-yellow-400 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-yellow-300 font-medium">
                        Cảm ứng
                      </span>
                    </label>

                    <label htmlFor="convertible" className="flex items-center">
                      <input
                        type="checkbox"
                        id="convertible"
                        name="convertible"
                        checked={product.convertible}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-yellow-400 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-yellow-300 font-medium">
                        Xoay gập
                      </span>
                    </label>

                    <label htmlFor="keyboardLed" className="flex items-center">
                      <input
                        type="checkbox"
                        id="keyboardLed"
                        name="keyboardLed"
                        checked={product.keyboardLed}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-yellow-400 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-yellow-300 font-medium">
                        LED Phím
                      </span>
                    </label>

                    <label htmlFor="numpad" className="flex items-center">
                      <input
                        type="checkbox"
                        id="numpad"
                        name="numpad"
                        checked={product.numpad}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-yellow-400 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-yellow-300 font-medium">
                        Numpad
                      </span>
                    </label>

                    <label htmlFor="fullFunction" className="flex items-center">
                      <input
                        type="checkbox"
                        id="fullFunction"
                        name="fullFunction"
                        checked={product.fullFunction}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-yellow-400 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-yellow-300 font-medium">
                        Full chức năng
                      </span>
                    </label>

                    <label htmlFor="enabled" className="flex items-center">
                      <input
                        type="checkbox"
                        id="enabled"
                        name="enabled"
                        checked={product.enabled}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-yellow-400 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-yellow-300 font-medium">
                        Còn hàng
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    Ghi chú
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="notes"
                      name="notes"
                      value={product.notes}
                      onChange={handleChange}
                      rows={3}
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="imageUrl"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    URL hình ảnh
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      value={product.imageUrl}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3 bg-gray-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-yellow-300"
                  >
                    Tải lên hình ảnh
                  </label>
                  <div className="mt-1">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-700 rounded-md py-2 px-3"
                      ref={imageInputRef}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-300">
                    Hình ảnh xem trước
                  </label>
                  {imagePreviewUrl && (
                    <Image
                      src={imagePreviewUrl}
                      alt="Ảnh xem trước"
                      width={128}
                      height={128}
                      className="mt-2 max-w-32 max-h-32 object-cover rounded"
                    />
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                  >
                    {loading
                      ? "Đang xử lý..."
                      : selectedProduct
                      ? "Cập nhật sản phẩm"
                      : "Thêm sản phẩm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
