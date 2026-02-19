import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const UploadSection = ({ onImageUpload }) => {
    const [preview, setPreview] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            const imgUrl = URL.createObjectURL(file);
            setPreview(imgUrl);
            onImageUpload(file);
        }
    }, [onImageUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    const removeImage = (e) => {
        e.stopPropagation();
        setPreview(null);
        onImageUpload(null);
    }

    return (
        <div className="upload-container">
            <div
                {...getRootProps()}
                className={`upload-box ${isDragActive ? 'active' : ''} ${preview ? 'has-preview' : ''}`}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="preview-wrapper"
                    >
                        <img src={preview} alt="Upload Preview" className="preview-image" />
                        <div className="upload-success">
                            <CheckCircle size={48} className="success-icon" />
                            <p>Image Uploaded Successfully</p>
                        </div>
                        <button className="remove-btn" onClick={removeImage}>
                            <X size={20} />
                        </button>
                    </motion.div>
                ) : (
                    <div className="upload-placeholder">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <Upload size={64} className="upload-icon" />
                        </motion.div>
                        <h3>Drag & Drop Cattle Image Here</h3>
                        <p>or click to browse files</p>
                        <p className="upload-hint">Supports: JPG, PNG, WEBP</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadSection;
