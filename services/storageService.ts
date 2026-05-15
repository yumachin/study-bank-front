import { AppState, UserSettings, Transaction } from '../types';

const STORAGE_KEY = 'studybank_v1_data';

const DEFAULT_SETTINGS: UserSettings = {
  hourlyRate: 1000,
  targetIncome: 200000,
  dailyGoalSeconds: 60 * 60 * 2,
  showSessionCompleteModal: true,
  showSessionStartModal: true,
};

const INITIAL_STATE: AppState = {
  balance: 0,
  totalEarned: 0,
  totalSpent: 0,
  sessions: [],
  transactions: [],
  settings: DEFAULT_SETTINGS,
  studyNoteHistory: [],
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return INITIAL_STATE;
    }

    const parsed = JSON.parse(serialized) as Partial<AppState>;

    return {
      ...INITIAL_STATE,
      ...parsed,
      settings: {
        ...DEFAULT_SETTINGS,
        ...parsed.settings,
      },
      studyNoteHistory: parsed.studyNoteHistory ?? [],
    };
  } catch (err) {
    console.error("基本情報の取得に失敗", err);
    return INITIAL_STATE;
  }
};

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("基本情報の保存に失敗", err);
  }
};

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