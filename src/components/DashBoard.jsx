import React from 'react';
import {
    Users,
    Activity,
    AlertTriangle,
    TrendingUp,
    Heart
} from 'lucide-react';

const DashBoard = ({ setActiveSection, herd }) => {
    const total = herd.length;
    const healthyCount = herd.filter(c => c.status === 'Healthy').length;
    const attentionCount = total - healthyCount;
    const healthyPercent = total > 0 ? (healthyCount / total) * 100 : 0;

    const avgWeight = total > 0
        ? Math.round(herd.reduce((acc, c) => acc + (typeof c.weightValue === 'number' ? c.weightValue : parseInt(c.weight || 0)), 0) / total)
        : 0;

    const stats = [
        { label: 'Total Herd', value: total.toString(), icon: Users, color: '#16a34a' },
        { label: 'Healthy', value: healthyCount.toString(), icon: Activity, color: '#16a34a' },
        { label: 'Sick / Alert', value: attentionCount.toString(), icon: AlertTriangle, color: '#ef4444' },
        { label: 'Avg. Weight', value: `${avgWeight} kg`, icon: TrendingUp, color: '#2563eb' },
    ];

    return (
        <div className="section-container">
            <div className="section-header">
                <h1 className="section-title">Dashboard</h1>
                <p className="section-desc">Overview of your ranch operations and herd status.</p>
            </div>

            <div className="dashboard-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="card stat-card">
                        <div className="stat-icon-wrapper" style={{ background: `${stat.color}15`, color: stat.color }}>
                            <stat.icon size={30} strokeWidth={2.5} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">{stat.label}</p>
                            <h3 className="stat-value">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="layout-grid">
                <div className="card health-analysis-card">
                    <div className="card-header-with-icon" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="stat-icon-wrapper" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', width: '50px', height: '50px', borderRadius: '15px' }}>
                            <Heart size={24} />
                        </div>
                        <div>
                            <h3 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>Herd Vitality</h3>
                            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Real-time health distribution</p>
                        </div>
                    </div>

                    <div className="health-chart-container" style={{ display: 'flex', alignItems: 'center', gap: '3rem', padding: '1rem' }}>
                        <div className="donut-chart" style={{ width: '160px', height: '160px', position: 'relative' }}>
                            <svg viewBox="0 0 36 36" className="circular-chart" style={{ transform: 'rotate(-90deg)' }}>
                                <path className="circle-bg"
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    stroke="#f1f5f9"
                                    strokeWidth="3.5"
                                    fill="none"
                                />
                                <path className="circle"
                                    strokeDasharray={`${healthyPercent}, 100`}
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    stroke="var(--primary)"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
                                {Math.round(healthyPercent)}%
                            </div>
                        </div>
                        <div className="chart-legend" style={{ flex: 1 }}>
                            <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <span className="dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }}></span>
                                <span className="label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Healthy Assets ({healthyCount})</span>
                            </div>
                            <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <span className="dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
                                <span className="label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Bio-Alerts ({attentionCount})</span>
                            </div>
                            <div className="analysis-indicator" style={{ background: healthyPercent > 80 ? '#f0fdf4' : '#fef2f2', padding: '1rem', borderRadius: '16px', border: `1px solid ${healthyPercent > 80 ? '#dcfce7' : '#fee2e2'}` }}>
                                <p style={{ fontWeight: 800, color: healthyPercent > 80 ? '#166534' : '#991b1b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                    {healthyPercent > 80 ? "Condition: Optimal" : "Condition: Critical"}
                                </p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontWeight: 600 }}>
                                    {healthyPercent > 80 ? "Productivity targets are currently being met." : "Immediate veterinary intervention recommended."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-actions-group" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card action-card-horizontal" onClick={() => setActiveSection('scanning')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white' }}>
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Breed & Weight AI</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Biometric vision analysis</p>
                        </div>
                        <button className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>Launch Scanner</button>
                    </div>

                    <div className="card action-card-horizontal" onClick={() => setActiveSection('register')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white' }}>
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Asset Registration</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Expand ranch database</p>
                        </div>
                        <button className="btn-outline" style={{ background: 'var(--secondary)', color: 'white', border: 'none', padding: '0.8rem 1.5rem' }}>Register Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
