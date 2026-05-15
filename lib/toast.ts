import toast from "react-hot-toast";

const TOAST_DURATION_MS = 3200;

export function showSuccessToast(message: string) {
  return toast.success(message, {
    duration: TOAST_DURATION_MS,
    icon: "✨",
  });
}

export function showErrorToast(message: string) {
  return toast.error(message, {
    duration: TOAST_DURATION_MS,
    icon: "🥺",
  });
}
