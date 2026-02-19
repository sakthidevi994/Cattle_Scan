import React, { useState } from 'react';
import { Layers, Weight } from 'lucide-react';
import { motion } from 'framer-motion';

const DetectionOptions = ({ options, onOptionChange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="options-grid"
        >
            <div
                className={`option-card ${options.breed ? 'active' : ''}`}
                onClick={() => onOptionChange({ ...options, breed: !options.breed })}
            >
                <div className="icon-wrapper">
                    <Layers size={24} />
                </div>
                <div className="text-wrapper">
                    <h3>Identify Breed</h3>
                    <p>Detect cattle breed classification</p>
                </div>
                <div className={`toggle-switch ${options.breed ? 'on' : 'off'}`}>
                    <div className="thumb" />
                </div>
            </div>

            <div
                className={`option-card ${options.weight ? 'active' : ''}`}
                onClick={() => onOptionChange({ ...options, weight: !options.weight })}
            >
                <div className="icon-wrapper">
                    <Weight size={24} />
                </div>
                <div className="text-wrapper">
                    <h3>Estimate Weight</h3>
                    <p>Predict cattle weight range</p>
                </div>
                <div className={`toggle-switch ${options.weight ? 'on' : 'off'}`}>
                    <div className="thumb" />
                </div>
            </div>
        </motion.div>
    );
};

export default DetectionOptions;
