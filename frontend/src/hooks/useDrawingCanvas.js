import { useRef, useState, useEffect, useCallback } from 'react';

export function useDrawingCanvas() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen'); // 'pen', 'highlighter', 'marker', 'brush', 'eraser', 'line', 'rect', 'circle', 'arrow'
  const [color, setColor] = useState('#38BDF8');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [background, setBackground] = useState('grid'); // 'blank', 'grid', 'lines', 'dots'
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas.width, canvas.height, background);
    setShapes([]);
    setHistory([]);
    setHistoryStep(-1);
  }, [background]);

  // Draw background pattern
  const drawBackground = (ctx, width, height, bgType) => {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    if (bgType === 'grid') {
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (bgType === 'lines') {
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1;
      const lineSpacing = 32;
      for (let y = lineSpacing; y < height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (bgType === 'dots') {
      ctx.fillStyle = '#94A3B8';
      const dotSpacing = 24;
      for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
        for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  };

  // Redraw canvas with all shapes and background
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawBackground(ctx, canvas.width, canvas.height, background);

    shapes.forEach(shape => {
      ctx.save();
      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.color;
      ctx.lineWidth = shape.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (shape.tool === 'highlighter') {
        ctx.globalAlpha = 0.4;
      } else {
        ctx.globalAlpha = 1.0;
      }

      if (shape.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = shape.width * 2;
      }

      if (shape.type === 'path' && shape.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.stroke();
      } else if (shape.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
      } else if (shape.type === 'rect') {
        ctx.beginPath();
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
      } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    });
  }, [background, shapes]);

  useEffect(() => {
    redrawCanvas();
  }, [background, shapes, redrawCanvas]);

  // Handle pointer down (Mouse/Stylus/Touch)
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });

    if (['pen', 'highlighter', 'marker', 'brush', 'eraser'].includes(tool)) {
      setCurrentPath([{ x, y }]);
    }
  };

  // Handle pointer move
  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (['pen', 'highlighter', 'marker', 'brush', 'eraser'].includes(tool)) {
      setCurrentPath(prev => {
        const next = [...prev, { x, y }];
        // Live stroke preview
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
        ctx.lineWidth = tool === 'highlighter' ? strokeWidth * 2 : strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (tool === 'highlighter') ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(prev[prev.length - 1].x, prev[prev.length - 1].y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
        return next;
      });
    }
  };

  // Handle pointer up
  const handlePointerUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let newShape = null;

    if (['pen', 'highlighter', 'marker', 'brush', 'eraser'].includes(tool)) {
      newShape = {
        id: Date.now(),
        type: 'path',
        tool,
        points: [...currentPath, { x, y }],
        color,
        width: tool === 'highlighter' ? strokeWidth * 2 : strokeWidth
      };
    } else if (tool === 'line') {
      newShape = { id: Date.now(), type: 'line', tool, x1: startPos.x, y1: startPos.y, x2: x, y2: y, color, width: strokeWidth };
    } else if (tool === 'rect') {
      newShape = { id: Date.now(), type: 'rect', tool, x: Math.min(startPos.x, x), y: Math.min(startPos.y, y), w: Math.abs(x - startPos.x), h: Math.abs(y - startPos.y), color, width: strokeWidth };
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
      newShape = { id: Date.now(), type: 'circle', tool, x: startPos.x, y: startPos.y, r: radius, color, width: strokeWidth };
    }

    if (newShape) {
      const updatedShapes = [...shapes, newShape];
      setShapes(updatedShapes);

      // Save to undo history
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(updatedShapes);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    }

    setCurrentPath([]);
  };

  const undo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      setShapes(history[prevStep]);
      setHistoryStep(prevStep);
    } else if (historyStep === 0) {
      setShapes([]);
      setHistoryStep(-1);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      setShapes(history[nextStep]);
      setHistoryStep(nextStep);
    }
  };

  return {
    canvasRef,
    tool,
    setTool,
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    background,
    setBackground,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    clearCanvas,
    undo,
    redo,
    canUndo: historyStep >= 0,
    canRedo: historyStep < history.length - 1,
    shapes,
    setShapes
  };
}
