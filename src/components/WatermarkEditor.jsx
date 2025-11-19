import React, { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';

const WatermarkEditor = ({ baseImage, watermarkImage, onReset }) => {
    const [watermarkState, setWatermarkState] = useState({
        width: 200,
        height: 200,
        x: 0,
        y: 0,
    });

    const baseImageRef = useRef(null);

    const handleDownload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const baseImg = baseImageRef.current;

        if (!baseImg) return;

        // Set canvas size to match the natural size of the base image
        canvas.width = baseImg.naturalWidth;
        canvas.height = baseImg.naturalHeight;

        // Draw base image
        ctx.drawImage(baseImg, 0, 0);

        if (watermarkImage) {
            const wmImg = new Image();
            wmImg.crossOrigin = "anonymous";
            wmImg.src = watermarkImage;

            wmImg.onload = () => {
                // Calculate scale factor between displayed image and natural image
                const scale = baseImg.naturalWidth / baseImg.offsetWidth;

                // Calculate watermark position and size on the canvas
                const wmX = watermarkState.x * scale;
                const wmY = watermarkState.y * scale;
                const wmW = watermarkState.width * scale;
                const wmH = watermarkState.height * scale;

                ctx.drawImage(wmImg, wmX, wmY, wmW, wmH);

                // Trigger download
                const link = document.createElement('a');
                link.download = 'watermarked-image.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
        } else {
            // Just base image
            const link = document.createElement('a');
            link.download = 'image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    return (
        <div className="container">
            <div className="controls">
                <button className="btn btn-secondary" onClick={onReset}>Change Base Image</button>
                <button className="btn" onClick={handleDownload}>Download Result</button>
            </div>

            <div className="editor-workspace" style={{ display: 'inline-block' }}>
                <img
                    ref={baseImageRef}
                    src={baseImage}
                    alt="Base"
                    className="base-image"
                    draggable={false}
                />

                {watermarkImage && (
                    <Rnd
                        size={{ width: watermarkState.width, height: watermarkState.height }}
                        position={{ x: watermarkState.x, y: watermarkState.y }}
                        onDragStop={(e, d) => {
                            setWatermarkState(prev => ({ ...prev, x: d.x, y: d.y }));
                        }}
                        onResizeStop={(e, direction, ref, delta, position) => {
                            setWatermarkState({
                                width: parseInt(ref.style.width),
                                height: parseInt(ref.style.height),
                                ...position,
                            });
                        }}
                        bounds="parent"
                        lockAspectRatio={true}
                        style={{
                            border: '2px dashed #38bdf8',
                            cursor: 'move',
                            backgroundImage: `url(${watermarkImage})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default WatermarkEditor;
