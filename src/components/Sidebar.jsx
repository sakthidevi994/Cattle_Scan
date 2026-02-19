import {
    LayoutDashboard,
    PlusCircle,
    History as HistoryIcon,
    Search,
    Weight,
    Activity,
    User,
    Settings,
    X
} from 'lucide-react';
import Logo from './Logo';

const Sidebar = ({ activeSection, setActiveSection, isOpen, setIsOpen }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'history', label: 'Herd Gallery', icon: HistoryIcon },
        { id: 'scanning', label: 'Breed Scan', icon: Search },
        { id: 'weight', label: 'Weight Tracking', icon: Weight },
        { id: 'diseases', label: 'Disease Analysis', icon: Activity },
        { id: 'register', label: 'Cow Registering', icon: PlusCircle },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-section-sidebar" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Logo size={54} />
                        <div className="logo-text-group">
                            <h1 className="logo-text-sidebar">Easy Ranch</h1>
                            <span className="logo-subtext">AI SmartCattle</span>
                        </div>
                    </div>
                </div>

                <nav className="nav-section">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveSection(item.id);
                                if (window.innerWidth <= 1024) setIsOpen(false);
                            }}
                        >
                            <item.icon className="nav-icon" size={22} />
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button
                        className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveSection('settings')}
                    >
                        <Settings className="nav-icon" size={22} />
                        <span className="nav-label">System Config</span>
                    </button>

                    <div className="user-brief">
                        <div className="user-avatar">AD</div>
                        <div className="user-info">
                            <span className="user-name">Admin User</span>
                            <span className="user-role">Lead Rancher</span>
                        </div>
                    </div>
                </div>

                <button className="close-sidebar" onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--bg-main)', border: 'none', padding: '0.5rem', borderRadius: '10px', display: window.innerWidth <= 1024 ? 'flex' : 'none' }}>
                    <X size={20} />
                </button>
            </aside>

            <div
                className="sidebar-backdrop"
                onClick={() => setIsOpen(false)}
            />
        </>
    );
};

export default Sidebar;
