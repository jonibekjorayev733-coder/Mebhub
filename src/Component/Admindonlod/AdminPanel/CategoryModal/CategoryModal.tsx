import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

import './CategoryModal.css'; 

interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const commonIcons = ['🍎', '🥕', '🍗', '🥛', '🧁', '🥤', '🍞', '🥩', '🐟', '🥒', '🍓', '🍌'];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon || '',
        description: category.description || '',
      });
    } else {
      setFormData({
        name: '',
        icon: '',
        description: '',
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        name: formData.name,
        icon: formData.icon,
        description: formData.description,
      };

      if (category) {
        await updateDoc(doc(db, 'categories', category.id), categoryData);
      } else {
        await addDoc(collection(db, 'categories'), categoryData);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>{category ? 'Edit Category' : 'Create Category'}</h2>
          <button onClick={onClose} className="close-btn">
            <X className="icon-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Icon</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Enter emoji or icon"
            />
            <div className="icon-list">
              {commonIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className="icon-option"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Brief description of the category"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? 'Saving...' : (category ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
