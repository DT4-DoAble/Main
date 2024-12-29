const db = new Dexie('DailyLogDatabase');

db.version(1).stores({
  dailyLogs: '++id ,date,diary,selectedEmoji,selectedEmotion',
});

db.open().catch((err) => {
  console.error('Failed to open database:', err);
});

export default db;
