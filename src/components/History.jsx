import React, { useState } from 'react';
import { Search, ChevronRight, Trash2, ArrowLeft, Grid, AlertCircle, CheckCircle2, Activity, AlertTriangle } from 'lucide-react';
import CowDetailsModal from './CowDetailsModal';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

const History = ({ herd, removeFromHerd, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCow, setSelectedCow] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // all, healthy, attention

    const filteredByTab = herd.filter(cow => {
        if (activeTab === 'all') return true;
        if (activeTab === 'healthy') return cow.status === 'Healthy';
        if (activeTab === 'attention') return cow.status !== 'Healthy';
        return true;
    });

    const filteredHerd = filteredByTab.filter(cow =>
        cow.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cow.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cow.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cow.rfid?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="section-container">
            <div className="section-header-nav">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                <div className="section-header-text">
                    <h1 className="section-title">Herd Gallery</h1>
                    <p className="section-desc">View and manage all your registered cattle and identification reports.</p>
                </div>
            </div>

            <div className="card gallery-controls">
                <div className="tabs-container">
                    <button
                        className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <Grid size={18} />
                        <span>All Assets</span>
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'healthy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('healthy')}
                    >
                        <CheckCircle2 size={18} />
                        <span>Healthy</span>
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'attention' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attention')}
                    >
                        <AlertCircle size={18} />
                        <span>Bio-Alerts</span>
                    </button>
                </div>

                <div className="search-box-gallery">
                    <Search className="input-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search ranch database by ID, Breed, or RFID..."
                        className="form-input-styled with-icon"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="history-list">
                {filteredHerd.length > 0 ? (
                    filteredHerd.map((item) => (
                        <motion.div
                            layout
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="history-item card"
                            onClick={() => setSelectedCow(item)}
                        >
                            <div className="history-item-content">
                                <div className="cow-profile-brief">
                                    <div className="preview-avatar">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="avatar-img" />
                                        ) : (
                                            <Activity size={24} />
                                        )}
                                    </div>
                                    <div className="cow-main-info">
                                        <h4>{item.name || `Asset ${item.id}`}</h4>
                                        <div className="cow-meta-info">
                                            <span className="breed-tag">{item.breed}</span>
                                            <span className="date-tag">{item.date}</span>
                                            {item.rfid && <span className="rfid-tag">RFID: {item.rfid}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="history-right-col">
                                    <div className="weight-indicator">
                                        <span className="weight-val">{item.weight}</span>
                                        <span className={`status-badge ${item.status === 'Healthy' ? 'status-ok' : 'status-warn'}`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="action-buttons-group">
                                        <button
                                            className="delete-item-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setItemToDelete(item);
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="chevron-indicator">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="empty-state card text-center p-8">
                        <p className="text-secondary">No cattle found matching your criteria.</p>
                    </div>
                )}
            </div>


            <AnimatePresence>
                {selectedCow && (
                    <CowDetailsModal
                        cow={selectedCow}
                        onClose={() => setSelectedCow(null)}
                    />
                )}
                {itemToDelete && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setItemToDelete(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000
                        }}
                    >
                        <motion.div
                            className="modal-content delete-modal"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'white',
                                borderRadius: '24px',
                                padding: '2.5rem',
                                maxWidth: '400px',
                                width: '90%',
                                textAlign: 'center',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <div style={{
                                margin: '0 auto 1.5rem',
                                width: '70px',
                                height: '70px',
                                background: '#fee2e2',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#dc2626'
                            }}>
                                <AlertTriangle size={36} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--secondary)' }}>Delete Record?</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Are you sure you want to remove <strong>{itemToDelete.name || 'this item'}</strong>? This action cannot be undone.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button
                                    onClick={() => setItemToDelete(null)}
                                    style={{
                                        padding: '1rem',
                                        fontWeight: '700',
                                        background: 'var(--bg-main)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        color: 'var(--secondary)'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        removeFromHerd(itemToDelete.id);
                                        setItemToDelete(null);
                                    }}
                                    style={{
                                        background: '#dc2626',
                                        color: 'white',
                                        padding: '1rem',
                                        borderRadius: '16px',
                                        fontWeight: '700',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 10px 15px -10px #dc2626'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default History;
