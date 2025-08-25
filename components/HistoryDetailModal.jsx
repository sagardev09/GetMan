"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Play } from "lucide-react";
import { useState } from "react";
import { getMethodColor } from "@/lib/constants";

export default function HistoryDetailModal({
  historyItem,
  isOpen,
  onClose,
  onTestAgain,
}) {
  const [copiedContent, setCopiedContent] = useState(null);

  if (!historyItem) return null;

  // Parse the response data
  let responseData;
  try {
    responseData =
      typeof historyItem.response === "string"
        ? JSON.parse(historyItem.response)
        : historyItem.response;
  } catch {
    responseData = historyItem.response || {};
  }

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return "default";
    if (status >= 300 && status < 400) return "secondary";
    if (status >= 400) return "destructive";
    return "outline";
  };

  const formatJson = (data) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const copyToClipboard = async (content, type) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedContent(type);
      setTimeout(() => setCopiedContent(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleTestAgain = () => {
    const requestData = {
      name: `${historyItem.method} ${historyItem.url}`,
      method: historyItem.method,
      url: historyItem.url,
      headers: [], // History doesn't store request headers, only response
      body: "",
    };
    onTestAgain(requestData);
    onClose();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl min-w-4xl max-h-[80vh] min-h-[90vh]">
        <DialogHeader className={"mt-4"}>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Badge className={getMethodColor(historyItem.method)}>{historyItem.method}</Badge>
              History Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor(historyItem.status)}>
                {historyItem.status}
              </Badge>
              <Badge variant="outline">{historyItem.responseTime}ms</Badge>
              <Button size="sm" onClick={handleTestAgain}>
                <Play className="w-4 h-4 mr-1" />
                Test Again
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium text-sm">URL:</span>
                <p className="text-sm text-muted-foreground break-all mt-1">
                  {historyItem.url}
                </p>
              </div>
              <div>
                <span className="font-medium text-sm">Method:</span>
                <Badge className={`ml-2 ${getMethodColor(historyItem.method)}`}>
                  {historyItem.method}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-sm">Executed At:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatTime(historyItem.$createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Response Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Response</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(historyItem.status)}>
                    Status: {historyItem.status}
                  </Badge>
                  <Badge variant="outline">{historyItem.responseTime}ms</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pretty" className="w-full">
                <TabsList>
                  <TabsTrigger value="pretty">Pretty</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                </TabsList>

                <TabsContent value="pretty" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Response Data</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(formatJson(responseData), "pretty")
                        }
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        {copiedContent === "pretty" ? "Copied!" : "Copy"}
                      </Button>
                    </div>

                    <ScrollArea className="h-64 w-full border rounded-md">
                      <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                        {formatJson(responseData)}
                      </pre>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="raw" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Raw Response</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            typeof responseData === "string"
                              ? responseData
                              : JSON.stringify(responseData),
                            "raw"
                          )
                        }
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        {copiedContent === "raw" ? "Copied!" : "Copy"}
                      </Button>
                    </div>

                    <ScrollArea className="h-64 w-full border rounded-md">
                      <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                        {typeof responseData === "string"
                          ? responseData
                          : JSON.stringify(responseData)}
                      </pre>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
