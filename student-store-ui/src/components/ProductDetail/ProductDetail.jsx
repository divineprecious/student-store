import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotFound from "../NotFound/NotFound";
import { formatPrice } from "../../utils/format";
import "./ProductDetail.css";

function ProductDetail({ addToCart, removeFromCart, products, getQuantityOfItemInCart }) {
  
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  const quantity = product ? getQuantityOfItemInCart(product) : 0;

  useEffect(() => {
    console.log("useEffect running for productId:", productId);
    const fetchProduct = async () => {
      try {
          const resProduct = products.find((p) => p.id === Number(productId));
          setProduct(resProduct);
    } catch (err) {
      console.log("Error fetching products: ", err);
      }
    }
    fetchProduct();
  }, [productId, products]);

  const handleAddToCart = () => {
    if (product.id) {
      addToCart(product)
    }
  };

  const handleRemoveFromCart = () => {
    if (product.id) {
      removeFromCart(product);
    }
  };

  if (!product) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="ProductDetail">
      <div className="product-card">
        <div className="media">
          <img src={product.imageUrl || "/placeholder.png"} alt={product.name} />
        </div>
        <div className="product-info">
          <p className="product-name">{product.name}</p>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p className="description">{product.description}</p>
          <div className="actions">
            <button onClick={handleAddToCart}>Add to Cart</button>
            {quantity > 0 && <button onClick={handleRemoveFromCart}>Remove from Cart</button>}
            {quantity > 0 && <span className="quantity">Quantity: {quantity}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}


export default ProductDetail;