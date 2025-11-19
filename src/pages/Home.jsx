import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import WatermarkEditor from '../components/WatermarkEditor';

const Home = () => {
    const [baseImage, setBaseImage] = useState(null);
    const [watermarkImage, setWatermarkImage] = useState(null);

    return (
        <>
            <h1>Watermark Pro</h1>

            {!baseImage ? (
                <div className="container">
                    <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Upload your main photo to start</p>
                    <ImageUploader onUpload={setBaseImage} label="Upload Photo" />
                    <div style={{ marginTop: '2rem' }}>
                        <Link to="/arandur" style={{ color: '#38bdf8', textDecoration: 'none' }}>Go to Arandur Mode &rarr;</Link>
                    </div>
                </div>
            ) : (
                <div className="container">
                    {!watermarkImage ? (
                        <div className="container">
                            <div className="editor-workspace">
                                <img src={baseImage} alt="Preview" className="base-image" style={{ maxHeight: '400px' }} />
                            </div>
                            <p style={{ color: '#94a3b8', margin: '1rem 0' }}>Now upload your watermark</p>
                            <ImageUploader onUpload={setWatermarkImage} label="Upload Watermark (PNG/SVG)" accept="image/png, image/svg+xml, image/jpeg" />
                            <button className="btn btn-secondary" onClick={() => setBaseImage(null)} style={{ marginTop: '1rem' }}>Back</button>
                        </div>
                    ) : (
                        <WatermarkEditor
                            baseImage={baseImage}
                            watermarkImage={watermarkImage}
                            onReset={() => {
                                setBaseImage(null);
                                setWatermarkImage(null);
                            }}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default Home;
