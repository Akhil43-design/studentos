import React from 'react';
import { useSync } from '../../context/SyncContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function SyncIndicator() {
  const { isOnline, isSyncing, queueCount, triggerSync } = useSync();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={triggerSync}
        disabled={isSyncing}
        title={isOnline ? 'Connected to Raspberry Pi Server' : 'Offline Mode - Queueing Changes'}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          isOnline
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50'
            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50'
        }`}
      >
        {isSyncing ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary-500" />
        ) : isOnline ? (
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-amber-500" />
        )}

        <span className="hidden sm:inline">
          {isSyncing ? 'Syncing...' : isOnline ? 'Online' : 'Offline'}
        </span>

        {queueCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
            {queueCount}
          </span>
        )}
      </button>
    </div>
  );
}
