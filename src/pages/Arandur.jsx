import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import WatermarkEditor from '../components/WatermarkEditor';

const Arandur = () => {
    const [baseImage, setBaseImage] = useState(null);
    const [watermarkType, setWatermarkType] = useState('light'); // 'light' or 'dark'

    const watermarkImage = watermarkType === 'light' ? 'arandur-light.png' : 'arandur-dark.png';

    return (
        <>
            <h1>Arandur Mode</h1>

            {!baseImage ? (
                <div className="container">
                    <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Upload your photo to apply the Arandur watermark</p>
                    <ImageUploader onUpload={setBaseImage} label="Upload Photo" />
                    <div style={{ marginTop: '2rem' }}>
                        <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none' }}>&larr; Back to Standard Mode</Link>
                    </div>
                </div>
            ) : (
                <div className="container">
                    <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                        <button
                            className={`btn ${watermarkType === 'light' ? '' : 'btn-secondary'}`}
                            onClick={() => setWatermarkType('light')}
                        >
                            Light Watermark
                        </button>
                        <button
                            className={`btn ${watermarkType === 'dark' ? '' : 'btn-secondary'}`}
                            onClick={() => setWatermarkType('dark')}
                        >
                            Dark Watermark
                        </button>
                    </div>

                    <WatermarkEditor
                        baseImage={baseImage}
                        watermarkImage={watermarkImage}
                        onReset={() => {
                            setBaseImage(null);
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default Arandur;
