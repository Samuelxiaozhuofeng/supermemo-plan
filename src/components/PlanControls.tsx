import { GitMerge, ListPlus, RotateCcw, Scissors, Trash2 } from "lucide-react";

export function PlanControls({
  disabled,
  onAdd,
  onDelete,
  onMerge,
  onReset,
  onSplit,
}: {
  disabled: boolean;
  onAdd: () => void;
  onDelete: () => void;
  onMerge: () => void;
  onReset: () => void;
  onSplit: () => void;
}) {
  return (
    <div className="control-grid">
      <button disabled={disabled} onClick={onAdd} type="button">
        <ListPlus size={16} /> 新增
      </button>
      <button disabled={disabled} onClick={onDelete} type="button">
        <Trash2 size={16} /> 删除
      </button>
      <button disabled={disabled} onClick={onSplit} type="button">
        <Scissors size={16} /> 拆分
      </button>
      <button disabled={disabled} onClick={onMerge} type="button">
        <GitMerge size={16} /> 合并
      </button>
      <button disabled={disabled} onClick={onReset} type="button">
        <RotateCcw size={16} /> Reset
      </button>
    </div>
  );
}
