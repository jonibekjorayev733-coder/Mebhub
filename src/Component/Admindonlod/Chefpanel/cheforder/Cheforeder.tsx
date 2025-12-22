// import React, { useEffect, useState } from "react";
// import { db } from "../../firebase";
// import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
// import "./cheforeder.css";

// interface CartItem {
//   id: string;
//   product: string;
//   price?: number;
//   underline?: number;
//   imglink?: string;
//   quantity: number;
//   category?: string;
// }
// interface CartData {
//   id: string;
//   userId?: string;
//   userName?: string;
//   items?: CartItem[];
//   subtotal?: number;
//   savings?: number;
//   total?: number;
//   createdAt?: any;
//   status?: "pending" | "completed"; // yangi status maydon
// }

// export default function Cheforeder() {
//   const [orders, setOrders] = useState<CartData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const q = query(collection(db, "carts"), orderBy("createdAt", "desc"));
//         const snap = await getDocs(q);
//         const carts: CartData[] = snap.docs.map(d => ({
//           id: d.id,
//           status: "pending", // default agar yo‘q bo‘lsa
//           ...(d.data() as any),
//         }));
//         setOrders(carts);
//       } catch (err) {
//         console.error("Error loading carts:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, []);

//   const handleComplete = async (orderId: string) => {
//     try {
//       const orderRef = doc(db, "carts", orderId);
//       await updateDoc(orderRef, { status: "completed" });

//       setOrders(prev =>
//         prev.map(o => (o.id === orderId ? { ...o, status: "completed" } : o))
//       );
//     } catch (err) {
//       console.error("Error updating status:", err);
//     }
//   };

//   if (loading) return <div>Loading orders...</div>;
//   if (!orders.length) return <div>No orders found.</div>;

//   const filtered = orders.filter(o =>
//     activeTab === "all" ? true : o.status === activeTab
//   );

//   return (
//     <div className="ordertable">
//       {/* Header */}
//       <div className="orders-header">
//         <h2>Chef’s Kitchen</h2>
//         <p>Manage your orders efficiently</p>
//       </div>

//       {/* Tabs */}
//       <div className="tabs">
//         <button
//           onClick={() => setActiveTab("all")}
//           className={activeTab === "all" ? "active" : ""}
//         >
//           All Orders
//         </button>
//         <button
//           onClick={() => setActiveTab("pending")}
//           className={activeTab === "pending" ? "active" : ""}
//         >
//           Pending
//         </button>
//         <button
//           onClick={() => setActiveTab("completed")}
//           className={activeTab === "completed" ? "active" : ""}
//         >
//           Completed
//         </button>
//       </div>

//       {/* Orders grid */}
//       <div className="orders-grid">
//         {filtered.map(order => (
//           <div key={order.id} className="order-card">
//             <div className="order-header">
//               <div>
//                 <h3>{order.userName ?? "Guest"}</h3>
//                 <span className="order-id">Order #{order.id}</span>
//               </div>
//               <span
//                 className={`status ${order.status === "completed" ? "completed" : "pending"}`}
//               >
//                 {order.status?.toUpperCase()}
//               </span>
//             </div>

//             <p className="order-date">
//               {order.createdAt?.toDate
//                 ? order.createdAt.toDate().toLocaleString()
//                 : new Date(order.createdAt).toLocaleString()}
//             </p>

//             {/* Items */}
//             <div className="order-items">
//               {order.items?.map(item => (
//                 <div className="order-item" key={item.id}>
//                   {item.imglink && <img src={item.imglink} alt={item.product} />}
//                   <div className="item-info">
//                     <h5>{item.product}</h5>
//                     <p>{item.quantity}x — ${(item.price ?? 0).toFixed(2)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Summary */}
//             <div className="order-summary">
//               <p>Subtotal: ${(order.subtotal ?? 0).toFixed(2)}</p>
//               <p>Savings: ${(order.savings ?? 0).toFixed(2)}</p>
//               <p>Total: ${(order.total ?? 0).toFixed(2)}</p>
//             </div>

//             {/* Complete button faqat pending bo‘lsa */}
//             {order.status === "pending" && (
//               <button
//                 className="complete-btn"
//                 onClick={() => handleComplete(order.id)}
//               >
//                 Mark as Completed
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import "./cheforeder.css";

interface CartItem {
  id: string;
  product: string;
  price?: number;
  imglink?: string;
  quantity: number;
  category?: string;
}

interface CartData {
  id: string;
  userId?: string;
  userName?: string;
  items?: CartItem[];
  subtotal?: number;
  savings?: number;
  total?: number;
  createdAt?: any;
  status?: "pending" | "completed";
}

export default function Cheforeder() {
  const [orders, setOrders] = useState<CartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");

  useEffect(() => {
    const q = query(collection(db, "carts"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const carts: CartData[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          userName: data.userName ?? "Guest",
          items: data.items ?? [],
          subtotal: data.subtotal ?? 0,
          savings: data.savings ?? 0,
          total: data.total ?? 0,
          createdAt: data.createdAt,
          status: data.status ?? "pending", 
        };
      });
      setOrders(carts);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleComplete = async (orderId: string) => {
    try {
      const orderRef = doc(db, "carts", orderId);
      await updateDoc(orderRef, { status: "completed" });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <div className="ordertable">Loading orders...</div>;
  if (!orders.length) return <div className="ordertable">No orders found.</div>;

  const filtered = orders.filter((o) =>
    activeTab === "all" ? true : o.status === activeTab
  );

  return (
    <div className="ordertable">
      <div className="orders-header">
        <h2>Chef’s Kitchen</h2>
        <p>Manage your orders efficiently</p>
      </div>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("all")}
          className={activeTab === "all" ? "active" : ""}
        >
          All Orders
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={activeTab === "pending" ? "active" : ""}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={activeTab === "completed" ? "active" : ""}
        >
          Completed
        </button>
      </div>

      <div className="orders-grid">
        {filtered.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <h3>{order.userName}</h3>
                <span className="order-id">Order #{order.id}</span>
              </div>
              <span
                className={`status ${
                  order.status === "completed" ? "completed" : "pending"
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="order-date">
              {order.createdAt?.toDate
                ? order.createdAt.toDate().toLocaleString()
                : "No date"}
            </p>

<div className="order-items">
  {order.items?.map((item) => (
    <div className="order-item" key={item.id}>
      {item.imglink && <img src={item.imglink} alt={item.product} />}
      <div className="item-info">
        <h5>{item.product}</h5>
        <p>
          {item.quantity}x — ${(item.price ?? 0).toFixed(2)}
        </p>
      </div>
    </div>
  ))}
</div>

<div className="order-summary">
  <p><strong>Manzil:</strong> {order.address ?? "N/A"}</p>
  <p><strong>Telefon:</strong> {order.phone ?? "N/A"}</p>
  <p>Subtotal: ${(order.subtotal ?? 0).toFixed(2)}</p>
  <p>Savings: ${(order.savings ?? 0).toFixed(2)}</p>
  <p>Total: ${(order.total ?? 0).toFixed(2)}</p>
</div>

            {order.status === "pending" && (
              <button
                className="complete-btn"
                onClick={() => handleComplete(order.id)}
              >
                Mark as Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
