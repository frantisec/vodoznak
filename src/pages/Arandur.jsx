import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import WatermarkEditor from '../components/WatermarkEditor';

const Arandur = () => {
    const [baseImage, setBaseImage] = useState(null);
    const [textColor, setTextColor] = useState('white'); // 'white' or 'black'
    const [isDragging, setIsDragging] = useState(false);
    const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const watermarkEditorRef = useRef(null);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => setBaseImage(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    return (
        <div className="arandur-page">
            <div className="arandur-content">
                <h1 className="arandur-title">Arandur mode</h1>
                {!baseImage ? (
                    <>
                        <p className="arandur-subtitle">Upload your photo to apply the Arandur watermark</p>
                        <div 
                            className={`arandur-upload-area ${isDragging ? 'dragging' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="arandur-upload-icon-wrapper">
                                <img 
                                    src="/15a4dc5914012170b21bf9b543a9372df5315262.svg" 
                                    alt="Upload" 
                                    className="arandur-upload-icon-svg"
                                />
                            </div>
                            <div className="arandur-upload-text">Upload Photo</div>
                            <div className="arandur-upload-hint">Click to select or drag & drop</div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileInputChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <Link to="/" className="arandur-back">← back to standard mode</Link>
                    </>
                ) : (
                    <>
                        <div className="arandur-editor-controls">
                            <div className="arandur-text-color-controls">
                                <span className="arandur-text-color-label">Text color:</span>
                                <div className="arandur-radio-group">
                                    <label className="arandur-radio">
                                        <input
                                            type="radio"
                                            name="textColor"
                                            value="white"
                                            checked={textColor === 'white'}
                                            onChange={(e) => setTextColor(e.target.value)}
                                        />
                                        <span className="arandur-radio-label">White</span>
                                    </label>
                                    <label className="arandur-radio">
                                        <input
                                            type="radio"
                                            name="textColor"
                                            value="black"
                                            checked={textColor === 'black'}
                                            onChange={(e) => setTextColor(e.target.value)}
                                        />
                                        <span className="arandur-radio-label">Black</span>
                                    </label>
                                </div>
                            </div>
                            <div className="arandur-action-buttons">
                                <button
                                    className="arandur-btn-change-photo"
                                    onClick={() => {
                                        setBaseImage(null);
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    Change photo
                                </button>
                                <button 
                                    className="arandur-btn-download" 
                                    onClick={() => {
                                        watermarkEditorRef.current?.download(() => {
                                            setShowDownloadSuccess(true);
                                            setTimeout(() => setShowDownloadSuccess(false), 3000);
                                        });
                                    }}
                                >
                                    <img src="/28d0be06076ead6985630d8c1f1575db30e9784a.svg" alt="Download" className="arandur-download-icon" />
                                    Download result
                                </button>
                                {showDownloadSuccess && (
                                    <div className="arandur-download-success">
                                        ✓ Soubor byl stažen
                                    </div>
                                )}
                            </div>
                        </div>
                        <WatermarkEditor
                            ref={watermarkEditorRef}
                            baseImage={baseImage}
                            textColor={textColor}
                            onReset={() => setBaseImage(null)}
                        />
                        <Link to="/" className="arandur-back">← back to standard mode</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Arandur;
