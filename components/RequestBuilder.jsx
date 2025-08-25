"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Send, Save, Code2 } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import CurlModal from "./CurlModal";
import {
  COMMON_HEADERS,
  DEFAULT_HEADERS,
  getMethodColor,
} from "@/lib/constants";
import { useRequests } from "@/hooks/useRequests";

const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
];

export default function RequestBuilder({
  initialData,
  onSendRequest,
  onSaveRequest,
}) {
  const [requestData, setRequestData] = useState(
    initialData || {
      method: "GET",
      url: "",
      headers: DEFAULT_HEADERS,
      body: "",
      name: "",
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCurlModal, setShowCurlModal] = useState(false);

  // Update request data when initialData changes
  useEffect(() => {
    if (initialData) {
      setRequestData(initialData);
      // Set the selected collection if the request belongs to one
      setSelectedCollection(initialData.collectionId || null);
    }
  }, [initialData]);
  const { collections, saveRequestToCollection, removeRequestFromCollection, findRequestCollection } = useRequests();

  const handleMethodChange = (method) => {
    setRequestData((prev) => ({ ...prev, method }));
  };

  const handleUrlChange = (url) => {
    setRequestData((prev) => ({ ...prev, url }));
  };

  const addHeader = () => {
    setRequestData((prev) => ({
      ...prev,
      headers: [...prev.headers, { key: "", value: "" }],
    }));
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...requestData.headers];
    newHeaders[index][field] = value;
    setRequestData((prev) => ({ ...prev, headers: newHeaders }));
  };

  const removeHeader = (index) => {
    const newHeaders = requestData.headers.filter((_, i) => i !== index);
    setRequestData((prev) => ({
      ...prev,
      headers: newHeaders.length > 0 ? newHeaders : DEFAULT_HEADERS,
    }));
  };

  const handleBodyChange = (body) => {
    setRequestData((prev) => ({ ...prev, body }));
  };

  const handleSendRequest = async () => {
    if (!requestData.url.trim()) {
      alert("Please enter a URL");
      return;
    }

    setIsLoading(true);

    // Filter out empty headers
    const headers = requestData.headers
      .filter((header) => header.key.trim() && header.value.trim())
      .reduce((acc, header) => {
        acc[header.key.trim()] = header.value.trim();
        return acc;
      }, {});

    const request = {
      method: requestData.method,
      url: requestData.url.trim(),
      headers,
      body: requestData.method !== "GET" ? requestData.body : undefined,
    };

    try {
      await onSendRequest(request);
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRequest = async () => {
    if (!requestData.name.trim()) {
      const name = `${requestData.method} ${requestData.url}`;
      setRequestData((prev) => ({ ...prev, name }));
    }

    setIsSaving(true);
    
    try {
      if (selectedCollection) {
        // Save to specific collection
        const result = await saveRequestToCollection(
          requestData,
          selectedCollection
        );
        if (result.success) {
          // Keep collection selection for loaded requests
          if (!requestData.requestId) {
            setSelectedCollection(null);
          }
        }
        return result;
      } else {
        // Save as independent request - but first check if it needs to be removed from a collection
        if (requestData.requestId) {
          // Find current collection for this request
          const currentCollection = findRequestCollection(requestData.requestId);
          if (currentCollection) {
            // Remove from current collection since user wants it independent
            await removeRequestFromCollection(currentCollection.$id, requestData.requestId);
          }
        }
        return await onSaveRequest(requestData);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportCurl = (parsedData) => {
    setRequestData(prevData => ({
      ...prevData,
      method: parsedData.method || 'GET',
      url: parsedData.url || '',
      headers: parsedData.headers && parsedData.headers.length > 0 
        ? parsedData.headers 
        : DEFAULT_HEADERS,
      body: parsedData.body || ''
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Request Builder</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCurlModal(true)}
            >
              <Code2 className="w-4 h-4 mr-2" />
              cURL
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveRequest}
              disabled={!requestData.url.trim() || isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleSendRequest}
              disabled={isLoading || !requestData.url.trim()}
              size="sm"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Request Name and Collection */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="request-name">Request Name (optional)</Label>
            <Input
              id="request-name"
              value={requestData.name}
              onChange={(e) =>
                setRequestData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter request name"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Save to Collection (optional)</Label>
            <Select
              value={selectedCollection || "independent"}
              onValueChange={(value) =>
                setSelectedCollection(value === "independent" ? null : value)
              }
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select collection or save as independent request" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="independent">
                  <span className="text-muted-foreground">
                    Save as independent request
                  </span>
                </SelectItem>
                {collections.map((collection) => (
                  <SelectItem key={collection.$id} value={collection.$id}>
                    <div className="flex items-center gap-2">
                      <span>📁</span>
                      {collection.collectionName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Method and URL */}
        <div className="flex gap-2">
          <Select value={requestData.method} onValueChange={handleMethodChange}>
            <SelectTrigger className="w-32">
              <Badge className={getMethodColor(requestData.method)}>
                {requestData.method}
              </Badge>
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  <Badge className={`text-xs ${getMethodColor(method)}`}>
                    {method}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={requestData.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Enter URL (e.g., https://api.example.com/users)"
            className="flex-1"
          />
        </div>

        {/* Headers Section */}
        <div className="space-y-4  rounded-lg  bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start gap-4">
              <Label className="text-base font-semibold">Request Headers</Label>
              <div className="text-xs text-muted-foreground">
                {requestData.headers.length} header
                {requestData.headers.length !== 1 ? "s" : ""} configured
              </div>
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={addHeader}>
                <Plus className="w-4 h-4 mr-1" />
                Add Header
              </Button>
            </div>
          </div>

          <div
            className="border rounded-md bg-white max-h-80 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 #f1f5f9",
            }}
          >
            <div className="space-y-3 p-4">
              {requestData.headers.map((header, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center p-3 border rounded-md bg-slate-50/30 hover:bg-slate-100/50 transition-colors shadow-sm"
                >
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground mb-1 block font-medium">
                      Header Name
                    </Label>
                    <Combobox
                      value={header.key}
                      onValueChange={(value) =>
                        updateHeader(index, "key", value)
                      }
                      options={COMMON_HEADERS}
                      placeholder="Select or type header name"
                      searchPlaceholder="Search headers..."
                      emptyMessage="No headers found."
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground mb-1 block font-medium">
                      Header Value
                    </Label>
                    <Input
                      value={header.value}
                      onChange={(e) =>
                        updateHeader(index, "value", e.target.value)
                      }
                      placeholder="Enter header value"
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col justify-end pb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeHeader(index)}
                      disabled={requestData.headers.length === 1}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Remove header"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Request Body Section */}
        {requestData.method !== "GET" && (
          <div className="space-y-4 border rounded-lg p-4 bg-slate-50/50">
            <Label className="text-base font-semibold">Request Body</Label>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                JSON Content
              </Label>
              <Textarea
                value={requestData.body}
                onChange={(e) => handleBodyChange(e.target.value)}
                placeholder={`{
  "key": "value",
  "array": [1, 2, 3]
}`}
                className="min-h-32 font-mono text-sm bg-white"
              />
            </div>
          </div>
        )}
      </CardContent>

      {/* cURL Modal */}
      <CurlModal
        isOpen={showCurlModal}
        onClose={() => setShowCurlModal(false)}
        requestData={requestData}
        onImportCurl={handleImportCurl}
      />
    </Card>
  );
}
