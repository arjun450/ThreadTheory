import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../lib/api';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, getToken } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setItems([]); return; }
    try {
      setLoading(true);
      const token = await getToken();
      const data = await api.getWishlist(token);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggle = async (product_id) => {
    if (!user) return { requiresAuth: true };
    const token = await getToken();
    const result = await api.toggleWishlist(token, product_id);
    await fetchWishlist();
    return result;
  };

  const isWishlisted = (product_id) => items.some(i => i.product_id === product_id);

  return (
    <WishlistContext.Provider value={{ items, loading, toggle, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
