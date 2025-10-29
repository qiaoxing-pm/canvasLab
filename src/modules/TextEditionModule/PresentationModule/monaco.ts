// monaco-editor.ts
import "@/monaco-editor/package/min/vs/loader.js";

declare const require: any;
declare const monaco: any;

interface MonacoEditorOptions {
  value?: string;
  language?: string;
  theme?: string;
  fontSize?: number;
  lineNumbers?: "on" | "off" | "relative";
  automaticLayout?: boolean;
  minimap?: { enabled: boolean };
}

export class MonacoEditor {
  private editor: any;
  private isInitialized = false;

  constructor(private container: HTMLElement) {}

  async initialize(options: MonacoEditorOptions = {}) {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // 配置路径
      require.config({
        paths: {
          vs: "/monaco-editor/package/min/vs",
        },
      });

      require(["vs/editor/editor.main"], () => {
        try {
          this.editor = monaco.editor.create(this.container, {
            value: options.value || "// 开始编写你的代码...",
            language: options.language || "javascript",
            theme: options.theme || "vs",
            fontSize: options.fontSize || 14,
            lineNumbers: options.lineNumbers || "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: options.automaticLayout ?? true,
            minimap: options.minimap || { enabled: true },
            ...options,
          });

          this.isInitialized = true;
          resolve(this.editor);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  getValue(): string {
    return this.editor?.getValue() || "";
  }

  setValue(value: string): void {
    this.editor?.setValue(value);
  }

  setLanguage(language: string): void {
    monaco.editor.setModelLanguage(this.editor.getModel(), language);
  }

  dispose(): void {
    this.editor?.dispose();
    this.isInitialized = false;
  }
}

// 使用示例
export const createMonacoEditor = (
  container: HTMLElement,
  options?: MonacoEditorOptions
): Promise<MonacoEditor> => {
  const editor = new MonacoEditor(container);
  return editor.initialize(options).then(() => editor);
};
