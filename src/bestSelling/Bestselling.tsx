

import { useState } from 'react';
import Componentproduct from "../Component/Componentproduct/Fruits/Fruits";
import './bestselling.css';

export default function Bestselling(){
    const [activeCategory, setActiveCategory] = useState('fruits');

    const categories = [
        {id:'all',name:"All"},
        { id: 'fruits', name: 'Fruits' },
        { id: 'vegetable', name: 'Vegetable' },
        { id: 'meal', name: 'Meal' },
        { id: 'milk', name: 'Milk' },
        { id: 'cakes', name: 'Cakes' },
        { id: 'drinks', name: 'Drinks' }
    ];

    return(
        <div className="Bestselling">
            <div className="selling">
                <div className="Allproducts">
                    <div className="line-text">
                        <span>OR</span>
                    </div>

                    <ul>
                        {categories.map(category => (
                            <li key={category.id}>
                                <a 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveCategory(category.id);
                                    }}
                                    className={activeCategory === category.id ? 'active' : ''}
                                >
                                    {category.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="grids">
                        <Componentproduct category={activeCategory} />
                    </div>
                </div>
            </div>
        </div>
    )
}







// import { useState, useEffect } from 'react';
// import Componentproduct from "../Component/Componentproduct/Fruits/Fruits";
// import './bestselling.css';
// import { db } from '../Component/Admindonlod/firebase'; // Firebase config
// import { collection, getDocs } from "firebase/firestore";

// interface Category {
//   id: string;
//   name: string;
// }

// export default function Bestselling() {
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [categories, setCategories] = useState<Category[]>([]);

//   // Firebase dan categories olish
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const colRef = collection(db, "categories");
//         const snapshot = await getDocs(colRef);
//         const data: Category[] = snapshot.docs.map(doc => ({
//           id: doc.id,
//           name: doc.data().name || doc.id
//         }));
//         // Agar "All" kategoriyasini yuqoriga qo‘shmoqchi bo‘lsak
//         setCategories([{ id: 'all', name: 'All' }, ...data]);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <div className="Bestselling">
//       <div className="selling">
//         <div className="Allproducts">
//           <div className="line-text">
//             <span>OR</span>
//           </div>

//           <ul>
//             {categories.map(category => (
//               <li key={category.id}>
//                 <a 
//                   href="#" 
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setActiveCategory(category.id);
//                   }}
//                   className={activeCategory === category.id ? 'active' : ''}
//                 >
//                   {category.name}
//                 </a>
//               </li>
//             ))}
//           </ul>
          
//           <div className="grids">
//             <Componentproduct category={activeCategory} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
