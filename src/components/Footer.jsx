import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';
import innova8Logo from '../assets/innova8s_logo.png';

const Footer = () => (
    <footer className="footer container">
        <div className="footer-content">
            <div className="footer-top-row">
                <div className="model-badge">
                    <div className="badge-icon">
                        <Cpu size={14} />
                    </div>
                    <span className="badge-text">Powered by <strong>EfficientNet-B0 v2.4</strong> AI Engine</span>
                </div>
            </div>

            <div className="footer-main-row">
                <div className="footer-left">
                    <p className="copyright-text">&copy; {new Date().getFullYear()} Easy Ranch SmartCattle. All rights reserved.</p>
                    <div className="security-tag">
                        <ShieldCheck size={14} />
                        <span>Encrypted Biometric Analysis</span>
                    </div>
                </div>

                <div className="footer-right">
                    <div className="footer-logo-box innova8-brand">
                        <img
                            src={innova8Logo}
                            alt="Innova8 Global"
                            className="innova8-logo-footer"
                            onError={(e) => {
                                // If image fails, show a beautiful text-based brand
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = `
                                    <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: #0f172a; font-size: 0.9rem;">
                                        <div style="width: 24px; height: 24px; background: #059669; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white;">8</div>
                                        <span>INNOVA8s</span>
                                    </div>
                                `;
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;


