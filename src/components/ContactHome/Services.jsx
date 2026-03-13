import axios from "axios";

export async function fetchProducts(limit = 150) {
  const response = await axios.get(
    `https://fakestoreapi.com/products?limit=${limit}`
  );
  return response.data;
}
