import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Rnd } from 'react-rnd';

const WatermarkEditor = forwardRef(({ baseImage, watermarkImage, textColor, onReset }, ref) => {
    const [watermarkState, setWatermarkState] = useState({
        width: 400,
        height: 164,
        x: 0,
        y: 0,
    });
    const [watermarkAspectRatio, setWatermarkAspectRatio] = useState(400 / 164);

    const baseImageRef = useRef(null);
    const watermarkRef = useRef(null);
    const watermarkImageRef = useRef(watermarkImage);
    const positionInitializedRef = useRef(false);
    
    // Determine the watermark source - either uploaded or Arandur PNG
    const arandurWatermarkSrc = textColor === 'white' 
        ? '/arandur-light.png' 
        : '/arandur-dark.png';
    
    const currentWatermarkSrc = watermarkImage || arandurWatermarkSrc;
    
    // Keep ref in sync with prop
    useEffect(() => {
        watermarkImageRef.current = watermarkImage;
    }, [watermarkImage]);

    // Load watermark image dimensions when watermark source changes
    useEffect(() => {
        positionInitializedRef.current = false; // Reset flag when watermark changes
        
        const img = new Image();
        img.onload = () => {
            const aspectRatio = img.width / img.height;
            setWatermarkAspectRatio(aspectRatio);
            // Initialize size based on watermark dimensions, but keep reasonable defaults
            // Scale to fit nicely on screen (max 400px width)
            const maxDisplayWidth = 400;
            const displayWidth = Math.min(maxDisplayWidth, img.width);
            const displayHeight = displayWidth / aspectRatio;
            
            // Update position based on base image if available
            const updatePosition = () => {
                if (baseImageRef.current) {
                    const imgHeight = baseImageRef.current.offsetHeight;
                    setWatermarkState({
                        width: displayWidth,
                        height: displayHeight,
                        x: 0,
                        y: Math.max(0, imgHeight - displayHeight),
                    });
                    positionInitializedRef.current = true;
                } else {
                    setWatermarkState({
                        width: displayWidth,
                        height: displayHeight,
                        x: 0,
                        y: 0,
                    });
                    positionInitializedRef.current = true;
                }
            };
            
            if (baseImageRef.current && baseImageRef.current.complete) {
                updatePosition();
            } else {
                setWatermarkState({
                    width: displayWidth,
                    height: displayHeight,
                    x: 0,
                    y: 0,
                });
                positionInitializedRef.current = true;
            }
        };
        img.src = currentWatermarkSrc;
    }, [currentWatermarkSrc]);

    useEffect(() => {
        // Reset flag when baseImage changes to allow re-initialization
        positionInitializedRef.current = false;
        
        // Initialize watermark position to bottom-left after image loads
        const updatePosition = () => {
            if (baseImageRef.current && !positionInitializedRef.current) {
                const imgHeight = baseImageRef.current.offsetHeight;
                setWatermarkState(prev => ({
                    ...prev,
                    x: 0,
                    y: Math.max(0, imgHeight - prev.height),
                }));
                positionInitializedRef.current = true;
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

        // Calculate watermark position and size on the canvas
        const wmX = watermarkState.x * scale;
        const wmY = watermarkState.y * scale;
        const wmW = watermarkState.width * scale;
        const wmH = watermarkState.height * scale;

        // Load and draw watermark PNG (works for both uploaded and Arandur watermarks)
        const watermarkImg = new Image();
        watermarkImg.crossOrigin = "anonymous";
        watermarkImg.src = currentWatermarkSrc;
        
        watermarkImg.onload = () => {
            // Draw the watermark on the main canvas with proper scaling
            ctx.drawImage(watermarkImg, wmX, wmY, wmW, wmH);
            
            // Trigger download
            const link = document.createElement('a');
            link.download = 'watermarked-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Call success callback if provided
            if (onSuccess) {
                setTimeout(() => onSuccess(), 100);
            }
        };
        
        watermarkImg.onerror = () => {
            console.error('Failed to load watermark image');
            if (onSuccess) {
                setTimeout(() => onSuccess(), 100);
            }
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
                    onDrag={(e, d) => {
                        // Update position during drag for smooth movement
                        setWatermarkState(prev => ({ ...prev, x: d.x, y: d.y }));
                    }}
                    onDragStop={(e, d) => {
                        setWatermarkState(prev => ({ ...prev, x: d.x, y: d.y }));
                        positionInitializedRef.current = true; // Mark as initialized after user drags
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
                        positionInitializedRef.current = true; // Mark as initialized after user resizes
                    }}
                    bounds="parent"
                    lockAspectRatio={watermarkAspectRatio}
                    minWidth={50}
                    minHeight={Math.round(50 / watermarkAspectRatio)}
                    enableResizing={true}
                    disableDragging={false}
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
                        boxSizing: 'border-box',
                        zIndex: 1,
                        pointerEvents: 'all',
                    }}
                    className="watermark-draggable"
                >
                    <img 
                        ref={watermarkRef}
                        src={currentWatermarkSrc}
                        alt="Watermark"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            pointerEvents: 'none',
                            userSelect: 'none',
                        }}
                        draggable={false}
                    />
                </Rnd>
            </div>
    );
});

WatermarkEditor.displayName = 'WatermarkEditor';

export default WatermarkEditor;
