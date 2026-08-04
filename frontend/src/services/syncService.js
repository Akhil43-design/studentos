import api from './api';
import { db, removeQueueItems } from '../db/indexedDB';

export async function processOfflineQueue() {
  try {
    const queueItems = await db.syncQueue.toArray();
    if (queueItems.length === 0) {
      return { success: true, processedCount: 0 };
    }

    console.log(`[Sync Engine] Processing ${queueItems.length} queued offline items...`);

    const response = await api.post('/sync/batch', {
      clientId: 'pwa_' + navigator.userAgent.replace(/[^a-zA-Z0-9]/g, '').substr(0, 12),
      items: queueItems
    });

    if (response.data && response.data.processed) {
      await removeQueueItems(response.data.processed);
      console.log(`[Sync Engine] Successfully synchronized ${response.data.processed.length} items`);
    }

    return {
      success: true,
      processedCount: response.data.processed ? response.data.processed.length : 0,
      conflicts: response.data.conflicts || []
    };
  } catch (err) {
    console.warn('[Sync Engine] Server unreachable or sync failed. Items remain in offline queue.');
    return { success: false, error: err.message };
  }
}

export async function fetchServerSyncStatus() {
  try {
    const res = await api.get('/sync/status');
    return res.data;
  } catch (err) {
    return { status: 'offline' };
  }
}
