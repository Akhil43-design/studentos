import Dexie from 'dexie';

export const db = new Dexie('SmartSlateDB');

// Define database schema for local offline storage
db.version(1).stores({
  notes: 'id, user_id, subject_id, folder, title, is_favorite, updated_at',
  drawings: 'id, user_id, subject_id, title, updated_at',
  assignments: 'id, subject_id, class_id, due_date',
  attendance: 'id, date, student_id, class_id',
  syncQueue: '++id, entityType, entityId, action, timestamp'
});

/**
 * Add a local change to the sync queue for auto-synchronization when back online
 */
export async function queueSyncItem(entityType, entityId, action, payload) {
  try {
    await db.syncQueue.add({
      entityType,
      entityId,
      action,
      payload: JSON.stringify(payload),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[IndexedDB] Error queueing sync item:', err);
  }
}

/**
 * Clear processed items from sync queue
 */
export async function removeQueueItems(ids) {
  if (!ids || ids.length === 0) return;
  await db.syncQueue.bulkDelete(ids);
}
