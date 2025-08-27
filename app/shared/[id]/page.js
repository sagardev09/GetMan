'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Copy, 
  CheckCircle2, 
  Share2, 
  Calendar,
  Folder,
  FileText,
  Globe,
  Zap,
  ExternalLink,
  Code2,
  FileX,
  AlertCircle
} from 'lucide-react';
import { getMethodColor } from '@/lib/constants';
import { generateCurl } from '@/lib/curlUtils';
import {
  generateFetch,
  generateAxios,
  generatePython,
  generateGo,
  generateNodeJs,
} from '@/lib/codeGenerators';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function SharedPage() {
  const params = useParams();
  const [sharedData, setSharedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedContent, setCopiedContent] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentCodeRequest, setCurrentCodeRequest] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchSharedData(params.id);
    }
  }, [params.id]);

  const fetchSharedData = async (shareId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/share?id=${shareId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch shared content');
      }

      setSharedData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (content, type) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedContent(type);
      setTimeout(() => setCopiedContent(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatJson = (data) => {
    try {
      if (typeof data === 'string') {
        return JSON.stringify(JSON.parse(data), null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return data;
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'default';
    if (status >= 300 && status < 400) return 'secondary';
    if (status >= 400) return 'destructive';
    return 'outline';
  };

  const showCode = (request) => {
    setCurrentCodeRequest(request);
    setShowCodeModal(true);
  };

  const generateCodeSnippets = (request) => {
    return {
      curl: generateCurl(request),
      fetch: generateFetch(request),
      axios: generateAxios(request),
      python: generatePython(request),
      go: generateGo(request),
      nodejs: generateNodeJs(request),
    };
  };

  const RequestCard = ({ request, response }) => (
    <Card className="w-full mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={getMethodColor(request.method)}>
              {request.method}
            </Badge>
            <CardTitle className="text-lg">{request.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => showCode(request)}
              title="View code snippets"
            >
              <Code2 className="w-4 h-4 mr-1" />
              Code
            </Button>
            {response && (
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(response.status)}>
                  {response.status} {response.statusText}
                </Badge>
                {response.responseTime && (
                  <Badge variant="outline">{response.responseTime}ms</Badge>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground break-all">{request.url}</p>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Request Details</TabsTrigger>
            {response && (
              <TabsTrigger value="response">Response</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            {/* Headers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Headers</h4>
                {request.headers && request.headers.filter(h => h.key && h.value).length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(
                      request.headers
                        .filter(h => h.key && h.value)
                        .map(h => `${h.key}: ${h.value}`)
                        .join('\n'),
                      `headers-${request.method}-${request.url}`
                    )}
                  >
                    {copiedContent === `headers-${request.method}-${request.url}` ? (
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    Copy
                  </Button>
                )}
              </div>
              <Card>
                <CardContent className="p-4">
                  {request.headers && request.headers.filter(h => h.key && h.value).length > 0 ? (
                    <div className="space-y-2">
                      {request.headers
                        .filter(h => h.key && h.value)
                        .map((header, index) => (
                          <div key={index} className="flex items-center gap-2 py-1 border-b last:border-b-0">
                            <span className="font-mono text-sm font-medium min-w-32">
                              {header.key}:
                            </span>
                            <span className="font-mono text-sm text-muted-foreground flex-1 break-all">
                              {header.value}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <div className="text-center">
                        <FileX className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">No headers specified</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>


            {/* Body */}
            {request.body && request.body.trim() && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Request Body</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(
                      formatJson(request.body),
                      `body-${request.method}-${request.url}`
                    )}
                  >
                    {copiedContent === `body-${request.method}-${request.url}` ? (
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    Copy
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="h-64 w-full">
                      <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                        {formatJson(request.body)}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {response && (
            <TabsContent value="response" className="mt-4">
              <Tabs defaultValue="pretty" className="w-full">
                <TabsList>
                  <TabsTrigger value="pretty">Pretty</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                </TabsList>

                <TabsContent value="pretty" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Response Body</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(
                          formatJson(response.data),
                          `response-pretty-${request.url}`
                        )}
                      >
                        {copiedContent === `response-pretty-${request.url}` ? (
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                        ) : (
                          <Copy className="w-4 h-4 mr-1" />
                        )}
                        Copy
                      </Button>
                    </div>

                    <Card>
                      <CardContent className="p-0">
                        <ScrollArea className="h-96 w-full">
                          <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                            {formatJson(response.data)}
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="raw" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Raw Response</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(
                          typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
                          `response-raw-${request.url}`
                        )}
                      >
                        {copiedContent === `response-raw-${request.url}` ? (
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                        ) : (
                          <Copy className="w-4 h-4 mr-1" />
                        )}
                        Copy
                      </Button>
                    </div>

                    <Card>
                      <CardContent className="p-0">
                        <ScrollArea className="h-96 w-full">
                          <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                            {typeof response.data === 'string' ? response.data : JSON.stringify(response.data)}
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="headers" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Response Headers</span>
                      {response.headers && Object.keys(response.headers).length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(
                            Object.entries(response.headers || {})
                              .map(([key, value]) => `${key}: ${value}`)
                              .join('\n'),
                            `response-headers-${request.url}`
                          )}
                        >
                          {copiedContent === `response-headers-${request.url}` ? (
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                          ) : (
                            <Copy className="w-4 h-4 mr-1" />
                          )}
                          Copy All
                        </Button>
                      )}
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        {response.headers && Object.keys(response.headers).length > 0 ? (
                          <div className="space-y-2">
                            {Object.entries(response.headers || {}).map(([key, value], index) => (
                              <div key={index} className="flex items-start gap-2 py-1 border-b last:border-b-0">
                                <span className="font-mono text-sm font-medium min-w-32">
                                  {key}:
                                </span>
                                <span className="font-mono text-sm text-muted-foreground flex-1 break-all">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-8 text-muted-foreground">
                            <div className="text-center">
                              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">No response headers available</p>
                              <p className="text-xs mt-1">Headers may not be captured or response failed</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200 dark:border-slate-700 mx-auto mb-6"></div>
          <p className="text-muted-foreground font-medium">Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Content Not Found</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Go to GetMan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              GetMan
            </span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Shared
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Shared {new Date(sharedData.createdAt).toLocaleDateString()}
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => window.open('/', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Try GetMan
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {sharedData.type === 'collection' ? (
            <>
              {/* Collection Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Folder className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{sharedData.data.collectionName}</h1>
                    <p className="text-muted-foreground">
                      {sharedData.data.requests.length} API {sharedData.data.requests.length === 1 ? 'request' : 'requests'}
                    </p>
                  </div>
                </div>
                <Separator />
              </div>

              {/* Collection Requests */}
              <div className="space-y-6">
                {sharedData.data.requests.map((request, index) => (
                  <RequestCard 
                    key={index} 
                    request={request} 
                    response={request.response} 
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Single Request Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{sharedData.data.name}</h1>
                    <p className="text-muted-foreground">Shared API Request</p>
                  </div>
                </div>
                <Separator />
              </div>

              {/* Single Request */}
              <RequestCard 
                request={sharedData.data} 
                response={sharedData.data.response} 
              />
            </>
          )}
        </div>
      </main>

      {/* Code Modal */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Code Snippets</DialogTitle>
          </DialogHeader>
          {currentCodeRequest && (
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="fetch">Fetch</TabsTrigger>
                <TabsTrigger value="axios">Axios</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                <TabsTrigger value="go">Go</TabsTrigger>
              </TabsList>
              {Object.entries(generateCodeSnippets(currentCodeRequest)).map(([type, code]) => (
                <TabsContent key={type} value={type} className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium capitalize">{type === 'nodejs' ? 'Node.js' : type} Code</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(code, `code-${type}`)}
                      >
                        {copiedContent === `code-${type}` ? (
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                        ) : (
                          <Copy className="w-4 h-4 mr-1" />
                        )}
                        Copy
                      </Button>
                    </div>
                    <Card>
                      <CardContent className="p-0">
                        <ScrollArea className="h-64 w-full">
                          <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                            {code}
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span className="text-sm">
              Powered by GetMan - The Modern API Testing Tool
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}