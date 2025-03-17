// pages/dashboard.tsx
"use client";

import React, { useState, useCallback } from "react";
import Header from "./compo/Header";
import Sidebar from "./compo/Sidebar";
import ProductForm from "./compo/ProductForm";

const DashboardPage = () => {
  const [activePage, setActivePage] = useState("products");
  const [key, setKey] = useState(0); // State to force remount

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  const handleProductCreated = useCallback(() => {
    // Function to force remount ProductTable
    setKey((prevKey) => prevKey + 1); // Update key to force remount
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onNavigate={handleNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 bg-gray-800">
          {/* Container */}
          <div className="mx-auto">
            {/* Conditional Rendering */}
            {activePage === "products" && (
              <div className=" bg-gray-800 shadow-md rounded-md p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-200 mb-4">
                  Quản lý sản phẩm
                </h3>
                <ProductForm
                  onProductCreated={handleProductCreated} // Pass the callback
                />
              </div>
            )}

            {activePage === "brands" && (
              <div className=" bg-gray-800 shadow-md rounded-md p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-200 mb-4">
                  Quản lý thương hiệu
                </h3>
                <div>
                  {/* Nội dung quản lý tài khoản sẽ được thêm ở đây */}
                  <p>Chức năng này đang được phát triển...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
