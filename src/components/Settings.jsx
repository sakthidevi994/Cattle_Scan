import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Shield, User, Globe, Database, Moon, Save, Sliders, CheckCircle, Radio, Wifi, Cpu, Link2, RefreshCw, AlertCircle, Video, Settings as SettingsIcon, Play, StopCircle } from 'lucide-react';

const Settings = ({ onBack }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [tempValue, setTempValue] = useState(75.0);
    const [rfidSettings, setRfidSettings] = useState({ type: 'handheld', port: 'COM3', status: 'disconnected' });
    const [cctvSettings, setCctvSettings] = useState({ url: 'rtsp://admin:admin123@192.168.1.55:554/live', status: 'ready' });
    const [saveStatus, setSaveStatus] = useState('');
    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/settings')
            .then(res => res.json())
            .then(data => {
                setConfig(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch settings:", err);
                setLoading(false);
            });
    }, []);

    const handleEdit = (item) => {
        if (item === 'AI Model Thresholds') {
            setEditingItem('ai_threshold');
            setTempValue(config.ai_threshold);
        } else if (item === 'RFID Configuration') {
            setEditingItem('rfid_config');
        } else if (item === 'CCTV System') {
            setEditingItem('cctv_config');
        }
    };

    const simulateTest = () => {
        setIsTesting(true);
        if (editingItem === 'rfid_config') {
            setRfidSettings({ ...rfidSettings, status: 'disconnected' });
            setTimeout(() => {
                setIsTesting(false);
                const success = Math.random() > 0.2;
                setRfidSettings({ ...rfidSettings, status: success ? 'connected' : 'disconnected' });
            }, 2000);
        } else if (editingItem === 'cctv_config') {
            setCctvSettings({ ...cctvSettings, status: 'connecting' });
            setTimeout(() => {
                setIsTesting(false);
                const success = Math.random() > 0.2;
                setCctvSettings({ ...cctvSettings, status: success ? 'live' : 'error' });
            }, 2000);
        }
    };

    const handleSave = async () => {
        setSaveStatus('saving');
        try {
            let body = {};
            if (editingItem === 'ai_threshold') {
                body = { [editingItem]: tempValue };
            } else if (editingItem === 'rfid_config') {
                body = { rfid_enabled: rfidSettings.status === 'connected' };
            } else if (editingItem === 'cctv_config') {
                body = { cctv_enabled: cctvSettings.status === 'live', cctv_url: cctvSettings.url };
            }

            const response = await fetch('http://localhost:5000/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            setConfig(data.config);
            setSaveStatus('success');
            setTimeout(() => {
                setEditingItem(null);
                setSaveStatus('');
            }, 1000);
        } catch (err) {
            console.error("Save failed:", err);
            setSaveStatus('error');
        }
    };

    const settingsGroups = [
        {
            title: 'Account & Security',
            icon: Shield,
            items: ['Profile Information', 'Password & Security', 'Two-Factor Auth']
        },
        {
            title: 'Ranch Preferences',
            icon: Database,
            items: ['CCTV System', 'RFID Configuration', 'AI Model Thresholds', 'Data Retention']
        },
        {
            title: 'System Settings',
            icon: Globe,
            items: ['Language & Region', 'Notification Preferences', 'Display Mode']
        }
    ];

    if (loading) return (
        <div className="section-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <p>Initializing System Configurations...</p>
        </div>
    );

    return (
        <div className="section-container">
            <div className="section-header-nav">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                <div className="section-header-text">
                    <h1 className="section-title">Settings</h1>
                    <p className="section-desc">Manage your AI engine and ranch automation parameters.</p>
                </div>
            </div>

            {editingItem === 'ai_threshold' ? (
                <div className="card form-premium-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="card-header-with-icon" style={{ marginBottom: '2rem' }}>
                        <div className="stat-icon-wrapper" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', width: '42px', height: '42px' }}>
                            <Sliders size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI Detection Threshold</h2>
                    </div>

                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: 600 }}>
                        Adjust the minimum confidence level required for automatic breed classification.
                        Higher values increase accuracy but may results in more "Undefined" flags.
                    </p>

                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>Core Threshold</span>
                            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.25rem' }}>{tempValue}%</span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="99"
                            value={tempValue}
                            onChange={(e) => setTempValue(parseFloat(e.target.value))}
                            className="threshold-slider"
                            style={{
                                width: '100%',
                                height: '8px',
                                borderRadius: '4px',
                                appearance: 'none',
                                background: 'var(--border)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" style={{ flex: 1, height: '54px' }} onClick={handleSave} disabled={saveStatus === 'saving'}>
                            {saveStatus === 'saving' ? 'Applying...' : saveStatus === 'success' ? <CheckCircle size={20} /> : <Save size={20} />}
                            <span>{saveStatus === 'success' ? 'Saved' : 'Apply Changes'}</span>
                        </button>
                        <button className="profile-action-btn" style={{ flex: 1, height: '54px' }} onClick={() => setEditingItem(null)}>Cancel</button>
                    </div>
                </div>
            ) : editingItem === 'rfid_config' ? (
                <div className="card form-premium-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
                    <div className="card-header-with-icon" style={{ marginBottom: '2rem' }}>
                        <div className="stat-icon-wrapper" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', width: '42px', height: '42px' }}>
                            <Radio size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>RFID Hardware Configuration</h2>
                    </div>

                    <div className="rfid-setup-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="setup-section">
                            <label style={{ display: 'block', fontWeight: 800, marginBottom: '1rem', color: 'var(--secondary)' }}>Reader Type</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div
                                    className={`tab-item ${rfidSettings.type === 'handheld' ? 'active' : ''}`}
                                    onClick={() => setRfidSettings({ ...rfidSettings, type: 'handheld', status: 'disconnected' })}
                                    style={{ border: '1.5px solid var(--border)', padding: '1.25rem' }}
                                >
                                    <RefreshCw size={18} />
                                    <span>Handheld</span>
                                </div>
                                <div
                                    className={`tab-item ${rfidSettings.type === 'static' ? 'active' : ''}`}
                                    onClick={() => setRfidSettings({ ...rfidSettings, type: 'static', status: 'disconnected' })}
                                    style={{ border: '1.5px solid var(--border)', padding: '1.25rem' }}
                                >
                                    <Wifi size={18} />
                                    <span>Fixed Gate</span>
                                </div>
                            </div>
                        </div>

                        <div className="setup-section">
                            <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--secondary)' }}>Connectivity Port (Serial/BT)</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <select
                                    className="form-input-styled"
                                    style={{ flex: 1 }}
                                    value={rfidSettings.port}
                                    onChange={(e) => setRfidSettings({ ...rfidSettings, port: e.target.value, status: 'disconnected' })}
                                >
                                    <option value="COM1">COM1 - Bluetooth Stack</option>
                                    <option value="COM3">COM3 - USB Reader A</option>
                                    <option value="192.168.1.10">IP: 192.168.1.10 (Gate)</option>
                                </select>
                                <button
                                    className="profile-action-btn"
                                    style={{ width: 'auto', background: isTesting ? 'var(--primary-glow)' : 'white' }}
                                    onClick={simulateTest}
                                    disabled={isTesting}
                                >
                                    <Link2 size={18} className={isTesting ? 'spin-anim' : ''} />
                                    <span>{isTesting ? 'Testing...' : 'Test'}</span>
                                </button>
                            </div>
                        </div>

                        <div className={`card ${rfidSettings.status === 'connected' ? 'success-card' : 'alert-card'}`} style={{
                            padding: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: rfidSettings.status === 'connected' ? '#f0fdf4' : '#fff7ed',
                            border: rfidSettings.status === 'connected' ? '1px solid #bbf7d0' : '1px solid #fed7aa'
                        }}>
                            {rfidSettings.status === 'connected' ? (
                                <CheckCircle size={20} style={{ color: '#16a34a' }} />
                            ) : (
                                <AlertCircle size={20} style={{ color: '#ea580c' }} />
                            )}
                            <div>
                                <h4 style={{ fontWeight: 800, color: rfidSettings.status === 'connected' ? '#166534' : '#9a3412', fontSize: '0.9rem' }}>
                                    {rfidSettings.status === 'connected' ? 'Hardware Synchronized' : 'Reader Offline'}
                                </h4>
                                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                    {rfidSettings.status === 'connected' ? 'Physical tags will now auto-populate identity fields.' : 'Please power on your reader or check the serial connection.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                        <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saveStatus === 'saving' || rfidSettings.status !== 'connected'}>
                            {saveStatus === 'saving' ? 'Mapping...' : <Save size={20} />}
                            <span>Save Configuration</span>
                        </button>
                        <button className="profile-action-btn" style={{ flex: 1 }} onClick={() => setEditingItem(null)}>Cancel</button>
                    </div>
                </div>
            ) : editingItem === 'cctv_config' ? (
                <div className="card form-premium-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
                    <div className="card-header-with-icon" style={{ marginBottom: '2rem' }}>
                        <div className="stat-icon-wrapper" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', width: '42px', height: '42px' }}>
                            <Video size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>CCTV Integration Hub</h2>
                    </div>

                    <div className="rfid-setup-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="setup-section">
                            <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--secondary)' }}>Network Source (RTSP / IP Camera)</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    className="form-input-styled"
                                    style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}
                                    value={cctvSettings.url}
                                    onChange={(e) => setCctvSettings({ ...cctvSettings, url: e.target.value, status: 'ready' })}
                                    placeholder="e.g. rtsp://admin:password@192.168.x.x:554"
                                />
                                <button
                                    className="profile-action-btn"
                                    style={{ width: 'auto', background: isTesting ? 'var(--primary-glow)' : 'white' }}
                                    onClick={simulateTest}
                                    disabled={isTesting}
                                >
                                    <Play size={18} className={isTesting ? 'spin-anim' : ''} />
                                    <span>{isTesting ? 'Initializing...' : 'Link Stream'}</span>
                                </button>
                            </div>
                        </div>

                        <div className={`card ${cctvSettings.status === 'live' ? 'success-card' : cctvSettings.status === 'error' ? 'alert-card' : ''}`} style={{
                            padding: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: cctvSettings.status === 'live' ? '#f0fdf4' : cctvSettings.status === 'error' ? '#fef2f2' : '#f8fafc',
                            border: cctvSettings.status === 'live' ? '1px solid #bbf7d0' : cctvSettings.status === 'error' ? '1px solid #fecaca' : '1px solid var(--border)'
                        }}>
                            {cctvSettings.status === 'live' ? (
                                <div className="status-dot active" />
                            ) : cctvSettings.status === 'error' ? (
                                <AlertCircle size={20} style={{ color: '#ef4444' }} />
                            ) : (
                                <SettingsIcon size={20} style={{ color: '#64748b' }} />
                            )}
                            <div>
                                <h4 style={{ fontWeight: 800, color: cctvSettings.status === 'live' ? '#166534' : cctvSettings.status === 'error' ? '#991b1b' : '#334155', fontSize: '0.9rem' }}>
                                    {cctvSettings.status === 'live' ? 'Neural Stream Connected' : cctvSettings.status === 'error' ? 'Handshake Failed' : 'Ready for Calibration'}
                                </h4>
                                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                    {cctvSettings.status === 'live' ? 'Frames are now being routed through the EfficientNet-B0 engine.' : cctvSettings.status === 'error' ? 'Check authentication credentials or IP stability.' : 'Link your animal farm source to enable instant remote detection.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                        <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saveStatus === 'saving' || cctvSettings.status !== 'live'}>
                            {saveStatus === 'saving' ? 'Synchronizing...' : <Save size={20} />}
                            <span>Save Stream Config</span>
                        </button>
                        <button className="profile-action-btn" style={{ flex: 1 }} onClick={() => setEditingItem(null)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="settings-grid">
                    {settingsGroups.map((group, idx) => (
                        <div key={idx} className="card">
                            <div className="card-header-with-icon" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div className="stat-icon-wrapper" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '14px' }}>
                                    <group.icon size={22} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{group.title}</h3>
                            </div>
                            <div className="settings-items-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {group.items.map((item, i) => (
                                    <button
                                        key={i}
                                        className="settings-button"
                                        onClick={() => handleEdit(item)}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{item}</span>
                                            {item === 'AI Model Thresholds' && config && (
                                                <small style={{ color: 'var(--primary)', fontWeight: 800 }}>Current: {config.ai_threshold}%</small>
                                            )}
                                            {item === 'RFID Configuration' && config && (
                                                <small style={{ color: config.rfid_enabled ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 800 }}>
                                                    {config.rfid_enabled ? '● Hardware Active' : '○ Standalone Mode'}
                                                </small>
                                            )}
                                            {item === 'CCTV System' && config && (
                                                <small style={{ color: config.cctv_enabled ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 800 }}>
                                                    {config.cctv_enabled ? '● Neural Stream LIVE' : '○ Local Analysis Only'}
                                                </small>
                                            )}
                                        </div>
                                        <ArrowLeft size={16} style={{ transform: 'rotate(180deg)', color: 'var(--primary)' }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Settings;
