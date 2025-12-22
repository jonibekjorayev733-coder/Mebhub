

import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import CategoryModal from '../CategoryModal/CategoryModal';

import './CategoryManagement.css'; // Oddiy CSS faylini import qilamiz

interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const defaultCategories = [
    { name: 'Fruits', icon: '🍎', description: 'Fresh and organic fruits' },
    { name: 'Vegetable', icon: '🥕', description: 'Farm-fresh vegetables' },
    { name: 'Meal', icon: '🍗', description: 'Delicious prepared meals' },
    { name: 'Milk', icon: '🥛', description: 'Dairy products and milk' },
    { name: 'Cakes', icon: '🧁', description: 'Sweet cakes and pastries' },
    { name: 'Drinks', icon: '🥤', description: 'Refreshing beverages' },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoryRef = collection(db, 'categories');
      const querySnapshot = await getDocs(categoryRef);

      if (querySnapshot.empty) {
        await createDefaultCategories();
      } else {
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(items);
      }
    } catch (error) {
      console.error(error);
      setCategories(defaultCategories.map((cat, index) => ({ ...cat, id: index.toString() })));
    } finally {
      setLoading(false);
    }
  };

  const createDefaultCategories = async () => {
    try {
      const categoryRef = collection(db, 'categories');
      const newCategories: Category[] = [];
      for (const category of defaultCategories) {
        const docRef = await addDoc(categoryRef, category);
        newCategories.push({ id: docRef.id, ...category });
      }
      setCategories(newCategories);
    } catch (error) {
      console.error(error);
      setCategories(defaultCategories.map((cat, index) => ({ ...cat, id: index.toString() })));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="category-management">
      <div className="header">
        <div>
          <h1>Category Management</h1>
          <p>Manage your product categories and organize your store</p>
        </div>
        <button className="create-btn" onClick={handleCreate}>
          <Plus className="icon" />
          <span>Create Category</span>
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="card-header">
              <div className="card-info">
                <div className="category-icon">{category.icon || '📦'}</div>
                <div>
                  <h3>{category.name}</h3>
                  {category.description && <p>{category.description}</p>}
                </div>
              </div>
            </div>

            <div className="card-footer">
              <div className="actions">
                <button onClick={() => handleEdit(category)} className="edit-btn">
                  <Edit className="icon-small" />
                  <span>Edit</span>
                </button>
                <button onClick={() => handleDelete(category.id)} className="delete-btn">
                  <Trash2 className="icon-small" />
                  <span>Delete</span>
                </button>
              </div>
              <span className="category-label">Category</span>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>No categories found</p>
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSave={fetchCategories}
      />
    </div>
  );
};

export default CategoryManagement;
