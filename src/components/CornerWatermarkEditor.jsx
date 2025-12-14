import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';

// Watermark configurations
const watermarks = [
    { src: '/logo-TL.png', position: 'top-left' },
    { src: '/star-TR.png', position: 'top-right' },
    { src: '/helmet-BL.png', position: 'bottom-left' },
    { src: '/tree-BR.png', position: 'bottom-right' },
    { src: '/napis.png', position: 'bottom-center' },
];

const CornerWatermarkEditor = forwardRef(({ baseImage, onReset }, ref) => {
    const baseImageRef = useRef(null);
    const [watermarkSizes, setWatermarkSizes] = useState({});
    const [baseImageSize, setBaseImageSize] = useState({ width: 0, height: 0 });

    // Calculate watermark sizes based on base image
    useEffect(() => {
        if (baseImageRef.current && baseImageRef.current.complete) {
            const baseWidth = baseImageRef.current.offsetWidth;
            const baseHeight = baseImageRef.current.offsetHeight;
            setBaseImageSize({ width: baseWidth, height: baseHeight });

            // Load each watermark to get its dimensions
            watermarks.forEach((watermark) => {
                const img = new Image();
                img.onload = () => {
                    const aspectRatio = img.width / img.height;
                    // Use original PNG dimensions for corner watermarks
                    // Scale napis.png to 30% of base image width
                    let displayWidth, displayHeight;
                    if (watermark.position === 'bottom-center') {
                        // Scale napis to 30% of base image width
                        const maxWidth = baseWidth * 0.3;
                        displayWidth = Math.min(maxWidth, img.width);
                        displayHeight = displayWidth / aspectRatio;
                    } else {
                        // Use original size for corner watermarks
                        displayWidth = img.width;
                        displayHeight = img.height;
                    }

                    setWatermarkSizes(prev => ({
                        ...prev,
                        [watermark.position]: {
                            width: displayWidth,
                            height: displayHeight,
                            aspectRatio,
                        }
                    }));
                };
                img.src = watermark.src;
            });
        }
    }, [baseImage]);

    const getWatermarkPosition = (position) => {
        const size = watermarkSizes[position];
        if (!size || baseImageSize.width === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }

        const { width, height } = size;
        let x = 0;
        let y = 0;

        switch (position) {
            case 'top-left':
                x = 0;
                y = 0;
                break;
            case 'top-right':
                x = baseImageSize.width - width;
                y = 0;
                break;
            case 'bottom-left':
                x = 0;
                y = baseImageSize.height - height;
                break;
            case 'bottom-right':
                x = baseImageSize.width - width;
                y = baseImageSize.height - height;
                break;
            case 'bottom-center':
                x = (baseImageSize.width - width) / 2;
                y = baseImageSize.height - height;
                break;
            default:
                x = 0;
                y = 0;
        }

        return { x, y, width, height };
    };

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

        // Load and draw all watermarks
        let loadedCount = 0;
        const totalWatermarks = watermarks.length;

        const drawWatermark = (watermark) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = watermark.src;

            img.onload = () => {
                const pos = getWatermarkPosition(watermark.position);
                const wmX = pos.x * scale;
                const wmY = pos.y * scale;
                const wmW = pos.width * scale;
                const wmH = pos.height * scale;

                ctx.drawImage(img, wmX, wmY, wmW, wmH);

                loadedCount++;
                if (loadedCount === totalWatermarks) {
                    // All watermarks loaded, trigger download
                    const link = document.createElement('a');
                    link.download = 'watermarked-image.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                    if (onSuccess) {
                        setTimeout(() => onSuccess(), 100);
                    }
                }
            };

            img.onerror = () => {
                console.error(`Failed to load watermark: ${watermark.src}`);
                loadedCount++;
                if (loadedCount === totalWatermarks) {
                    // Still trigger download even if some watermarks failed
                    const link = document.createElement('a');
                    link.download = 'watermarked-image.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                    if (onSuccess) {
                        setTimeout(() => onSuccess(), 100);
                    }
                }
            };
        };

        // Load all watermarks
        watermarks.forEach(drawWatermark);
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
                onLoad={() => {
                    if (baseImageRef.current) {
                        const baseWidth = baseImageRef.current.offsetWidth;
                        const baseHeight = baseImageRef.current.offsetHeight;
                        setBaseImageSize({ width: baseWidth, height: baseHeight });
                    }
                }}
            />
            <button className="arandur-close-btn" onClick={onReset}>
                <img src="/8d4799bd3dd556197355afce189584e4bee6ab4b.svg" alt="Close" />
            </button>
            {watermarks.map((watermark) => {
                const pos = getWatermarkPosition(watermark.position);
                if (pos.width === 0 || pos.height === 0) return null;

                return (
                    <img
                        key={watermark.position}
                        src={watermark.src}
                        alt={`Watermark ${watermark.position}`}
                        style={{
                            position: 'absolute',
                            left: `${pos.x}px`,
                            top: `${pos.y}px`,
                            width: `${pos.width}px`,
                            height: `${pos.height}px`,
                            objectFit: 'contain',
                            pointerEvents: 'none',
                            userSelect: 'none',
                        }}
                        draggable={false}
                    />
                );
            })}
        </div>
    );
});

CornerWatermarkEditor.displayName = 'CornerWatermarkEditor';

export default CornerWatermarkEditor;

