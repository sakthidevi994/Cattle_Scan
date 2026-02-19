import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Scale, AlertOctagon, Activity } from 'lucide-react';

const ResultCard = ({ result, show }) => {
    if (!show) return null;

    // A result is only invalid if we have NO data to show at all
    const hasWeight = result.weight && result.weightValue > 0;
    const hasDisease = result.isDisease;
    const isInvalid = result.breedName === 'Undefined' && !hasWeight && !hasDisease;

    const hasBreed = result.breed && result.breedName !== 'Undefined';

    return (
        <AnimatePresence>
            <motion.div
                className={`card result-card ${isInvalid ? 'invalid-result' : ''}`}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            >
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary-color)' }}>
                        {isInvalid ? 'Identity Verification Failed' :
                            result.isDisease ? 'Medical Assessment' :
                                result.showWeight ? 'Quantitative Analysis' : 'Feature Recognition'}
                    </h2>
                    <span className={`badge ${isInvalid ? 'warning' : 'success'}`}
                        style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: isInvalid ? '#fee2e2' : '#dcfce7',
                            color: isInvalid ? '#ef4444' : '#16a34a'
                        }}>
                        {isInvalid ? 'Unverified' : 'Verified by AI'}
                    </span>
                </div>

                <div className="result-grid" style={{ display: 'grid', gap: '1.25rem' }}>
                    {isInvalid ? (
                        <div className="invalid-message" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                            <div className="icon-warning" style={{ background: '#fee2e2', padding: '1.25rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1.5rem' }}>
                                <AlertOctagon size={40} style={{ color: '#ef4444' }} />
                            </div>
                            <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Asset Not Recognized</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>Please provide a high-resolution image of a recognized cattle breed (Gir/Kankrej).</p>
                        </div>
                    ) : (
                        <>
                            {result.showBreed && (
                                <div className="result-item breed" style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '20px', display: 'flex', gap: '1.25rem', border: '1px solid var(--border)' }}>
                                    <div className="stat-icon-wrapper" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', width: '48px', height: '48px' }}>
                                        <Info size={24} />
                                    </div>
                                    <div className="content" style={{ flex: 1 }}>
                                        <span className="label" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Breed Classification</span>
                                        <span className="value high" style={{ display: 'block', fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '1rem' }}>{result.breedName}</span>
                                        <div className="confidence-wrapper">
                                            <div className="confidence-bar" style={{ height: '8px', background: 'rgba(5, 150, 105, 0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                                <div className="fill" style={{ width: result.confidence, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--primary-light))' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{result.confidence} AI Confidence</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {result.showWeight && (
                                <div className="result-item weight" style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '20px', display: 'flex', gap: '1.25rem', border: '1px solid var(--border)' }}>
                                    <div className="stat-icon-wrapper" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', width: '48px', height: '48px' }}>
                                        <Scale size={24} />
                                    </div>
                                    <div className="content">
                                        <span className="label" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Biometric Estimation</span>
                                        <span className="value" style={{ display: 'block', fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>{result.weightValue} kg</span>
                                        <span className="sub-value" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Variance: {result.weightRange}</span>
                                    </div>
                                </div>
                            )}

                            {result.isDisease && (
                                <div className="result-item disease" style={{ background: 'rgba(22, 163, 74, 0.05)', padding: '1.5rem', borderRadius: '20px', display: 'flex', gap: '1.25rem', border: '1px solid rgba(22, 163, 74, 0.1)' }}>
                                    <div className="stat-icon-wrapper" style={{ background: '#dcfce7', color: '#16a34a', width: '48px', height: '48px' }}>
                                        <Activity size={24} />
                                    </div>
                                    <div className="content">
                                        <span className="label" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Health Status</span>
                                        <span className="value" style={{ display: 'block', fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>Optimal Health</span>
                                        <span className="sub-value" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534' }}>Biometric patterns verified as normal.</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </AnimatePresence >
    );
};

export default ResultCard;
