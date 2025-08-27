"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle2, Import, Code2 } from "lucide-react";
import { generateCurl, parseCurl, isCurlCommand } from "@/lib/curlUtils";
import {
  generateFetch,
  generateAxios,
  generatePython,
  generateGo,
  generateNodeJs,
} from "@/lib/codeGenerators";

export default function CurlModal({
  isOpen,
  onClose,
  requestData,
  onImportCurl,
}) {
  const [copiedContent, setCopiedContent] = useState(null);
  const [curlInput, setCurlInput] = useState("");
  const [importError, setImportError] = useState("");
  const [activeTab, setActiveTab] = useState("generate");

  // Generate code snippets from current request data
  const codeSnippets = {
    curl: generateCurl(requestData),
    fetch: generateFetch(requestData),
    axios: generateAxios(requestData),
    python: generatePython(requestData),
    go: generateGo(requestData),
    nodejs: generateNodeJs(requestData),
  };

  const handleCopyCode = async (type) => {
    try {
      await navigator.clipboard.writeText(codeSnippets[type]);
      setCopiedContent(type);
      setTimeout(() => setCopiedContent(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleImportCurl = () => {
    setImportError("");

    if (!curlInput.trim()) {
      setImportError("Please enter a curl command");
      return;
    }

    if (!isCurlCommand(curlInput)) {
      setImportError("Invalid curl command format");
      return;
    }

    try {
      const parsedData = parseCurl(curlInput);
      console.log("Parsed curl data:", parsedData); // Debug log

      if (!parsedData || !parsedData.url) {
        setImportError("Could not extract URL from curl command");
        return;
      }

      onImportCurl(parsedData);
      setCurlInput("");
      setImportError("");
      onClose();
    } catch (error) {
      setImportError("Failed to parse curl command");
      console.error("Curl parsing error:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "import") {
      setImportError("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Code Generator
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Generate Code
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Import className="w-4 h-4" />
              Import cURL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4 mt-4">
            {!requestData.url ? (
              <div className="text-center text-muted-foreground py-8 border rounded-md bg-muted/20">
                <Code2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Add a URL to your request to generate code snippets</p>
              </div>
            ) : (
              <Tabs defaultValue="curl" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="fetch">Fetch</TabsTrigger>
                  <TabsTrigger value="axios">Axios</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="go">Go</TabsTrigger>
                  <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                </TabsList>

                {/* cURL */}
                <TabsContent value="curl" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        cURL Command
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode("curl")}
                        disabled={!codeSnippets.curl}
                      >
                        {copiedContent === "curl" ? (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copiedContent === "curl" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <Textarea
                      value={codeSnippets.curl}
                      readOnly
                      className="font-mono text-sm bg-muted/30 min-h-32  max-h-[300px]"
                    />
                  </div>
                </TabsContent>

                {/* JavaScript Fetch */}
                <TabsContent value="fetch" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        JavaScript Fetch API
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode("fetch")}
                        disabled={!codeSnippets.fetch}
                      >
                        {copiedContent === "fetch" ? (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copiedContent === "fetch" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <Textarea
                      value={codeSnippets.fetch}
                      readOnly
                      className="font-mono text-sm bg-muted/30 min-h-32  max-h-[300px]"
                    />
                  </div>
                </TabsContent>

                {/* Axios */}
                <TabsContent value="axios" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Axios (React/Next.js)
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode("axios")}
                        disabled={!codeSnippets.axios}
                      >
                        {copiedContent === "axios" ? (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copiedContent === "axios" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <Textarea
                      value={codeSnippets.axios}
                      readOnly
                      className="font-mono text-sm bg-muted/30 min-h-32  max-h-[300px]"
                    />
                  </div>
                </TabsContent>

                {/* Python */}
                <TabsContent value="python" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Python Requests
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode("python")}
                        disabled={!codeSnippets.python}
                      >
                        {copiedContent === "python" ? (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copiedContent === "python" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <Textarea
                      value={codeSnippets.python}
                      readOnly
                      className="font-mono text-sm bg-muted/30 min-h-32  max-h-[300px]"
                    />
                  </div>
                </TabsContent>

                {/* Go */}
                <TabsContent value="go" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Go HTTP Client
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode("go")}
                        disabled={!codeSnippets.go}
                      >
                        {copiedContent === "go" ? (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copiedContent === "go" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <Textarea
                      value={codeSnippets.go}
                      readOnly
                      className="font-mono text-sm bg-muted/30 min-h-32 max-h-[300px]"
                    />
                  </div>
                </TabsContent>

                {/* Node.js */}
                <TabsContent value="nodejs" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Node.js HTTP
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode("nodejs")}
                        disabled={!codeSnippets.nodejs}
                      >
                        {copiedContent === "nodejs" ? (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copiedContent === "nodejs" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <Textarea
                      value={codeSnippets.nodejs}
                      readOnly
                      className="font-mono text-sm bg-muted/30 min-h-32  max-h-[300px]"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                • All code snippets are framework-ready and include your method,
                headers, and body data
              </p>
              <p>
                • Choose your preferred language or framework from the tabs
                above
              </p>
              <p>
                • Perfect for developers working across different tech stacks
              </p>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Paste cURL Command</Label>
              <Textarea
                value={curlInput}
                onChange={(e) => {
                  setCurlInput(e.target.value);
                  setImportError("");
                }}
                className="font-mono text-sm min-h-32  max-h-[300px]"
                placeholder={`curl -X POST 'https://api.example.com/users' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer your-token' \\
  -d '{"name": "John Doe", "email": "john@example.com"}'`}
              />
              {importError && (
                <p className="text-sm text-destructive">{importError}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  • Paste any cURL command to automatically fill the request
                  form
                </p>
                <p>• Supports headers, request body, and HTTP methods</p>
                <p>• Works with cURL commands from browser dev tools</p>
              </div>

              <Button
                onClick={handleImportCurl}
                disabled={!curlInput.trim()}
                className="flex items-center gap-2"
              >
                <Import className="w-4 h-4" />
                Import cURL
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
