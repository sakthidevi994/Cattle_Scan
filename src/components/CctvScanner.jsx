import React, { useRef, useState, useEffect } from 'react';
import { Camera, Video, VideoOff, RefreshCw, Maximize2, ShieldCheck, Repeat } from 'lucide-react';

const CctvScanner = ({ onCapture, remoteConfig }) => {
    const videoRef = useRef(null);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    const [streamActive, setStreamActive] = useState(false);
    const [error, setError] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [facingMode, setFacingMode] = useState('environment');
    const [devices, setDevices] = useState([]);
    const [currentDeviceIdx, setCurrentDeviceIdx] = useState(0);

    const isRemote = remoteConfig?.cctv_enabled;

    useEffect(() => {
        if (isRemote) {
            setStreamActive(true);
        } else {
            startStream();
            getDevices();
        }
        return () => stopStream();
    }, [facingMode, currentDeviceIdx, isRemote]);

    const getDevices = async () => {
        if (isRemote) return;
        try {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
        } catch (err) {
            console.error("Error listing cameras:", err);
        }
    };

    const startStream = async () => {
        if (isRemote) return;
        try {
            setError(null);
            stopStream(); // Clear existing

            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStreamActive(true);
            }
        } catch (err) {
            console.error("CCTV Stream Error:", err);
            setError("Could not access camera. Ensure hardware permissions are granted.");
            setStreamActive(false);
        }
    };

    const stopStream = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (!isRemote) setStreamActive(false);
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    const captureFrame = () => {
        const source = isRemote ? imgRef.current : videoRef.current;
        if (!source || !canvasRef.current) return;

        setIsCapturing(true);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (isRemote) {
            canvas.width = source.naturalWidth || 1280;
            canvas.height = source.naturalHeight || 720;
        } else {
            canvas.width = source.videoWidth;
            canvas.height = source.videoHeight;
        }

        context.drawImage(source, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const file = new File([blob], `cctv_capture_${Date.now()}.jpg`, { type: "image/jpeg" });
            onCapture(file);
            setIsCapturing(false);
        }, 'image/jpeg', 0.95);
    };

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <div className="cctv-container card">
            <div className="cctv-header">
                <div className="stream-status">
                    <div className={`status-dot ${streamActive ? 'active' : ''}`} />
                    <span>
                        {streamActive
                            ? (isRemote ? 'LIVE: REMOTE FARM FEED' : (isMobile ? 'LINK: MOBILE OPTICAL LENS' : 'LIVE: LOCAL SYSTEM FEED'))
                            : 'STREAM OFFLINE'}
                    </span>
                </div>
                <div className="cctv-controls">
                    {!isRemote && (isMobile || devices.length > 1) && (
                        <button className="cctv-btn" onClick={toggleCamera} title="Switch camera source">
                            <Repeat size={18} />
                        </button>
                    )}
                    <button className="cctv-btn" onClick={() => streamActive ? stopStream() : startStream()}>
                        {streamActive ? <VideoOff size={18} /> : <Video size={18} />}
                    </button>
                </div>
            </div>

            <div className="cctv-viewport">
                {streamActive ? (
                    <>
                        {isRemote ? (
                            <img
                                ref={imgRef}
                                src="http://localhost:5000/video_feed"
                                alt="Remote Farm CCTV"
                                className="cctv-feed"
                                style={{ width: '100%', display: 'block' }}
                                crossOrigin="anonymous"
                            />
                        ) : (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="cctv-feed"
                            />
                        )}
                        <div className="cctv-overlay">
                            <div className="corner top-left" />
                            <div className="corner top-right" />
                            <div className="corner bottom-left" />
                            <div className="corner bottom-right" />
                            <div className="scan-line" />

                            <div className="ai-tracker-box">
                                <div className="tracking-label">AI_DETECT_{isRemote ? 'RTSP_IP_SOURCE' : (isMobile ? 'MOBILE_SOURCE' : 'LOCAL_FEED')}</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="cctv-placeholder">
                        {error ? (
                            <div className="error-msg">
                                <VideoOff size={48} />
                                <p style={{ marginTop: '1rem', fontWeight: 800 }}>{error}</p>
                                <button className="btn-primary" onClick={startStream} style={{ marginTop: '1rem' }}>
                                    Retry Connection
                                </button>
                            </div>
                        ) : (
                            <div className="loading-feed">
                                <RefreshCw className="spin-anim" size={48} />
                                <p style={{ marginTop: '1rem', fontWeight: 800 }}>Syncing Neural Link...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div className="cctv-footer">
                <div className="security-tag" style={{ border: 'none', padding: 0 }}>
                    <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Neural Network Linked</span>
                </div>
                <button
                    className="btn-primary capture-btn"
                    onClick={captureFrame}
                    disabled={!streamActive || isCapturing}
                >
                    <Camera size={20} />
                    <span>{isCapturing ? 'Processing...' : 'Analyze Instant Frame'}</span>
                </button>
            </div>
        </div>
    );
};

export default CctvScanner;
