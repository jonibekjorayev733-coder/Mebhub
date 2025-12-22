import React, { useState, useEffect } from 'react';
import { Plus, Package, PencilLine, Trash2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import ProductModal from '../ProductModal/ProductModal';
import './ProductManagement.css';

import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const ProductManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null); 
  const [openModal, setOpenModal] = useState(false);

  const categories = ['all', 'fruits', 'vegetable', 'meal', 'milk', 'cakes', 'drinks'];

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, 'products', deleteId));
      setProducts(products.filter(p => p.id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setOpenModal(false);
      setDeleteId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setOpenModal(true);
  };

  const handleEdit = (product: any) => { 
    setEditingProduct(product); 
    setIsModalOpen(true); 
  };

  const handleCreate = () => { 
    setEditingProduct(null); 
    setIsModalOpen(true); 
  };

  const filteredProducts = products.filter(p =>
    p.product?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || p.category === selectedCategory)
  );

  if (loading) return <div className="pm-spinner"><div></div></div>;

  return (
    <div className="pm-container">
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="delete-modal">
            <HiOutlineExclamationCircle className="modal-icon" />
            <h3 className="modal-text">
              Are you sure you want to delete this product?
            </h3>
            <div className="modal-actions">
              <Button color="failure" onClick={handleDeleteConfirm}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <div className="pm-header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your store products and inventory</p>
        </div>
        <div className="pm-create-btn" onClick={handleCreate}>
          <Plus /> <span>Create Product</span>
        </div>
      </div>

      <div className="pm-filters">
        <input 
          placeholder="🔍 Search products..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        />
        <select 
          value={selectedCategory} 
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="pm-grid">
        {filteredProducts.length > 0 ? filteredProducts.map(p => (
          <div key={p.id} className="pm-card">
            <img src={p.imglink} alt={p.product} />

            <div className="pm-actions">
              <button className="pm-btn-action edit" onClick={() => handleEdit(p)}>
                <PencilLine size={16} />
              </button>
              <button className="pm-btn-action delete" onClick={() => handleDeleteClick(p.id)}>
                <Trash2 size={16} />
              </button>
            </div>

            <div className="pm-card-body">
              <h3>{p.product}</h3>
              {p.description && <p>{p.description}</p>}
              <div className="pm-price">
                {p.underline && <span className="underline">${p.underline}</span>}
                <span className="current">${p.price}</span>
              </div>
              <div className="pm-category">{p.category}</div>
            </div>
          </div>
        )) : (
          <div className="pm-no-products">
            <Package /><p>No products found</p>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={fetchProducts}
      />
    </div>
  );
};

export default ProductManagement;
