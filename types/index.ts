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
  targetIncome: Yen;
  dailyGoalSeconds: Seconds;
  /** 記帳後に収支ページでお祝いモーダルを表示するか */
  showSessionCompleteModal: boolean;
  /** タイマー開始時に学習内容入力モーダルを表示するか */
  showSessionStartModal: boolean;
}

export interface AppState {
  balance: Yen;
  totalEarned: Yen;
  totalSpent: Yen;
  sessions: StudySession[];
  transactions: Transaction[];
  settings: UserSettings;
  /** 開始モーダルで選べる過去の学習名 */
  studyNoteHistory: string[];
}

export const APP_VIEWS = {
  TIMER: 'TIMER',
  WALLET: 'WALLET',
  ANALYSIS: 'ANALYSIS',
  SETTINGS: 'SETTINGS',
} as const;

export type AppView = typeof APP_VIEWS[keyof typeof APP_VIEWS];