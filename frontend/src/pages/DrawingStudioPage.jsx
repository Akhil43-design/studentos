import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PenTool, Plus, Folder, Trash2, Edit3, ArrowLeft } from 'lucide-react';
import DrawingCanvas from '../components/canvas/DrawingCanvas';
import api from '../services/api';
import { db, queueSyncItem } from '../db/indexedDB';

export default function DrawingStudioPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const drawingIdParam = searchParams.get('id');

  const [drawings, setDrawings] = useState([]);
  const [activeDrawing, setActiveDrawing] = useState(null);
  const [title, setTitle] = useState('Untitled Drawing');

  const fetchDrawings = async () => {
    try {
      if (navigator.onLine) {
        const res = await api.get('/drawings');
        setDrawings(res.data.drawings || []);
        if (res.data.drawings) {
          await db.drawings.bulkPut(res.data.drawings);
        }
      } else {
        const local = await db.drawings.toArray();
        setDrawings(local);
      }
    } catch (err) {
      console.error(err);
      const local = await db.drawings.toArray();
      setDrawings(local);
    }
  };

  useEffect(() => {
    fetchDrawings();
  }, []);

  useEffect(() => {
    if (drawingIdParam && drawings.length > 0) {
      const found = drawings.find(d => d.id === drawingIdParam);
      if (found) {
        setActiveDrawing(found);
        setTitle(found.title);
      }
    }
  }, [drawingIdParam, drawings]);

  const handleCreateNew = () => {
    const newDrawing = {
      id: 'drw_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: 'New Canvas Studio Diagram',
      canvas_data: { background: 'grid', shapes: [] },
      updated_at: new Date().toISOString()
    };
    setActiveDrawing(newDrawing);
    setTitle(newDrawing.title);
  };

  const handleSaveDrawing = async (savedObj) => {
    const drawingId = activeDrawing ? activeDrawing.id : ('drw_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5));
    
    const fullData = {
      id: drawingId,
      title: title || savedObj.title,
      canvas_data: savedObj.canvasData,
      preview_img: savedObj.previewImg,
      updated_at: new Date().toISOString()
    };

    await db.drawings.put(fullData);

    if (navigator.onLine) {
      try {
        await api.post('/drawings', {
          id: drawingId,
          title: fullData.title,
          canvasData: savedObj.canvasData,
          previewImg: savedObj.previewImg
        });
      } catch (err) {
        await queueSyncItem('drawings', drawingId, 'UPDATE', fullData);
      }
    } else {
      await queueSyncItem('drawings', drawingId, 'UPDATE', fullData);
    }

    alert('Drawing saved to local database & backend!');
    fetchDrawings();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this drawing?')) return;
    await db.drawings.delete(id);
    setDrawings(drawings.filter(d => d.id !== id));
    if (activeDrawing?.id === id) setActiveDrawing(null);

    if (navigator.onLine) {
      try { await api.delete(`/drawings/${id}`); } catch (e) {}
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {activeDrawing && (
            <button
              onClick={() => { setActiveDrawing(null); setSearchParams({}); }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PenTool className="w-6 h-6 text-primary-500" /> HTML5 Canvas Drawing Studio
            </h1>
            <p className="text-xs text-slate-500">Stylus, finger touch, pen, highlighter, shapes & grid background</p>
          </div>
        </div>

        {!activeDrawing && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-md shadow-primary-500/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Open Blank Canvas
          </button>
        )}
      </div>

      {activeDrawing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none border-b border-slate-200 dark:border-slate-800 pb-1"
            placeholder="Drawing Title..."
          />
          <DrawingCanvas drawingTitle={title} onSave={handleSaveDrawing} />
        </div>
      ) : (
        <div>
          {drawings.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center border border-slate-200 dark:border-slate-800">
              <PenTool className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No saved drawings yet</p>
              <p className="text-xs text-slate-400 mt-1">Click "Open Blank Canvas" to draw using stylus or finger touch.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {drawings.map((d) => (
                <div
                  key={d.id}
                  className="glass-panel p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-primary-400 transition-all flex flex-col justify-between"
                >
                  <div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center relative">
                    {d.preview_img ? (
                      <img src={d.preview_img} alt={d.title} className="w-full h-full object-contain" />
                    ) : (
                      <PenTool className="w-8 h-8 text-slate-400 opacity-50" />
                    )}
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{d.title}</h3>
                    <p className="text-[11px] text-slate-400">{new Date(d.updated_at).toLocaleDateString()}</p>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 flex items-center justify-between">
                    <button
                      onClick={() => setActiveDrawing(d)}
                      className="text-xs font-semibold text-primary-500 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Canvas
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
