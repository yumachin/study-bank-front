"use client";

import type { CSSProperties } from "react";
import { Toaster } from "react-hot-toast";

const TOAST_DURATION_MS = 3200;

const toastBaseStyle: CSSProperties = {
  borderRadius: "16px",
  background: "#ffffff",
  color: "#334155",
  border: "1px solid #e2e8f0",
  boxShadow: "0 12px 28px -8px rgba(99, 102, 241, 0.22)",
  padding: "12px 16px",
  fontSize: "14px",
  fontWeight: 600,
  maxWidth: "360px",
};

/** アプリ全体で使う、角丸・インディゴ系のトースト */
export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ top: 20 }}
      toastOptions={{
        duration: TOAST_DURATION_MS,
        style: toastBaseStyle,
        success: {
          style: {
            ...toastBaseStyle,
            border: "1px solid #c7d2fe",
            boxShadow: "0 12px 28px -8px rgba(99, 102, 241, 0.28)",
          },
          iconTheme: {
            primary: "#6366f1",
            secondary: "#eef2ff",
          },
        },
        error: {
          style: {
            ...toastBaseStyle,
            border: "1px solid #fecdd3",
            boxShadow: "0 12px 28px -8px rgba(244, 114, 182, 0.22)",
          },
          iconTheme: {
            primary: "#f472b6",
            secondary: "#fff1f2",
          },
        },
      }}
    />
  );
}
