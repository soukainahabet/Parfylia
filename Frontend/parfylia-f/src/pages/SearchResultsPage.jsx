import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchProducts } from "../services/productService";
import ProductCard from "../components/user/ProductCard";

export default function SearchResultsPage() {
  const [products, setProducts] = useState([]);
  const query = new URLSearchParams(useLocation().search).get("q") || "";

  useEffect(() => {
    if (query) {
      searchProducts(query).then(res => setProducts(res.data));
    }
  }, [query]);

  return (
    <div>
      <h2>Résultats pour "{query}"</h2>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
