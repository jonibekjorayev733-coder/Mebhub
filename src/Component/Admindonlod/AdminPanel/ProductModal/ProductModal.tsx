import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import './ProductModal.css';

interface Product {
  id: string;
  product: string;
  price: number;
  underline?: number;
  imglink: string;
  category: string;
  description?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    product: '',
    price: '',
    underline: '',
    imglink: '',
    category: 'fruits',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const categories = ['fruits', 'vegetable', 'meal', 'milk', 'cakes', 'drinks'];

  useEffect(() => {
    if (product) {
      setFormData({
        product: product.product,
        price: product.price.toString(),
        underline: product.underline?.toString() || '',
        imglink: product.imglink,
        category: product.category,
        description: product.description || '',
      });
    } else {
      setFormData({
        product: '',
        price: '',
        underline: '',
        imglink: '',
        category: 'fruits',
        description: '',
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        product: formData.product,
        price: parseFloat(formData.price),
        underline: formData.underline ? parseFloat(formData.underline) : null,
        imglink: formData.imglink,
        category: formData.category,
        description: formData.description,
      };

      if (product) {
        await updateDoc(doc(db, 'products', product.id), {
          ...productData,
          updated_at: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          created_at: serverTimestamp(),
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Create Product'}</h2>
          <button onClick={onClose} className="close-btn">
            <X className="icon-small" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Original Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.underline}
                onChange={(e) => setFormData({ ...formData, underline: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.imglink}
              onChange={(e) => setFormData({ ...formData, imglink: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? 'Saving...' : (product ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
