import React, { useRef } from 'react';
import { X, Download, Tag, Weight, Activity, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Logo from './Logo';

const CowDetailsModal = ({ cow, onClose }) => {
    const reportRef = useRef();

    const exportPDF = async () => {
        const element = reportRef.current;

        // Create a temporary watermark overlay
        const watermark = document.createElement('div');
        watermark.innerText = 'EASY RANCH - SMARTCATTLE AI';
        watermark.style.position = 'absolute';
        watermark.style.top = '50%';
        watermark.style.left = '50%';
        watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
        watermark.style.fontSize = '40px';
        watermark.style.color = 'rgba(22, 163, 74, 0.08)';
        watermark.style.fontFamily = 'Inter, sans-serif';
        watermark.style.fontWeight = 'bold';
        watermark.style.pointerEvents = 'none';
        watermark.style.zIndex = '0';
        watermark.style.whiteSpace = 'nowrap';

        element.appendChild(watermark);

        // Styling for clean PDF capture
        const originalScrollTop = element.scrollTop;
        const originalWidth = element.style.width;

        try {
            // Force temporary desktop-like width for high-res PDF layout
            element.style.width = '1050px';

            const canvas = await html2canvas(element, {
                scale: 2.5, // High resolution
                useCORS: true,
                backgroundColor: '#ffffff',
                windowWidth: 1050,
                scrollX: 0,
                scrollY: -window.scrollY
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const margin = 12; // 12mm margins
            const contentWidth = pdfWidth - (margin * 2);
            const contentHeight = (canvas.height * contentWidth) / canvas.width;

            // Handle multi-page if content is too long for one A4
            let heightLeft = contentHeight;
            let position = margin;

            pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
            heightLeft -= (pdfHeight - margin * 2);

            while (heightLeft >= 0) {
                position = heightLeft - contentHeight + margin;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`cow_report_${cow.id}_${cow.name || 'animal'}.pdf`);
        } catch (err) {
            console.error('PDF Generation Error:', err);
            alert('Failed to generate high-fidelity PDF');
        } finally {
            element.style.width = originalWidth;
            element.scrollTop = originalScrollTop;
            element.removeChild(watermark);
        }
    };

    if (!cow) return null;

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Animal Report</h2>
                    <div className="modal-actions">
                        <button className="btn-icon" onClick={exportPDF} title="Export as PDF">
                            <Download size={20} />
                        </button>
                        <button className="btn-icon" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="report-container" ref={reportRef}>
                    {/* PDF Brand Header */}
                    <div className="report-brand">
                        <div className="report-logo">
                            <Logo size={60} />
                            <span>Easy Ranch - SmartCattle AI</span>
                        </div>
                        <div className="report-date">Report Date: {new Date().toLocaleDateString()}</div>
                    </div>

                    <div className="report-layout">
                        <div className="report-image-side">
                            {cow.imageUrl ? (
                                <img src={cow.imageUrl} alt={cow.name} className="report-cow-img" />
                            ) : (
                                <div className="report-cow-placeholder">
                                    <Activity size={64} />
                                    <p>Photo not available</p>
                                </div>
                            )}
                        </div>

                        <div className="report-info-side">
                            <div className="report-section">
                                <h3>Primary Information</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Name/ID</span>
                                        <span className="info-value">{cow.name || cow.id}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Breed Identification</span>
                                        <span className="info-value breed-highlight">{cow.breed}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Confidence Score</span>
                                        <span className="info-value">{cow.confidence || 'Manual entry'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="report-section">
                                <h3>Vitals & Assessment</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Estimated Weight</span>
                                        <span className="info-value">{cow.weight}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Health Status</span>
                                        <span className={`info-value status-${cow.status?.toLowerCase().replace(' ', '-') || 'healthy'}`}>
                                            {cow.status || 'Healthy'}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Age (Approx)</span>
                                        <span className="info-value">{cow.age || 'N/A'} years</span>
                                    </div>
                                </div>
                            </div>

                            <div className="report-section">
                                <h3>Tracking Details</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">RFID / Tag</span>
                                        <span className="info-value">{cow.rfid || 'Unassigned'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Registration Date</span>
                                        <span className="info-value">{cow.date}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Location</span>
                                        <span className="info-value">Innova8s Farm - Sector 4</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="report-footer">
                        <div className="security-verified">
                            <ShieldCheck size={16} />
                            <span>AI Analysis Verified by SmartCattle Engine v2.0</span>
                        </div>
                        <p className="confidential-text">This report contains confidential agricultural asset data.</p>
                    </div>
                </div>

                <div className="modal-footer-btns">
                    <button className="btn-primary w-full" onClick={exportPDF}>
                        <Download size={18} />
                        Download PDF Report
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CowDetailsModal;
