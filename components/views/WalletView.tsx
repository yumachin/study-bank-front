"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  History,
  CreditCard,
} from "lucide-react";
import { APP_VIEWS, Transaction } from "@/types";
import { Button } from "../ui/Button ";
import { Heading } from "../ui/Heading";

type WalletViewProps = {
  balance: number;
  totalEarned: number;
  transactions: Transaction[];
  onWithdraw: (amount: number, note: string) => void;
};

export const WalletView = ({
  balance,
  totalEarned,
  transactions,
  onWithdraw,
}: WalletViewProps) => {
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawNote, setWithdrawNote] = useState<string>("");
  const [isWithdrawMode, setIsWithdrawMode] = useState<boolean>(false);

  const handleWithdraw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const amount = Number(withdrawAmount);

    if (Number.isNaN(amount) || amount <= 0) return;

    if (amount > balance) {
      window.alert("Insufficient funds!");
      return;
    }

    onWithdraw(amount, withdrawNote || "Withdrawal");

    setWithdrawAmount("");
    setWithdrawNote("");
    setIsWithdrawMode(false);
  };

  return (
    <div className="px-6 pb-24 space-y-6 max-w-md mx-auto">
      <Heading currentView={APP_VIEWS.WALLET} />

      <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-100 mb-1">
            <Wallet size={18} />
            <span className="text-sm font-medium">
              利用可能残高
            </span>
          </div>

          <div className="text-4xl font-mono font-bold tracking-tight mb-6">
            ¥{Math.floor(balance).toLocaleString()}
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-indigo-200 uppercase tracking-wider mb-1">
                累計獲得額
              </div>
              <div className="font-mono font-medium">
                ¥{Math.floor(totalEarned).toLocaleString()}
              </div>
            </div>

            {!isWithdrawMode && (
              <button
                onClick={() => setIsWithdrawMode(true)}
                className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform"
              >
                使う
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      {isWithdrawMode && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <CreditCard
                size={18}
                className="text-indigo-500"
              />
              使用額
            </h3>

            <button
              onClick={() => setIsWithdrawMode(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={handleWithdraw}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-slate-500 ml-1 mb-1">
                金額 (¥)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) =>
                  setWithdrawAmount(e.target.value)
                }
                className="w-full text-lg p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono"
                placeholder="0"
                min={1}
                max={Math.floor(balance)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 ml-1 mb-1">
                理由 (任意)
              </label>
              <input
                type="text"
                value={withdrawNote}
                onChange={(e) =>
                  setWithdrawNote(e.target.value)
                }
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="e.g. Coffee reward"
              />
            </div>

            <Button type="submit" fullWidth>
              出金する
            </Button>
          </form>
        </div>
      )}

      {/* Transaction History */}
      <div>
        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
          <History size={18} className="text-slate-400" />
          履歴
        </h3>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-2xl border border-dashed border-slate-200">
              履歴はまだありません。
            </div>
          ) : (
            transactions
              .slice()
              .reverse()
              .map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        t.type === "EARN"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {t.type === "EARN" ? (
                        <ArrowUpRight size={16} />
                      ) : (
                        <ArrowDownLeft size={16} />
                      )}
                    </div>

                    <div>
                      <div className="font-medium text-slate-800 text-sm">
                        {t.note}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {new Date(
                          t.createdAt
                        ).toLocaleDateString()}{" "}
                        •{" "}
                        {new Date(
                          t.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`font-mono font-bold ${
                      t.type === "EARN"
                        ? "text-emerald-600"
                        : "text-slate-900"
                    }`}
                  >
                    {t.type === "EARN" ? "+" : "-"}¥
                    {t.amount.toLocaleString()}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};
