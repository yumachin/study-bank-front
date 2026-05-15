"use client";

type ModalDismissCheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** モーダル内「今後表示しない」用の共通チェックボックス */
export function ModalDismissCheckbox({
  id,
  checked,
  onChange,
}: ModalDismissCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="mt-4 flex cursor-pointer items-center justify-center gap-2 text-sm text-slate-500"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span>今後表示しない</span>
    </label>
  );
}
