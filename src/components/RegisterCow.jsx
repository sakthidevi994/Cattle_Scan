import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import UploadSection from './UploadSection';

const RegisterCow = ({ addToHerd, onBack }) => {
    const [image, setImage] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        breed: 'Gir',
        gender: 'Female',
        weight: '',
        rfid: '',
        description: ''
    });

    const handleImageChange = async (file) => {
        setImage(file);
        setValidationError(null);
        if (!file) return;

        setIsValidating(true);
        const formDataCheck = new FormData();
        formDataCheck.append('file', file);

        try {
            const res = await fetch('https://cattle-scan.onrender.com/predict', {
                method: 'POST',
                body: formDataCheck
            });
            const data = await res.json();

            if (data.is_cow === false) {
                setValidationError("Asset Not Recognized: Please upload a clear image of a cow (Gir/Kankrej).");
                setImage(null);
            } else {
                // Pre-fill breed if detected
                if (data.breed && data.breed !== 'Undefined') {
                    setFormData(prev => ({ ...prev, breed: data.breed }));
                }
                // Pre-fill weight if detected
                if (data.estimated_weight) {
                    setFormData(prev => ({ ...prev, weight: data.estimated_weight }));
                }
            }
        } catch (err) {
            console.error("Validation failed:", err);
            // Don't block on network error for registration, but maybe warn
        } finally {
            setIsValidating(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValidating) return;
        if (!image) {
            alert("A valid cattle image is required for registration.");
            return;
        }

        const animal = {
            ...formData,
            weight: formData.weight ? `${formData.weight}kg` : 'N/A',
            status: 'Healthy',
            date: new Date().toISOString().split('T')[0],
            imageUrl: image ? URL.createObjectURL(image) : null,
            type: 'manual'
        }

        addToHerd(animal);
        alert('Cow Registered Successfully!');

        // Reset form
        setFormData({
            name: '',
            age: '',
            breed: 'Gir',
            gender: 'Female',
            weight: '',
            rfid: '',
            description: ''
        });
        setImage(null);
    };

    return (
        <div className="section-container">
            <div className="section-header-nav">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                <div className="section-header-text">
                    <h1 className="section-title">Cow Registering</h1>
                    <p className="section-desc">Add a new animal to your ranch records.</p>
                </div>
            </div>

            <div className="registration-grid">
                <div className="registration-side-panel">
                    <div className="card upload-card">
                        <h3 className="panel-title">Visual ID</h3>
                        <p className="panel-subtitle">Upload asset biometric photo</p>
                        <UploadSection onImageUpload={handleImageChange} />
                        {isValidating && (
                            <div className="validation-spinner" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700 }}>
                                <div className="spin-anim" style={{ border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', width: '16px', height: '16px' }} />
                                <span>AI: Detecting Cattle Identity...</span>
                            </div>
                        )}
                        {validationError && (
                            <div className="validation-error" style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '10px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #ef4444' }}>
                                {validationError}
                            </div>
                        )}
                        <div className="upload-requirements">
                            <span className="req-pill success">✔ AI Validated Only</span>
                            <span className="req-pill muted">✔ JPG/PNG Support</span>
                        </div>
                    </div>
                </div>

                <div className="registration-main-panel">
                    <div className="card form-premium-card">
                        <form onSubmit={handleSubmit} className="premium-form">
                            <div className="form-section">
                                <span className="form-section-title">Core Identity</span>
                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 2 }}>
                                        <label>Animal Designation <span className="req">*</span></label>
                                        <input
                                            type="text"
                                            className="form-input-styled"
                                            placeholder="e.g. ALPHA-102"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Age (Years) <span className="req">*</span></label>
                                        <input
                                            type="number"
                                            className="form-input-styled"
                                            placeholder="0"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Genetic Breed</label>
                                        <select
                                            className="form-input-styled"
                                            value={formData.breed}
                                            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                                        >
                                            <option>Gir</option>
                                            <option>Kankrej</option>
                                            <option>Sahiwal</option>
                                            <option>Cross Breed</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Biological Gender</label>
                                        <select
                                            className="form-input-styled"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option>Female</option>
                                            <option>Male</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <span className="form-section-title">Biometric Data</span>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Current Weight (KG)</label>
                                        <input
                                            type="number"
                                            className="form-input-styled"
                                            placeholder="Weight in kg"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>RFID / Ear Tag ID</label>
                                        <input
                                            type="text"
                                            className="form-input-styled"
                                            placeholder="Scan or enter ID"
                                            value={formData.rfid}
                                            onChange={(e) => setFormData({ ...formData, rfid: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label>Detailed Observations</label>
                                    <textarea
                                        className="form-input-styled"
                                        rows="3"
                                        placeholder="Physical traits or temperament notes..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary btn-execute">
                                    <Save size={22} />
                                    <span>Commit to Ranch Catalog</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RegisterCow;
