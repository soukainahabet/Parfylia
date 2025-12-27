import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../services/cartService";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const loadCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const response = await getCart();
      setCart(response.data);
      setError(null);
    } catch (err) {
      console.error("Error loading cart:", err);
      setError("Erreur lors du chargement du panier");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      await addToCart(productId, quantity);
      await loadCart();
      return true;
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Erreur lors de l'ajout au panier");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      await updateCartItem(itemId, quantity);
      await loadCart();
      return true;
    } catch (err) {
      console.error("Error updating cart item:", err);
      setError("Erreur lors de la mise à jour");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      await removeFromCart(itemId);
      await loadCart();
      return true;
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError("Erreur lors de la suppression");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const emptyCart = async () => {
    try {
      setLoading(true);
      await clearCart();
      setCart(null);
      return true;
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Erreur lors du vidage du panier");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        emptyCart,
        loadCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
