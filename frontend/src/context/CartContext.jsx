import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../lib/api';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART': return { ...state, items: action.payload, loading: false };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
    default: return state;
  }
};

export function CartProvider({ children }) {
  const { user, getToken } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, { items: [], loading: false, error: null });

  const fetchCart = useCallback(async () => {
    if (!user) { dispatch({ type: 'SET_CART', payload: [] }); return; }
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = await getToken();
      const data = await api.getCart(token);
      dispatch({ type: 'SET_CART', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [user, getToken]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (product_id, variant_id, quantity = 1) => {
    const token = await getToken();
    await api.addToCart(token, { product_id, variant_id, quantity });
    await fetchCart();
  };

  const updateItem = async (id, quantity) => {
    const token = await getToken();
    await api.updateCartItem(token, id, quantity);
    await fetchCart();
  };

  const removeItem = async (id) => {
    const token = await getToken();
    await api.removeCartItem(token, id);
    await fetchCart();
  };

  const clearCart = async () => {
    const token = await getToken();
    await api.clearCart(token);
    dispatch({ type: 'SET_CART', payload: [] });
  };

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => {
    const price = i.products?.sale_price || i.products?.price || 0;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ ...state, itemCount, subtotal, addItem, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
