// CodeEditorComponent.jsx
import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const languageOptions = [
  { id: 54, name: "C++ (GCC 9.2.0)", extension: "cpp" },
  { id: 62, name: "Java (OpenJDK 13.0.1)", extension: "java" },
  { id: 63, name: "JavaScript (Node.js 12.14.0)", extension: "js" },
  { id: 71, name: "Python (3.8.1)", extension: "py" },
];

const defaultCode = {
  "cpp": "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, World!\";\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}",
  "js": "console.log(\"Hello, World!\");",
  "py": "print(\"Hello, World!\")"
};

function CodeEditorComponent() {
  const [code, setCode] = useState(defaultCode.py);
  const [language, setLanguage] = useState(languageOptions[3]); // Python default
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isError, setIsError] = useState(false);
  const editorRef = useRef(null);

  const handleLanguageChange = (value) => {
    const selectedLang = languageOptions.find(lang => lang.id.toString() === value);
    setLanguage(selectedLang);
    setCode(defaultCode[selectedLang.extension]);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const executeCode = async () => {
    setIsProcessing(true);
    setOutput("Processing...");
    setIsError(false);

    const headers = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': '164fbbef41mshbb22e31e20a580dp12ab7ejsnb37feb969706',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    };

    const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';

    try {
      // Step 1: Submit code for execution
      const response = await fetch(`${JUDGE0_API}/submissions`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          source_code: code,
          language_id: language.id,
          stdin: ''
        })
      });

      const data = await response.json();
      const token = data.token;

      if (!token) {
        throw new Error("Failed to submit code");
      }

      // Step 2: Poll for results
      let status = "Processing";
      let result = null;
      
      // Poll until we get a result
      while (status === "Processing" || status === "In Queue") {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const resultResponse = await fetch(`${JUDGE0_API}/submissions/${token}`, {
          method: 'GET',
          headers: headers
        });
        
        result = await resultResponse.json();
        status = result.status?.description || "Unknown";
      }

      // Display result
      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput(result.stderr);
        setIsError(true);
      } else if (result.compile_output) {
        setOutput(result.compile_output);
        setIsError(true);
      } else {
        setOutput("No output");
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput(`Error: ${error.message}`);
      setIsError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Select 
            value={language.id.toString()} 
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((lang) => (
                <SelectItem key={lang.id} value={lang.id.toString()}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={executeCode} disabled={isProcessing}>
            {isProcessing ? "Running..." : "Run Code"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <Card className="col-span-1 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Code Editor</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Editor
              height="100%"
              language={language.extension}
              value={code}
              onChange={setCode}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Output Terminal</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className={`font-mono p-4 h-[400px] overflow-auto bg-gray-900 text-white rounded-md ${isError ? 'text-red-400' : 'text-green-400'}`}
            >
              {output}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CodeEditorComponent;