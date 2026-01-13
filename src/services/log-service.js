const STORAGE_KEY = 'defy_activity_logs';

const loadLogs = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to load logs from localStorage:", e);
        return [];
    }
};

const saveLogs = (newLogs) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    } catch (e) {
        console.error("Failed to save logs to localStorage:", e);
    }
};

let logs = loadLogs();
let listeners = [];

export const getLogs = () => [...logs];

export const addLog = (log) => {
    const id = Date.now() + Math.random();
    const newLog = {
        id,
        time: new Date().toLocaleTimeString(),
        status: 'Success',
        ...log
    };
    logs = [newLog, ...logs];
    saveLogs(logs);
    listeners.forEach(listener => listener(logs));
    return id;
};

export const updateLog = (id, updates) => {
    logs = logs.map(log => log.id === id ? { ...log, ...updates } : log);
    saveLogs(logs);
    listeners.forEach(listener => listener(logs));
};

export const subscribeLogs = (listener) => {
    // Immediate callback with current logs
    listener(logs);
    listeners.push(listener);
    return () => {
        listeners = listeners.filter(l => l !== listener);
    };
};

export const clearLogs = () => {
    logs = [];
    saveLogs(logs);
    listeners.forEach(listener => listener(logs));
};
