"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getServerCookie } from "./components/GetServerCookie";
import ProductList from "./components/ProductList";
import Header from "./components/Header";
import BrandList from "./components/BrandList";

function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState([]);
  const apiUrl = "http://localhost:8080/api/products/all";

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  useEffect(() => {
    async function fetchToken() {
      const serverToken = await getServerCookie("jwtToken"); // Gọi server action
      if (serverToken) {
        setToken(serverToken);
      } else {
        const storedToken = Cookies.get("jwtToken");
        setToken(storedToken || null);
      }
    }

    fetchToken();
  }, []);

  return (
    <div className="">
      <Header onSearchResults={handleSearchResults} />
      <div className="mx-auto w-fit">
        <BrandList />
      </div>
      <ProductList products={searchResults} apiUrl={apiUrl} pageSize={8} />
    </div>
  );
}

export default Home;
