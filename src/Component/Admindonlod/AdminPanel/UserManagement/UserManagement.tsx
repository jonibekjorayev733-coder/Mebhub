// import React, { useState } from 'react';
// import { Users, Search, UserPlus, CreditCard as Edit, Trash2, Mail, Phone } from 'lucide-react';
// import './UserManagement.css';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role: 'admin' | 'user';
//   status: 'active' | 'inactive';
//   avatar: string;
//   joinedAt: string;
// }

// const UserManagement: React.FC = () => {
//   const [users] = useState<User[]>([
//     {
//       id: '1',
//       name: 'John Doe',
//       email: 'john@example.com',
//       phone: '+1234567890',
//       role: 'admin',
//       status: 'active',
//       avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
//       joinedAt: '2024-01-15'
//     },
//     {
//       id: '2',
//       name: 'Jane Smith',
//       email: 'jane@example.com',
//       phone: '+0987654321',
//       role: 'user',
//       status: 'active',
//       avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
//       joinedAt: '2024-02-20'
//     },
//     {
//       id: '3',
//       name: 'Bob Johnson',
//       email: 'bob@example.com',
//       role: 'user',
//       status: 'inactive',
//       avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
//       joinedAt: '2024-03-10'
//     },
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="um-container">
//       <div className="um-header">
//         <div>
//           <h1>User Management</h1>
//           <p>Manage user accounts and permissions</p>
//         </div>
//         <button className="um-btn um-btn-red">
//           <UserPlus className="icon-small" />
//           <span>Add User</span>
//         </button>
//       </div>

//       <div className="um-search">
//         <Search className="icon-search" />
//         <input
//           type="text"
//           placeholder="Search users..."
//           value={searchTerm}
//           onChange={e => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="um-table-wrapper">
//         {filteredUsers.length > 0 ? (
//           <table className="um-table">
//             <thead>
//               <tr>
//                 <th>User</th>
//                 <th>Contact</th>
//                 <th>Role</th>
//                 <th>Status</th>
//                 <th>Joined</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map(user => (
//                 <tr key={user.id}>
//                   <td className="um-user-cell">
//                     <img src={user.avatar} alt={user.name} className="um-avatar" />
//                     <div>
//                       <div className="um-user-name">{user.name}</div>
//                       <div className="um-user-email">{user.email}</div>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="um-contact">
//                       <div><Mail className="icon-small" /> {user.email}</div>
//                       {user.phone && <div><Phone className="icon-small" /> {user.phone}</div>}
//                     </div>
//                   </td>
//                   <td>
//                     <span className={`role ${user.role}`}>{user.role}</span>
//                   </td>
//                   <td>
//                     <span className={`status ${user.status}`}>{user.status}</span>
//                   </td>
//                   <td>{user.joinedAt}</td>
//                   <td>
//                     <div className="um-actions">
//                       <button className="um-btn um-btn-blue"><Edit className="icon-small" /></button>
//                       <button className="um-btn um-btn-red"><Trash2 className="icon-small" /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <div className="um-no-data">
//             <Users className="icon-large" />
//             <p>No users found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagement;


import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Crown,
  ChefHat,
  User,
} from "lucide-react";
import { db } from "../../firebase"; // 🔥 firebase config faylingizni shu yerga import qiling
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./UserManagement.css";

interface UserType {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "chef" | "waiter";
  status: "active" | "inactive";
  avatar: string;
  joinedAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserType[];
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const updateRole = async (userId: string, newRole: "admin" | "chef" | "waiter") => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role: newRole });
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="um-container">
      <div className="um-header">
        <div>
          <h1>User Management</h1>
          <p>Manage user accounts and permissions</p>
        </div>
        
      </div>

      <div className="um-search">
        <Search className="icon-search" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="um-table-wrapper">
        {filteredUsers.length > 0 ? (
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="um-user-cell">
                    
                    <div>
                      <div className="um-user-name">{user.name}</div>
                      <div className="um-user-email">{user.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="um-contact">
                      <div>
                        <Mail className="icon-small" /> {user.email}
                      </div>
                      {user.phone && (
                        <div>
                          <Phone className="icon-small" /> {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`role ${user.role}`}>{user.role}</span>
                  </td>
                  <td>
                    <span className={`status ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.joinedAt}</td>
                  <td>
                    <div className="um-actions">
                      <button
                        className="um-btn um-btn-blue"
                        onClick={() => updateRole(user.id, "admin")}
                      >
                        <Crown className="icon-small" />
                      </button>
                      <button
                        className="um-btn um-btn-green"
                        onClick={() => updateRole(user.id, "chef")}
                      >
                        <ChefHat className="icon-small" />
                      </button>
                      <button
                        className="um-btn um-btn-purple"
                        onClick={() => updateRole(user.id, "waiter")}
                      >
                        <User className="icon-small" />
                      </button>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="um-no-data">
            <Users className="icon-large" />
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
