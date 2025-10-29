// import { useRef, useState, useCallback } from 'react';
// import Editor from '@monaco-editor/react';
// import { Wrapper } from './styled'

// const MonacoEditor = () => {
//     const editorRef = useRef(null);
//     const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
//     const [language, setLanguage] = useState('typescript');
//     const [theme, setTheme] = useState('vs-dark');

//     const initialValue = `function greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("Monaco Editor"));`;

//     const handleEditorDidMount = useCallback((editor, monaco) => {
//         editorRef.current = editor;
//         // 确保编辑器获得焦点
//         editor.focus();

//         // 监听光标位置变化
//         editor.onDidChangeCursorPosition((e) => {
//             setCursorPosition({
//                 lineNumber: e.position.lineNumber,
//                 column: e.position.column
//             });
//         });

//         // 监听内容变化，确保光标可见
//         editor.onDidChangeModelContent(() => {
//             editor.focus();
//         });

//     }, []);

//     return (
//         <Wrapper>
//             <div className="editor-wrapper">
//                 <Editor
//                     height="100vh"
//                     defaultLanguage={language}
//                     language={language}
//                     value={initialValue}
//                     theme={theme}
//                     onMount={handleEditorDidMount}
//                     options={{
//                         fontSize: 14,
//                         lineNumbers: 'on',
//                         roundedSelection: false,
//                         scrollBeyondLastLine: false,
//                         automaticLayout: true,
//                         minimap: { enabled: true },
//                         // 添加这些选项来解决光标问题
//                         cursorBlinking: 'blink',
//                         cursorStyle: 'line',
//                         cursorWidth: 1,
//                         selectOnLineNumbers: true,
//                         selectionHighlight: true,
//                         renderLineHighlight: 'all',
//                         renderControlCharacters: true,
//                         // 确保编辑器可交互
//                         readOnly: false,
//                         domReadOnly: false
//                     }}
//                 />
//             </div>
//         </Wrapper>
//     );
// };

// export default MonacoEditor;













import { useRef, useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Wrapper } from './styled'

const MonacoEditor = () => {
    const editorRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
    const [language, setLanguage] = useState('typescript');
    const [theme, setTheme] = useState('vs-dark');
    const [isEditorReady, setIsEditorReady] = useState(false);

    const initialValue = `function greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("Monaco Editor"));`;

    const handleEditorDidMount = useCallback((editor, monaco) => {
        editorRef.current = editor;
        setIsEditorReady(true);

        console.log('Editor mounted, focusing...');

        // 立即聚焦编辑器
        setTimeout(() => {
            editor.focus();
            // 设置光标到可见位置
            editor.setPosition({ lineNumber: 1, column: 1 });
            editor.revealPositionInCenter({ lineNumber: 1, column: 1 });
        }, 100);

        // 监听光标位置变化
        editor.onDidChangeCursorPosition((e) => {
            setCursorPosition({
                lineNumber: e.position.lineNumber,
                column: e.position.column
            });
        });

        // 添加点击事件强制聚焦
        const domNode = editor.getDomNode();
        if (domNode) {
            domNode.addEventListener('click', () => {
                editor.focus();
            });
        }

    }, []);

    // 使用 useEffect 确保编辑器获得焦点
    useEffect(() => {
        if (isEditorReady && editorRef.current) {
            const timer = setTimeout(() => {
                editorRef.current.focus();
                editorRef.current.setPosition({ lineNumber: 1, column: 1 });
            }, 200);
            
            return () => clearTimeout(timer);
        }
    }, [isEditorReady]);

    // 添加全局点击事件，点击页面任何地方都聚焦编辑器
    useEffect(() => {
        const handleGlobalClick = () => {
            if (isEditorReady && editorRef.current) {
                setTimeout(() => {
                    editorRef.current.focus();
                }, 0);
            }
        };

        document.addEventListener('click', handleGlobalClick);
        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, [isEditorReady]);

    return (
        <Wrapper>
            <div className="editor-wrapper" 
                 style={{ cursor: 'text' }}
                 onClick={() => {
                     if (isEditorReady && editorRef.current) {
                         editorRef.current.focus();
                     }
                 }}
            >
                <Editor
                    defaultLanguage={language}
                    language={language}
                    defaultValue={initialValue}  // 使用 defaultValue 而不是 value
                    theme={theme}
                    onMount={handleEditorDidMount}
                    options={{
                        // 基础配置
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        minimap: { enabled: true },
                        
                        // 光标配置
                        cursorBlinking: 'blink',
                        cursorStyle: 'line', // 或者尝试 'block'
                        cursorWidth: 2,
                        
                        // 选择和渲染配置
                        selectOnLineNumbers: true,
                        selectionHighlight: true,
                        renderLineHighlight: 'all',
                        renderControlCharacters: true,
                        
                        // 焦点和交互配置
                        readOnly: false,
                        domReadOnly: false,
                        
                        // 额外配置确保可见性
                        showUnused: true,
                        folding: true,
                        foldingHighlight: true,
                        showFoldingControls: 'mouseover',
                        
                        // 滚动配置
                        smoothScrolling: true,
                        mouseWheelZoom: true,
                        
                        // 建议配置
                        quickSuggestions: true,
                        suggestOnTriggerCharacters: true,
                        
                        // 括号匹配
                        matchBrackets: 'always',
                        
                        // 确保内容可编辑
                        wordBasedSuggestions: true,
                        
                        // 添加 padding 确保内容可见
                        padding: { top: 16, bottom: 16 }
                    }}
                />
            </div>
        </Wrapper>
    );
};

export default MonacoEditor;