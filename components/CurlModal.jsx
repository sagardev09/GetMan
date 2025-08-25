'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle2, Import, Code2 } from 'lucide-react';
import { generateCurl, parseCurl, isCurlCommand } from '@/lib/curlUtils';

export default function CurlModal({ isOpen, onClose, requestData, onImportCurl }) {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [curlInput, setCurlInput] = useState('');
  const [importError, setImportError] = useState('');
  const [activeTab, setActiveTab] = useState('generate');

  // Generate curl command from current request data
  const generatedCurl = generateCurl(requestData);

  const handleCopyCurl = async () => {
    try {
      await navigator.clipboard.writeText(generatedCurl);
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    } catch (err) {
      console.error('Failed to copy curl:', err);
    }
  };

  const handleImportCurl = () => {
    setImportError('');
    
    if (!curlInput.trim()) {
      setImportError('Please enter a curl command');
      return;
    }

    if (!isCurlCommand(curlInput)) {
      setImportError('Invalid curl command format');
      return;
    }

    try {
      const parsedData = parseCurl(curlInput);
      console.log('Parsed curl data:', parsedData); // Debug log
      
      if (!parsedData || !parsedData.url) {
        setImportError('Could not extract URL from curl command');
        return;
      }

      onImportCurl(parsedData);
      setCurlInput('');
      setImportError('');
      onClose();
    } catch (error) {
      setImportError('Failed to parse curl command');
      console.error('Curl parsing error:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'import') {
      setImportError('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            cURL Commands
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Generate cURL
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Import className="w-4 h-4" />
              Import cURL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Generated cURL Command</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCurl}
                  disabled={!generatedCurl}
                >
                  {copiedCurl ? (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copiedCurl ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              
              {generatedCurl ? (
                <Textarea
                  value={generatedCurl}
                  readOnly
                  className="font-mono text-sm bg-slate-50 min-h-32"
                  placeholder="Configure your request above to generate a cURL command"
                />
              ) : (
                <div className="text-center text-muted-foreground py-8 border rounded-md bg-slate-50">
                  <Code2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Add a URL to your request to generate a cURL command</p>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• This cURL command includes your method, headers, and body data</p>
              <p>• Copy and paste it into your terminal to execute the same request</p>
              <p>• Perfect for sharing API requests with team members</p>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Paste cURL Command</Label>
              <Textarea
                value={curlInput}
                onChange={(e) => {
                  setCurlInput(e.target.value);
                  setImportError('');
                }}
                className="font-mono text-sm min-h-32"
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
                <p>• Paste any cURL command to automatically fill the request form</p>
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