import { render, screen, cleanup } from "@testing-library/react";
import { describe, test, expect, afterEach } from "vitest";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

describe("ToolCallBadge", () => {
  describe("str_replace_editor", () => {
    test("shows 'Creating' for create command", () => {
      render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "create", path: "/src/components/Button.tsx" }}
          state="call"
        />
      );
      expect(screen.getByText("Creating Button.tsx")).toBeDefined();
    });

    test("shows 'Editing' for str_replace command", () => {
      render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "str_replace", path: "/src/App.jsx" }}
          state="call"
        />
      );
      expect(screen.getByText("Editing App.jsx")).toBeDefined();
    });

    test("shows 'Editing' for insert command", () => {
      render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "insert", path: "/src/utils.ts" }}
          state="result"
        />
      );
      expect(screen.getByText("Editing utils.ts")).toBeDefined();
    });

    test("shows 'Reading' for view command", () => {
      render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "view", path: "/src/utils/helpers.ts" }}
          state="call"
        />
      );
      expect(screen.getByText("Reading helpers.ts")).toBeDefined();
    });

    test("extracts filename from nested path", () => {
      render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "create", path: "/src/components/ui/Card.tsx" }}
          state="call"
        />
      );
      expect(screen.getByText("Creating Card.tsx")).toBeDefined();
    });
  });

  describe("file_manager", () => {
    test("shows 'Deleting' for delete command", () => {
      render(
        <ToolCallBadge
          toolName="file_manager"
          args={{ command: "delete", path: "/src/old-file.tsx" }}
          state="call"
        />
      );
      expect(screen.getByText("Deleting old-file.tsx")).toBeDefined();
    });

    test("shows rename with arrow for rename command", () => {
      render(
        <ToolCallBadge
          toolName="file_manager"
          args={{ command: "rename", path: "/src/Foo.tsx", new_path: "/src/Bar.tsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Renaming Foo.tsx → Bar.tsx")).toBeDefined();
    });
  });

  describe("state indicator", () => {
    test("shows spinner when state is 'call'", () => {
      const { container } = render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "create", path: "/src/App.jsx" }}
          state="call"
        />
      );
      expect(container.querySelector(".animate-spin")).toBeTruthy();
    });

    test("shows spinner when state is 'partial-call'", () => {
      const { container } = render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "create", path: "/src/App.jsx" }}
          state="partial-call"
        />
      );
      expect(container.querySelector(".animate-spin")).toBeTruthy();
    });

    test("shows green dot when state is 'result'", () => {
      const { container } = render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "create", path: "/src/App.jsx" }}
          state="result"
        />
      );
      expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
      expect(container.querySelector(".animate-spin")).toBeNull();
    });
  });

  describe("unknown tool fallback", () => {
    test("falls back to tool name for unknown tools", () => {
      render(
        <ToolCallBadge
          toolName="some_other_tool"
          args={{}}
          state="result"
        />
      );
      expect(screen.getByText("some_other_tool")).toBeDefined();
    });
  });
});
