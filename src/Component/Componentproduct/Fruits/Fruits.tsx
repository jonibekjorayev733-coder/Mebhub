
import './fruit.css';
import { FaStar } from "react-icons/fa";
import { db } from "./firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useEffect, useState } from 'react';

export default function Fruits({ category }: { category: string }) {
  const [products, setProduct] = useState<any[]>([]);
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem("cartCount");
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("cartCount", count.toString());
  }, [count]);

  useEffect(() => {
    const fetchproduct = async () => {
      const productref = collection(db, "products");
      const selectedCategory = category === 'fruits' ? '' : category;

      const queryIf = selectedCategory === ""
        ? query(productref, orderBy("created_at", "desc"))
        : query(productref, where("category", "==", selectedCategory));

      const querySnapshot = await getDocs(queryIf);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProduct(items);
    };

    fetchproduct();
  }, [category]);

  const handleAddToCart = (product: any) => {
    const saved = localStorage.getItem("cartItems");
    const items = saved ? JSON.parse(saved) : [];

    const existingIndex = items.findIndex((i: any) => i.id === product.id);
    if (existingIndex !== -1) {
      items[existingIndex].quantity += 1;
    } else {
      items.push({
        ...product,
        price: Number(product.price),
        underline: product.underline ? Number(product.underline) : undefined,
        quantity: 1,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(items));
    const totalCount = items.reduce((sum: number, i: any) => sum + i.quantity, 0);
    localStorage.setItem("cartCount", totalCount.toString());
    setCount(totalCount);

  };

  return (
    <>
      {products.map(user => (
        <div key={user.id} className="Fruits">
          <div className="productimg">
            <img src={user.imglink} alt={user.product} />
          </div>
          <div className="producttext">
            <h6>{user.product}</h6>
            <span>
              <s>{`$${user.underline || 0}`}</s>
              <strong>{`$${user.price}`}</strong>
            </span>
            <button
              style={{
                background: 'blue',
                color: 'white'
              }}
              onClick={() => handleAddToCart(user)}
            >
              Buy Now
            </button>
            <div className="star">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              <p style={{ margin: "10px" }}>(05)</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}



