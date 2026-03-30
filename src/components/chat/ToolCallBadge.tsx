"use client";

import { Loader2, FilePlus, FilePen, FileSearch, Trash2, ArrowRightLeft } from "lucide-react";

interface StrReplaceArgs {
  command: "view" | "create" | "str_replace" | "insert" | "undo_edit";
  path: string;
}

interface FileManagerArgs {
  command: "rename" | "delete";
  path: string;
  new_path?: string;
}

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "partial-call" | "call" | "result";
}

function getFileName(path: string): string {
  return path.split("/").filter(Boolean).pop() ?? path;
}

function getLabel(toolName: string, args: Record<string, unknown>): { icon: React.ReactNode; text: string } {
  if (toolName === "str_replace_editor") {
    const { command, path } = args as StrReplaceArgs;
    const name = getFileName(path);
    switch (command) {
      case "create":
        return { icon: <FilePlus className="w-3 h-3" />, text: `Creating ${name}` };
      case "str_replace":
      case "insert":
        return { icon: <FilePen className="w-3 h-3" />, text: `Editing ${name}` };
      case "view":
        return { icon: <FileSearch className="w-3 h-3" />, text: `Reading ${name}` };
      default:
        return { icon: <FilePen className="w-3 h-3" />, text: `Editing ${name}` };
    }
  }

  if (toolName === "file_manager") {
    const { command, path, new_path } = args as FileManagerArgs;
    const name = getFileName(path);
    if (command === "delete") {
      return { icon: <Trash2 className="w-3 h-3" />, text: `Deleting ${name}` };
    }
    if (command === "rename" && new_path) {
      const newName = getFileName(new_path);
      return { icon: <ArrowRightLeft className="w-3 h-3" />, text: `Renaming ${name} → ${newName}` };
    }
  }

  return { icon: <FilePen className="w-3 h-3" />, text: toolName };
}

export function ToolCallBadge({ toolName, args, state }: ToolCallBadgeProps) {
  const isDone = state === "result";
  const { icon, text } = getLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-600">{icon}</span>
      <span className="text-neutral-700">{text}</span>
    </div>
  );
}
