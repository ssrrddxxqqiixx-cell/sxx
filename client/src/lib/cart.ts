import { Package } from "./mock-data";

export interface CartItem extends Package {
  quantity: number;
}

const CART_STORAGE_KEY = "uaa_store_cart";

export const cartService = {
  // Get all items in cart
  getItems: (): CartItem[] => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart", e);
      return [];
    }
  },

  // Save cart items
  saveItems: (items: CartItem[]): void => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    // Dispatch a custom event to notify components that the cart changed
    window.dispatchEvent(new Event('cartUpdated'));
  },

  // Add an item to cart
  addItem: (pkg: Package, quantity: number = 1): void => {
    const items = cartService.getItems();
    const existingIndex = items.findIndex(item => item.id === pkg.id);
    
    if (existingIndex >= 0) {
      // Item exists, update quantity
      items[existingIndex].quantity += quantity;
    } else {
      // New item
      items.push({ ...pkg, quantity });
    }
    
    cartService.saveItems(items);
  },

  // Update item quantity
  updateQuantity: (id: number, quantity: number): void => {
    if (quantity <= 0) {
      cartService.removeItem(id);
      return;
    }
    
    const items = cartService.getItems();
    const existingIndex = items.findIndex(item => item.id === id);
    
    if (existingIndex >= 0) {
      items[existingIndex].quantity = quantity;
      cartService.saveItems(items);
    }
  },

  // Remove an item entirely
  removeItem: (id: number): void => {
    const items = cartService.getItems();
    const filtered = items.filter(item => item.id !== id);
    cartService.saveItems(filtered);
  },

  // Clear entire cart
  clearCart: (): void => {
    cartService.saveItems([]);
  },

  // Calculate total price
  getTotal: (): number => {
    const items = cartService.getItems();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  // Get total number of items
  getItemCount: (): number => {
    const items = cartService.getItems();
    return items.reduce((count, item) => count + item.quantity, 0);
  }
};