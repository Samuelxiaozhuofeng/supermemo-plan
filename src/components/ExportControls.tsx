import { Download, Upload } from "lucide-react";
import type { RefObject } from "react";

export function ExportControls({
  importInputRef,
  onExport,
  onImport,
}: {
  importInputRef: RefObject<HTMLInputElement | null>;
  onExport: (format: "md" | "csv" | "json") => void;
  onImport: (file: File) => void;
}) {
  return (
    <div className="export-actions">
      <button onClick={() => onExport("md")} type="button">
        <Download size={16} /> Markdown
      </button>
      <button onClick={() => onExport("csv")} type="button">
        <Download size={16} /> CSV
      </button>
      <button onClick={() => onExport("json")} type="button">
        <Download size={16} /> JSON 备份
      </button>
      <button onClick={() => importInputRef.current?.click()} type="button">
        <Upload size={16} /> 恢复备份
      </button>
      <input
        ref={importInputRef}
        hidden
        accept="application/json,.json"
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onImport(file);
          }
          event.currentTarget.value = "";
        }}
      />
    </div>
  );
}
