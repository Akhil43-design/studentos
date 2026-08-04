import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/indexedDB';
import { processOfflineQueue, fetchServerSyncStatus } from '../services/syncService';
import io from 'socket.io-client';

const SyncContext = createContext(null);

export function SyncProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [socket, setSocket] = useState(null);

  // Live count of queued offline changes from IndexedDB
  const queueCount = useLiveQuery(() => db.syncQueue.count(), [], 0);

  // Online / Offline window events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Socket.IO Connection setup for real-time server push
  useEffect(() => {
    const socketClient = io(window.location.origin, {
      reconnectionAttempts: 5,
      timeout: 5000
    });

    socketClient.on('connect', () => {
      setIsOnline(true);
    });

    socketClient.on('disconnect', () => {
      setIsOnline(false);
    });

    socketClient.on('sync_update', () => {
      console.log('[Socket.IO] Remote server sync update received!');
      triggerSync();
    });

    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, []);

  // Sync execution
  const triggerSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await processOfflineQueue();
      if (result.success) {
        setLastSyncTime(new Date().toLocaleTimeString());
        if (socket && result.processedCount > 0) {
          socket.emit('sync_trigger', { timestamp: new Date().toISOString() });
        }
      }
    } catch (err) {
      console.error('[SyncContext] Sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Periodic background sync every 45 seconds if online
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.onLine && queueCount > 0) {
        triggerSync();
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [queueCount]);

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        isSyncing,
        queueCount,
        lastSyncTime,
        triggerSync
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export const useSync = () => useContext(SyncContext);
