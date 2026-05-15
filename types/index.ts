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
  note: string;
  createdAt: Timestamp;
}

export interface UserSettings {
  hourlyRate: Yen;
  /** この金額を稼ぐために必要な勉強時間を算出するための目標（円） */
  targetIncomeYen: Yen;
  dailyGoalSeconds: Seconds;
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
  ANALYSIS: 'ANALYSIS',
  SETTINGS: 'SETTINGS',
} as const;

export type AppView = typeof APP_VIEWS[keyof typeof APP_VIEWS];