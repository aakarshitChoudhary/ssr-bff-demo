import axios from "axios";
export async function getProducts(headers = {}) {
  const response = await axios.get("http://localhost:3000/api/products", {
    headers,
    withCredentials: true,
  });

  return response.data.products;
}
