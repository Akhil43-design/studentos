import React from 'react';
import { useDrawingCanvas } from '../../hooks/useDrawingCanvas';
import { 
  Pen, 
  Highlighter, 
  Paintbrush, 
  Eraser, 
  Square, 
  Circle, 
  Minus, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Download, 
  Grid, 
  FileText,
  Save
} from 'lucide-react';
import { exportCanvasAsPNG, exportCanvasAsPDF } from '../../utils/exportUtils';

export default function DrawingCanvas({ drawingTitle = 'Untitled Drawing', onSave }) {
  const {
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
    canUndo,
    canRedo,
    shapes
  } = useDrawingCanvas();

  const colors = ['#38BDF8', '#0F172A', '#F43F5E', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];

  const handleSaveClick = () => {
    if (onSave) {
      const canvas = canvasRef.current;
      const previewImg = canvas ? canvas.toDataURL('image/png') : null;
      onSave({
        title: drawingTitle,
        canvasData: { background, shapes },
        previewImg
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-darkblue-900">
      
      {/* Top Toolbar */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/60">
        
        {/* Tools Selector */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <button
            onClick={() => setTool('pen')}
            title="Pen"
            className={`p-2 rounded-lg transition-all ${tool === 'pen' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Pen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('highlighter')}
            title="Highlighter"
            className={`p-2 rounded-lg transition-all ${tool === 'highlighter' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('brush')}
            title="Brush"
            className={`p-2 rounded-lg transition-all ${tool === 'brush' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Paintbrush className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            title="Eraser"
            className={`p-2 rounded-lg transition-all ${tool === 'eraser' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Eraser className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Shapes */}
          <button
            onClick={() => setTool('line')}
            title="Line"
            className={`p-2 rounded-lg transition-all ${tool === 'line' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('rect')}
            title="Rectangle"
            className={`p-2 rounded-lg transition-all ${tool === 'rect' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('circle')}
            title="Circle"
            className={`p-2 rounded-lg transition-all ${tool === 'circle' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Circle className="w-4 h-4" />
          </button>
        </div>

        {/* Colors Palette */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900' : 'hover:scale-110'}`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-6 rounded-full cursor-pointer border-none bg-transparent"
          />
        </div>

        {/* Stroke Width Slider */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-medium">
          <span className="text-slate-500">Size</span>
          <input
            type="range"
            min="1"
            max="24"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-20 accent-primary-500 cursor-pointer"
          />
          <span className="w-4 text-center font-bold text-slate-800 dark:text-slate-200">{strokeWidth}</span>
        </div>

        {/* Background Switcher */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-medium">
          <button
            onClick={() => setBackground('grid')}
            className={`px-2 py-1 rounded-lg ${background === 'grid' ? 'bg-primary-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setBackground('lines')}
            className={`px-2 py-1 rounded-lg ${background === 'lines' ? 'bg-primary-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Lines
          </button>
          <button
            onClick={() => setBackground('dots')}
            className={`px-2 py-1 rounded-lg ${background === 'dots' ? 'bg-primary-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Dots
          </button>
          <button
            onClick={() => setBackground('blank')}
            className={`px-2 py-1 rounded-lg ${background === 'blank' ? 'bg-primary-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Blank
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCw className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </button>
          <button
            onClick={clearCanvas}
            title="Clear Canvas"
            className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </button>

          <button
            onClick={() => exportCanvasAsPNG(canvasRef.current, `${drawingTitle}.png`)}
            title="Export PNG"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </button>

          <button
            onClick={handleSaveClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs shadow-md shadow-primary-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>

      </div>

      {/* Main Interactive Canvas Surface */}
      <div className="flex-1 relative bg-white overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={1600}
          height={1000}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full touch-none"
        />
      </div>

    </div>
  );
}
