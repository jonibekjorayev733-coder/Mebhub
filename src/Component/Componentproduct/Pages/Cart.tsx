

import { useEffect, useState } from "react";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import { db } from "../../Admindonlod/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface CartItem {
  id: string;
  product: string;
  price: number;
  underline?: number;
  imglink: string;
  quantity: number;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const saveItemsLocal = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("cartItems", JSON.stringify(newItems));

    const totalCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
    localStorage.setItem("cartCount", totalCount.toString());
  };

  const increaseQty = (id: string) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveItemsLocal(updated);
  };

  const decreaseQty = (id: string) => {
    const updated = items.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    saveItemsLocal(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveItemsLocal(updated);

    const savedClicked = localStorage.getItem("clickedIds");
    if (savedClicked) {
      const parsed: string[] = JSON.parse(savedClicked);
      const newClicked = parsed.filter(clickedId => clickedId !== id);
      localStorage.setItem("clickedIds", JSON.stringify(newClicked));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = items.reduce(
    (sum, item) => sum + (item.underline ?? item.price) * item.quantity,
    0
  );
  const savings = originalTotal - subtotal;

  const saveCartToFirestore = async () => {
    if (items.length === 0) {
      alert("Savatcha bo‘sh!");
      return;
    }

    try {
      setSaving(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;

      const userId = currentUser?.uid ?? "guest";
      const userName = currentUser?.displayName ?? currentUser?.email ?? "Guest";

      const docRef = await addDoc(collection(db, "carts"), {
        items,
        subtotal,
        savings,
        total: subtotal,
        createdAt: new Date(),
        userId,
        userName,
      });

      console.log("Cart saved with ID: ", docRef.id);
      alert("Buyurtma muvaffaqiyatli saqlandi!");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartCount");
      setItems([]);
    } catch (e) {
      console.error("Error adding cart: ", e);
      alert("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      <div className="cart-content">
        <div className="cart-items">
          {items.length === 0 ? (
            <p>Hali mahsulot qo‘shilmagan</p>
          ) : (
            items.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.imglink} alt={item.product} />
                <div className="item-info">
                  <h4>{item.product}</h4>
                  <p className="desc">
                    {item.underline ? `Old price: $${item.underline}` : "Organic product"}
                  </p>
                  <div className="price">
                    <span className="current">${item.price.toFixed(2)}</span>
                    {item.underline && (
                      <span className="old">${item.underline.toFixed(2)}</span>
                    )}
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
                <div className="qty-control">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p>
            Items ({items.reduce((sum, i) => sum + i.quantity, 0)}){" "}
            <span>${subtotal.toFixed(2)}</span>
          </p>
          <p className="savings">
            Savings <span>- ${savings.toFixed(2)}</span>
          </p>
          <hr />
          <p className="total">
            Total Amount <span>${subtotal.toFixed(2)}</span>
          </p>

          <button
            className="checkout-btn"
            disabled={saving}
            onClick={saveCartToFirestore}
          >
            {saving ? "Saving..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
      <button className="checkout-btn" onClick={goBack}>
        Orqaga
      </button>
    </div>
  );
}


