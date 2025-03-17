// app/products/[idProduct]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ProductDetail from "@/app/components/ProductDetail";

export default function ProductDetailPage() {
  const params = useParams();
  const { idProduct } = params;

  if (!idProduct) {
    return <div>Loading...</div>;
  }

  return <ProductDetail idProduct={Number(idProduct)} />;
}
