import { AppState, UserSettings, StudySession, Transaction } from '../types';

const STORAGE_KEY = 'studybank_v1_data';

const DEFAULT_SETTINGS: UserSettings = {
  hourlyRate: 1000, // Default 1000 yen/hour
  dailyGoalSeconds: 7200, // 2 hours
  themeColor: 'indigo',
};

const INITIAL_STATE: AppState = {
  balance: 0,
  totalEarned: 0,
  totalSpent: 0,
  sessions: [],
  transactions: [],
  settings: DEFAULT_SETTINGS,
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return INITIAL_STATE;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return INITIAL_STATE;
  }
};

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

// Helper to calculate total earned/spent if data gets desynced
export const recalculateTotals = (transactions: Transaction[]) => {
  let earned = 0;
  let spent = 0;
  let balance = 0;

  transactions.forEach(t => {
    if (t.type === 'EARN') {
      earned += t.amount;
      balance += t.amount;
    } else {
      spent += t.amount;
      balance -= t.amount;
    }
  });

  return { earned, spent, balance };
};