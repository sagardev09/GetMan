"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, Table } from "lucide-react";
import DataTable from "./DataTable";

export default function ResponseViewer({ response }) {
  const [copiedContent, setCopiedContent] = useState(null);

  // Check if response data is an array suitable for table view
  const isTableData = useMemo(() => {
    if (!response || !response.data) return false;
    
    try {
      let data = response.data;
      
      // Parse JSON string if needed
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      // Must be array with more than 1 object
      return Array.isArray(data) && 
             data.length > 1 && 
             data.every(item => typeof item === 'object' && item !== null && !Array.isArray(item));
    } catch {
      return false;
    }
  }, [response]);

  const tableData = useMemo(() => {
    if (!isTableData || !response || !response.data) return null;
    
    try {
      let data = response.data;
      
      // Parse JSON string if needed
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch {
      return null;
    }
  }, [response, isTableData]);

  if (!response) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Send a request to see the response here
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return "default"; // green
    if (status >= 300 && status < 400) return "secondary"; // yellow
    if (status >= 400) return "destructive"; // red
    return "outline";
  };

  const formatJson = (data) => {
    try {
      if (typeof data === "string") {
        return JSON.stringify(JSON.parse(data), null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return data;
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

  const responseHeaders = Object.entries(response.headers || {}).map(
    ([key, value]) => ({
      key,
      value,
    })
  );

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Response</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(response.status)}>
              {response.status} {response.statusText}
            </Badge>
            {response.responseTime && (
              <Badge variant="outline">{response.responseTime}ms</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={isTableData ? "table" : "pretty"} className="w-full">
          <TabsList>
            {isTableData && (
              <TabsTrigger value="table" className="flex items-center gap-2">
                <Table className="w-4 h-4" />
                Table ({tableData?.length || 0})
              </TabsTrigger>
            )}
            <TabsTrigger value="pretty">Pretty</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="headers">
              Headers ({responseHeaders.length})
            </TabsTrigger>
          </TabsList>

          {isTableData && (
            <TabsContent value="table" className="mt-4">
              <DataTable 
                data={tableData} 
                title="Response Data"
              />
            </TabsContent>
          )}

          <TabsContent value="pretty" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Body</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(formatJson(response.data), "pretty")
                  }
                >
                  {copiedContent === "pretty" ? (
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                  ) : (
                    <Copy className="w-4 h-4 mr-1" />
                  )}
                  Copy
                </Button>
              </div>

              <ScrollArea className="h-[750px] w-full border rounded-md">
                <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                  {formatJson(response.data)}
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
                      typeof response.data === "string"
                        ? response.data
                        : JSON.stringify(response.data),
                      "raw"
                    )
                  }
                >
                  {copiedContent === "raw" ? (
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                  ) : (
                    <Copy className="w-4 h-4 mr-1" />
                  )}
                  Copy
                </Button>
              </div>

              <ScrollArea className="h-[750px] w-full border rounded-md">
                <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                  {typeof response.data === "string"
                    ? response.data
                    : JSON.stringify(response.data)}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Headers</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      responseHeaders
                        .map((h) => `${h.key}: ${h.value}`)
                        .join("\n"),
                      "headers"
                    )
                  }
                >
                  {copiedContent === "headers" ? (
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                  ) : (
                    <Copy className="w-4 h-4 mr-1" />
                  )}
                  Copy All
                </Button>
              </div>

              <ScrollArea className="h-[750px] w-full border rounded-md">
                <div className="p-4 space-y-2">
                  {responseHeaders.map(({ key, value }, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 py-1 border-b last:border-b-0"
                    >
                      <span className="font-mono text-sm font-medium min-w-32">
                        {key}:
                      </span>
                      <span className="font-mono text-sm text-muted-foreground flex-1 break-all">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
