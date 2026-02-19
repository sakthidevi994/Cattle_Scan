import { Mail, MapPin, Phone, Building, ShieldCheck, ArrowLeft, LogOut } from 'lucide-react';

const Profile = ({ onBack }) => {
    return (
        <div className="section-container">
            <div className="section-header-nav">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                <div className="section-header-text">
                    <h1 className="section-title">User Profile</h1>
                    <p className="section-desc">Manage your account and ranch settings.</p>
                </div>
            </div>

            <div className="card form-premium-card">
                <div className="profile-hero">
                    <div className="avatar-giant">AD</div>
                    <div>
                        <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>Admin User</h2>
                        <p className="user-role" style={{ fontSize: '1.1rem' }}>Principal Ranch Manager</p>
                    </div>
                </div>

                <div className="layout-grid" style={{ gap: '3rem' }}>
                    <div className="profile-info-section">
                        <h3 className="form-section-title">Communication & Location</h3>
                        <div className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 0', borderBottom: '1px solid var(--border)' }}>
                            <div className="stat-icon-wrapper" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', width: '42px', height: '42px' }}>
                                <Mail size={20} />
                            </div>
                            <span style={{ fontWeight: 700 }}>admin@smartcattle.ai</span>
                        </div>
                        <div className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 0', borderBottom: '1px solid var(--border)' }}>
                            <div className="stat-icon-wrapper" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', width: '42px', height: '42px' }}>
                                <Phone size={20} />
                            </div>
                            <span style={{ fontWeight: 700 }}>+91 91234 56789</span>
                        </div>
                        <div className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 0', borderBottom: '1px solid var(--border)' }}>
                            <div className="stat-icon-wrapper" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', width: '42px', height: '42px' }}>
                                <Building size={20} />
                            </div>
                            <span style={{ fontWeight: 700 }}>Innova8s Global Labs</span>
                        </div>
                    </div>

                    <div className="profile-security-section">
                        <h3 className="form-section-title">Security & Access</h3>
                        <div className="card" style={{ background: 'var(--bg-main)', border: 'none', padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <ShieldCheck size={28} style={{ color: 'var(--primary)' }} />
                                <div>
                                    <h4 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>Multi-Factor Auth</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Account is currently secured with biometric verification.</p>
                                </div>
                            </div>
                        </div>
                        <button className="profile-action-btn">
                            <ShieldCheck size={18} />
                            Update Credentials
                        </button>
                        <button className="profile-action-btn danger" style={{ marginTop: '1rem' }}>
                            <LogOut size={18} />
                            Terminate Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
