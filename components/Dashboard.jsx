"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "./Sidebar";
import RequestBuilder from "./RequestBuilder";
import ResponseViewer from "./ResponseViewer";
import { useRequests } from "@/hooks/useRequests";

export default function Dashboard() {
  const [currentResponse, setCurrentResponse] = useState(null);
  const [loadedRequest, setLoadedRequest] = useState(null);
  const [requestKey, setRequestKey] = useState(0); // Force re-render of RequestBuilder
  const { toast } = useToast();
  const { saveRequest, saveToHistory, findRequestCollection } = useRequests();

  const handleSendRequest = async (requestData) => {
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Request failed");
      }

      setCurrentResponse(result);

      // Save to history
      await saveToHistory(requestData, result);

      toast({
        title: "Request completed",
        description: `${requestData.method} ${requestData.url} - ${result.status} ${result.statusText}`,
      });
    } catch (error) {
      console.error("Request failed:", error);

      const errorResponse = {
        status: 0,
        statusText: "Network Error",
        headers: {},
        data: { error: error.message },
        responseTime: 0,
      };

      setCurrentResponse(errorResponse);

      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveRequest = async (requestData) => {
    try {
      const result = await saveRequest(requestData);

      if (result.success) {
        toast({
          title: result.updated ? "Request updated" : "Request saved",
          description: result.updated
            ? `"${requestData.name || "Untitled Request"}" has been updated`
            : `"${requestData.name || "Untitled Request"}" has been saved`,
        });
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Failed to save request",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const handleLoadRequest = (request) => {
    // Find which collection this request belongs to
    const collection = findRequestCollection(request.$id);

    setLoadedRequest({
      name: request.name,
      method: request.method,
      url: request.url,
      headers: Array.isArray(request.headers)
        ? request.headers
        : Object.entries(request.headers || {}).map(([key, value]) => ({
            key,
            value,
          })),
      body: request.body || "",
      collectionId: collection?.$id || null, // Add collection ID
      requestId: request.$id, // Add request ID for tracking
    });
    setRequestKey((prev) => prev + 1); // Force re-render

    toast({
      title: "Request loaded",
      description: `Loaded "${request.name}"`,
    });
  };

  const handleNewRequest = () => {
    setLoadedRequest(null);
    setCurrentResponse(null);
    setRequestKey((prev) => prev + 1); // Force re-render

    toast({
      title: "New request",
      description: "Ready to create a new request",
    });
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-[500px] border-r border-border bg-card">
        <div className="h-full p-3">
          <Sidebar
            onLoadRequest={handleLoadRequest}
            onNewRequest={handleNewRequest}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-row min-w-0 ">
        {/* Request Builder */}
        <div className="w-1/2 border-b border-border bg-background">
          <div className="h-full p-3 overflow-auto ">
            <RequestBuilder
              key={`${requestKey}-${
                loadedRequest ? JSON.stringify(loadedRequest) : "empty"
              }`}
              initialData={loadedRequest}
              onSendRequest={handleSendRequest}
              onSaveRequest={handleSaveRequest}
            />
          </div>
        </div>

        {/* Response Viewer */}
        <div className="h-full w-1/2 bg-background">
          <div className="h-full p-3 overflow-auto">
            <ResponseViewer response={currentResponse} />
          </div>
        </div>
      </div>
    </div>
  );
}
