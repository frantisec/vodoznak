import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Rnd } from 'react-rnd';

const WatermarkEditor = forwardRef(({ baseImage, textColor, onReset }, ref) => {
    const [watermarkState, setWatermarkState] = useState({
        width: 514,
        height: 211,
        x: 0,
        y: 0,
    });

    const baseImageRef = useRef(null);
    const watermarkRef = useRef(null);

    useEffect(() => {
        // Initialize watermark position to bottom-left after image loads
        const updatePosition = () => {
            if (baseImageRef.current) {
                const imgHeight = baseImageRef.current.offsetHeight;
                setWatermarkState(prev => ({
                    ...prev,
                    x: 24,
                    y: Math.max(0, imgHeight - prev.height - 24),
                }));
            }
        };
        
        if (baseImageRef.current) {
            if (baseImageRef.current.complete) {
                updatePosition();
            } else {
                baseImageRef.current.onload = updatePosition;
            }
        }
    }, [baseImage]);

    const handleDownload = (onSuccess) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const baseImg = baseImageRef.current;

        if (!baseImg) return;

        // Set canvas size to match the natural size of the base image
        canvas.width = baseImg.naturalWidth;
        canvas.height = baseImg.naturalHeight;

        // Draw base image
        ctx.drawImage(baseImg, 0, 0);

        // Calculate scale factor between displayed image and natural image
        const scale = baseImg.naturalWidth / baseImg.offsetWidth;

        // Calculate actual content size (without padding) - this is what's displayed on screen
        const contentWidth = watermarkState.width - 48; // 24px padding on each side
        const contentHeight = watermarkState.height - 48;
        
        // Calculate scale factor for watermark content (how much it's scaled from original)
        const contentScaleX = contentWidth / 514;
        const contentScaleY = contentHeight / 211;

        // Calculate watermark position and size on the canvas (accounting for padding)
        // Position includes padding offset
        const wmX = (watermarkState.x + 24) * scale;
        const wmY = (watermarkState.y + 24) * scale;
        // Size is the actual displayed content size scaled to natural image size
        const wmW = contentWidth * scale;
        const wmH = contentHeight * scale;

        // Create a temporary canvas for the watermark with original size
        // We'll scale it when drawing to match the displayed size
        const watermarkCanvas = document.createElement('canvas');
        watermarkCanvas.width = 514;
        watermarkCanvas.height = 211;
        const wmCtx = watermarkCanvas.getContext('2d');

        // Set text color
        const textColorValue = textColor === 'white' ? '#ffffff' : '#222222';
        wmCtx.fillStyle = textColorValue;
        
        // Load and draw icon
        const iconImg = new Image();
        iconImg.crossOrigin = "anonymous";
        iconImg.src = '/b3f3659a713d98b15ed8366954ed297c9b866f6f.png';
        
        iconImg.onload = () => {
            // Draw icon (scaled to 514x211 dimensions)
            const iconWidth = 106.7;
            const iconHeight = 140.4;
            wmCtx.drawImage(iconImg, 0, 22.1, iconWidth, iconHeight);
            
            // Load and draw stars
            const starImg = new Image();
            starImg.crossOrigin = "anonymous";
            starImg.src = '/921604d5824bdc5a07796a06d6a8af6897dbca4d.png';
            
            starImg.onload = () => {
                // Draw stars (scaled to 514x211 dimensions)
                const starSize = 21.6;
                wmCtx.drawImage(starImg, 40.9, 0, starSize, starSize);
                wmCtx.drawImage(starImg, 76.0, 20.8, starSize, starSize);
                wmCtx.drawImage(starImg, 4.9, 20.8, starSize, starSize);
                
                // Wait for font to load
                document.fonts.ready.then(() => {
                    // Set font and draw "Arandur" text (scaled to 514x211 dimensions)
                    wmCtx.font = '106.7px "Grenze Gotisch", serif';
                    wmCtx.textBaseline = 'top';
                    wmCtx.textAlign = 'left';
                    wmCtx.fillText('Arandur', 106.7, 23.9);
                    
                    // Draw ".cz" text (scaled to 514x211 dimensions)
                    wmCtx.font = '35.1px "Grenze Gotisch", serif';
                    wmCtx.fillText('.cz', 419.1, 116.7);
                    
                    // Draw the watermark on the main canvas with proper scaling
                    ctx.drawImage(watermarkCanvas, wmX, wmY, wmW, wmH);
                    
                    // Trigger download
                    const link = document.createElement('a');
                    link.download = 'watermarked-image.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    
                    // Call success callback if provided
                    if (onSuccess) {
                        setTimeout(() => onSuccess(), 100);
                    }
                }).catch(() => {
                    // Fallback if font loading fails
                    // Set font and draw "Arandur" text (scaled to 514x211 dimensions)
                    wmCtx.font = '106.7px serif';
                    wmCtx.textBaseline = 'top';
                    wmCtx.textAlign = 'left';
                    wmCtx.fillText('Arandur', 106.7, 23.9);
                    
                    // Draw ".cz" text (scaled to 514x211 dimensions)
                    wmCtx.font = '35.1px serif';
                    wmCtx.fillText('.cz', 419.1, 116.7);
                    
                    // Draw the watermark on the main canvas with proper scaling
                    ctx.drawImage(watermarkCanvas, wmX, wmY, wmW, wmH);
                    
                    // Trigger download
                    const link = document.createElement('a');
                    link.download = 'watermarked-image.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    
                    // Call success callback if provided
                    if (onSuccess) {
                        setTimeout(() => onSuccess(), 100);
                    }
                });
            };
        };
    };

    // Expose download handler to parent
    useImperativeHandle(ref, () => ({
        download: (onSuccess) => {
            handleDownload(onSuccess);
        }
    }));

    return (
        <div className="arandur-editor-workspace">
                <img
                    ref={baseImageRef}
                    src={baseImage}
                    alt="Base"
                    className="arandur-base-image"
                    draggable={false}
                />
                <button className="arandur-close-btn" onClick={onReset}>
                    <img src="/8d4799bd3dd556197355afce189584e4bee6ab4b.svg" alt="Close" />
                </button>
                <Rnd
                    size={{ width: watermarkState.width, height: watermarkState.height }}
                    position={{ x: watermarkState.x, y: watermarkState.y }}
                    defaultSize={{ width: watermarkState.width, height: watermarkState.height }}
                    defaultPosition={{ x: watermarkState.x, y: watermarkState.y }}
                    onDragStop={(e, d) => {
                        setWatermarkState(prev => ({ ...prev, x: d.x, y: d.y }));
                    }}
                    onResize={(e, direction, ref, delta, position) => {
                        const width = ref.offsetWidth;
                        const height = ref.offsetHeight;
                        setWatermarkState(prev => ({
                            ...prev,
                            width,
                            height,
                            x: position.x,
                            y: position.y,
                        }));
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        const width = ref.offsetWidth;
                        const height = ref.offsetHeight;
                        setWatermarkState({
                            width,
                            height,
                            x: position.x,
                            y: position.y,
                        });
                    }}
                    bounds="parent"
                    lockAspectRatio={514 / 211}
                    minWidth={200}
                    minHeight={Math.round(200 * (211 / 514))}
                    resizeHandleClasses={{
                        top: 'arandur-resize-handle-top',
                        right: 'arandur-resize-handle-right',
                        bottom: 'arandur-resize-handle-bottom',
                        left: 'arandur-resize-handle-left',
                        topRight: 'arandur-resize-handle-top-right',
                        bottomRight: 'arandur-resize-handle-bottom-right',
                        bottomLeft: 'arandur-resize-handle-bottom-left',
                        topLeft: 'arandur-resize-handle-top-left',
                    }}
                    style={{
                        border: '3px dashed #00fff2',
                        cursor: 'move',
                        padding: '24px',
                        boxSizing: 'border-box',
                        zIndex: 1,
                    }}
                >
                    <div 
                        ref={watermarkRef} 
                        className={`arandur-watermark-content arandur-watermark-${textColor}`}
                        style={{ 
                            color: textColor === 'white' ? '#ffffff' : '#222222',
                            transform: `scale(${(watermarkState.width - 48) / 514}, ${(watermarkState.height - 48) / 211})`,
                            transformOrigin: 'top left',
                            width: '514px',
                            height: '211px',
                        }}
                    >
                        <div className="arandur-watermark-icon-wrapper">
                            <img src="/b3f3659a713d98b15ed8366954ed297c9b866f6f.png" alt="Arandur icon" className="arandur-watermark-icon" />
                            <img src="/921604d5824bdc5a07796a06d6a8af6897dbca4d.png" alt="Star" className="arandur-watermark-star star-1" />
                            <img src="/921604d5824bdc5a07796a06d6a8af6897dbca4d.png" alt="Star" className="arandur-watermark-star star-2" />
                            <img src="/921604d5824bdc5a07796a06d6a8af6897dbca4d.png" alt="Star" className="arandur-watermark-star star-3" />
                        </div>
                        <div className="arandur-watermark-text">
                            <span className="arandur-watermark-text-main">Arandur</span>
                            <span className="arandur-watermark-text-domain">.cz</span>
                        </div>
                    </div>
                </Rnd>
            </div>
    );
});

WatermarkEditor.displayName = 'WatermarkEditor';

export default WatermarkEditor;
