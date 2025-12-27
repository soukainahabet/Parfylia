import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductsByBrand } from "../services/productService";
import ProductCard from "../components/user/ProductCard";

export default function BrandProductsPage() {
  const { brand } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsByBrand(brand).then(res => setProducts(res.data));
  }, [brand]);

  return (
    <div>
      <h2>Produits de la marque {brand}</h2>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
