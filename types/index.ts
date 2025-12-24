type Timestamp = number;
type Yen = number;
type Seconds = number;

export interface StudySession {
  id: string;
  startTime: Timestamp;
  endTime: Timestamp;
  durationSeconds: Seconds;
  earnings: Yen;
  hourlyRateSnapshot: Yen;
}

export type TransactionType = 'EARN' | 'SPEND';

export interface Transaction {
  id: string;
  amount: Yen;
  type: TransactionType;
  note: string; // e.g., "Study Session" or "Bought Coffee"
  createdAt: Timestamp;
}

export interface UserSettings {
  hourlyRate: Yen; // Yen per hour
  dailyGoalSeconds: Seconds; // Target study time in seconds
  themeColor: string;
}

export interface AppState {
  balance: Yen;
  totalEarned: Yen;
  totalSpent: Yen;
  sessions: StudySession[];
  transactions: Transaction[];
  settings: UserSettings;
}

export const APP_VIEWS = {
  TIMER: 'TIMER',
  WALLET: 'WALLET',
  DASHBOARD: 'DASHBOARD',
  SETTINGS: 'SETTINGS',
} as const;

export type AppView = typeof APP_VIEWS[keyof typeof APP_VIEWS];