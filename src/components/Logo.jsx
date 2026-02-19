import React from 'react';
import logoImg from '../assets/logo_easyranch.png';

const Logo = ({ className, size = 48, src }) => {
    return (
        <div
            className={`logo-container ${className || ''}`}
            style={{
                width: size,
                height: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            <img
                src={src || logoImg}
                alt="Logo"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }}
                onError={(e) => {
                    // Fallback to a simple icon or Easy Ranch logo if image fails
                    if (src) e.target.src = logoImg;
                }}
            />
        </div>
    );
};

export default Logo;
