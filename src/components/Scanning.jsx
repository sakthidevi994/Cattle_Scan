import React, { useState, useEffect } from 'react';
import UploadSection from './UploadSection'
import CctvScanner from './CctvScanner'
import DetectionOptions from './DetectionOptions'
import ResultCard from './ResultCard'
import AdditionalInfo from './AdditionalInfo'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Search, ArrowLeft, Weight, Activity, Camera, Image as ImageIcon, RefreshCw } from 'lucide-react'

const modeConfig = {
    breed: {
        title: "Breed Identification",
        desc: "AI-powered cattle analysis and identification."
    },
    weight: {
        title: "Weight Tracking",
        desc: "Smart weight estimation and growth monitoring."
    },
    disease: {
        title: "Disease Analysis",
        desc: "Health diagnostic tool for common cattle diseases."
    }
}

const Scanning = ({ addToHerd, onBack, mode = 'breed' }) => {
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [scanMode, setScanMode] = useState('upload') // 'upload' or 'cctv'
    const [appConfig, setAppConfig] = useState(null)
    const [options, setOptions] = useState({
        breed: mode === 'breed',
        weight: mode === 'weight' || mode === 'breed'
    })

    // Fetch config for CCTV status
    useEffect(() => {
        fetch('https://cattle-scan.onrender.com/settings')
            .then(res => res.json())
            .then(data => setAppConfig(data))
            .catch(err => console.error("Failed to fetch settings for scanning:", err));
    }, []);

    // Update options if mode changes
    useEffect(() => {
        setOptions({
            breed: mode === 'breed',
            weight: mode === 'weight' || mode === 'breed'
        })
        setImage(null);
        setResult(null);
    }, [mode])

    const config = modeConfig[mode] || modeConfig.breed;

    const handleImageUpload = (file) => {
        setImage(file)
        setResult(null)
    }

    const handleAnalyze = async () => {
        if (!image) return;

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await fetch('https://cattle-scan.onrender.com/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            let weight = data.estimated_weight || 0;
            let range = '';

            if (data.breed === 'Gir') {
                range = '380kg – 550kg';
            } else if (data.breed === 'Kankrej') {
                range = '400kg – 600kg';
            } else {
                range = `${Math.floor(weight * 0.9)}kg – ${Math.floor(weight * 1.1)}kg`;
            }

            const breedLabel = data.is_cow ? data.breed : 'Undefined';

            const newRecord = {
                breedName: breedLabel,
                breed: breedLabel,
                confidence: (data.confidence || 0) + '%',
                weightValue: data.is_cow ? weight : 0,
                weight: data.is_cow ? `${weight}kg` : '0kg',
                weightRange: data.is_cow ? range : 'N/A',
                showBreed: mode === 'breed',
                showWeight: mode === 'weight',
                isDisease: mode === 'disease',
                status: mode === 'disease' ? 'Assessment Required' : 'Healthy',
                imageUrl: image ? URL.createObjectURL(image) : null,
                name: mode === 'weight' ? `Weight Scan` : `Scan ${data.breed}`
            };

            setResult(newRecord);

            // Only add to herd if the asset is identified as a cow and breed is recognized
            if (data.is_cow && data.breed !== 'Undefined') {
                addToHerd(newRecord);
            }

        } catch (error) {
            console.error("Error analyzing image:", error);
            alert("Failed to analyze image. Ensure backend is running at https://cattle-scan.onrender.com");
        } finally {
            setLoading(false);
        }
    }

    const reset = () => {
        setImage(null);
        setResult(null);
    }

    return (
        <div className="section-container">
            <div className="section-header-nav">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                <div className="section-header-text">
                    <h1 className="section-title">{config.title}</h1>
                    <p className="section-desc">{config.desc}</p>
                </div>
            </div>

            {/* Scan Mode Switcher */}
            <div className="card-tabs mb-6" style={{ background: 'var(--bg-main)', padding: '0.4rem', borderRadius: '14px', display: 'flex', gap: '0.5rem', width: 'fit-content' }}>
                <button
                    className={`tab-item ${scanMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setScanMode('upload')}
                    style={{ minWidth: '160px' }}
                >
                    <ImageIcon size={18} />
                    <span>Photo Upload</span>
                </button>
                <button
                    className={`tab-item ${scanMode === 'cctv' ? 'active' : ''}`}
                    onClick={() => setScanMode('cctv')}
                    style={{ minWidth: '160px' }}
                >
                    <Camera size={18} />
                    <span>Live CCTV</span>
                </button>
            </div>

            <div className="layout-grid">
                <div className="left-panel">
                    {scanMode === 'upload' ? (
                        <UploadSection key={mode} onImageUpload={handleImageUpload} />
                    ) : (
                        <CctvScanner onCapture={handleImageUpload} remoteConfig={appConfig} />
                    )}

                    <AnimatePresence>
                        {image && !result && !loading && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="start-analysis-wrapper"
                            >
                                {mode === 'breed' && (
                                    <DetectionOptions options={options} onOptionChange={setOptions} />
                                )}

                                <button
                                    className="btn-primary btn-execute"
                                    disabled={!options.breed && !options.weight}
                                    onClick={handleAnalyze}
                                >
                                    {mode === 'breed' && <Search size={22} strokeWidth={2.5} />}
                                    {mode === 'weight' && <Weight size={22} strokeWidth={2.5} />}
                                    {mode === 'disease' && <Activity size={22} strokeWidth={2.5} />}
                                    <span>Execute Analysis</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loading && (
                        <div className="card loading-state" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                            <div className="spinner-container" style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                                <Loader2 className="spinner" size={60} style={{ color: 'var(--primary-color)' }} />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary-color)', marginBottom: '0.5rem' }}>Processing Data</h3>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>SmartCattle AI Engine is performing feature extraction...</p>
                            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>EfficientNet-B0 v2.1 Active</div>
                        </div>
                    )}
                </div>

                <div className="right-panel">
                    <AnimatePresence mode='wait'>
                        {result && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="results-wrapper"
                            >
                                <ResultCard
                                    result={{
                                        ...result,
                                        isDisease: mode === 'disease'
                                    }}
                                    show={true}
                                />

                                {result.showBreed && result.breedName !== 'Undefined' && (
                                    <AdditionalInfo breedName={result.breedName} />
                                )}

                                <button className="reset-btn-premium" onClick={reset}>
                                    <RefreshCw size={20} />
                                    <span>Analyze Another Asset</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Scanning;
