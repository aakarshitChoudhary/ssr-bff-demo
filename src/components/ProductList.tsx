"use client";
import { useProducts } from "@/hook/useProducts";

export default function ProductList() {
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading) return <p>Loading products…</p>;
  if (isError) return <p>Failed to load products.</p>;
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      {products?.map((product) => (
        <div
          key={product.id}
          className="w-64 bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
          style={{
            width: "240px",
            border: "2px solid wheat",
            backgroundColor: "lightpink",
            padding: "2px",
            borderRadius: "10px",
          }}
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-32 h-32 object-cover rounded mb-2"
          />
          <h3 className="text-lg font-bold text-blue-600">{product.title}</h3>
          <button className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            See More
          </button>
        </div>
      ))}
    </div>
  );
}
