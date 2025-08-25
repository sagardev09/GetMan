"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Plus,
  Folder,
  FileText,
  Clock,
  Trash2,
  Edit,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useRequests } from "@/hooks/useRequests";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import HistoryDetailModal from "./HistoryDetailModal";
import { getMethodColor } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Sidebar({ onLoadRequest, onNewRequest, onLogout }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const {
    requests,
    collections,
    history,
    loading,
    createCollection,
    addRequestToCollection,
    deleteRequest,
    fetchRequests,
    fetchCollections,
    fetchHistory,
  } = useRequests();
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewCollectionDialog, setShowNewCollectionDialog] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [expandedCollections, setExpandedCollections] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchRequests(), fetchCollections(), fetchHistory()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;

    const result = await createCollection(newCollectionName.trim());
    if (result.success) {
      setNewCollectionName("");
      setShowNewCollectionDialog(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    onLogout && onLogout();
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return "default";
    if (status >= 300 && status < 400) return "secondary";
    if (status >= 400) return "destructive";
    return "outline";
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleHistoryItemClick = (historyItem) => {
    setSelectedHistoryItem(historyItem);
    setShowHistoryModal(true);
  };

  const handleTestAgain = (requestData) => {
    onLoadRequest(requestData);
  };

  const toggleCollectionExpanded = (collectionId) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId);
    } else {
      newExpanded.add(collectionId);
    }
    setExpandedCollections(newExpanded);
  };

  const getCollectionRequests = (collection) => {
    try {
      let requestIds = collection.requests || [];

      // Handle legacy data that might be stored as JSON string
      if (typeof requestIds === "string") {
        requestIds = JSON.parse(requestIds);
      }

      // Ensure it's an array
      if (!Array.isArray(requestIds)) {
        requestIds = [];
      }

      return requests.filter((req) => requestIds.includes(req.$id));
    } catch {
      return [];
    }
  };

  return (
    <Card className="h-full flex flex-col py-0">
      <CardHeader className=" flex-shrink-0 pt-2  ">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">GetMan</CardTitle>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span className="text-sm text-muted-foreground truncate max-w-20">
                    {user?.name || user?.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between gap-4 px-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2"
              title="Refresh data"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={onNewRequest}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              New
            </Button>
          </div>
        </div>
        <Tabs defaultValue="requests" className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between mx-4 my-2 flex-shrink-0">
            <TabsList className="grid grid-cols-3 flex-1 mr-2">
              <TabsTrigger value="requests">Saved</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="requests"
            className="flex-1 flex flex-col overflow-hidden p-4 pt-2"
          >
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <Label className="text-sm font-medium">Saved Requests</Label>
              <Badge variant="outline" className="text-xs">
                {requests.length}
              </Badge>
            </div>

            <ScrollArea className="flex-1 min-h-0 max-h-full">
              <div className="space-y-1 pr-2">
                {loading ? (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Loading...
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No saved requests yet
                  </div>
                ) : (
                  requests.map((request) => (
                    <div
                      key={request.$id}
                      className="group p-2 rounded-md hover:bg-muted cursor-pointer border"
                      onClick={() =>
                        onLoadRequest({
                          ...request,
                          headers:
                            typeof request.headers === "string"
                              ? JSON.parse(request.headers || "{}")
                              : request.headers,
                        })
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={`text-xs ${getMethodColor(
                                request.method
                              )}`}
                            >
                              {request.method}
                            </Badge>
                            <span className="text-sm font-medium truncate">
                              {request.name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {request.url}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRequest(request.$id);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="collections"
            className="flex-1 flex flex-col overflow-hidden p-4 pt-2"
          >
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <Label className="text-sm font-medium">Collections</Label>
              <Dialog
                open={showNewCollectionDialog}
                onOpenChange={setShowNewCollectionDialog}
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Collection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="collection-name">Collection Name</Label>
                      <Input
                        id="collection-name"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        placeholder="Enter collection name"
                        className="mt-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleCreateCollection();
                          }
                        }}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowNewCollectionDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateCollection}>Create</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="flex-1 min-h-0 max-h-full">
              <div className="space-y-1 pr-2">
                {collections.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No collections yet
                  </div>
                ) : (
                  collections.map((collection) => {
                    const collectionRequests =
                      getCollectionRequests(collection);
                    const isExpanded = expandedCollections.has(collection.$id);

                    return (
                      <Collapsible key={collection.$id}>
                        <div className="border rounded-md">
                          <CollapsibleTrigger asChild>
                            <div
                              className="p-2 hover:bg-muted cursor-pointer flex items-center justify-between w-full"
                              onClick={() =>
                                toggleCollectionExpanded(collection.$id)
                              }
                            >
                              <div className="flex items-center gap-2">
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                                <Folder className="w-4 h-4" />
                                <span className="text-sm font-medium truncate">
                                  {collection.collectionName}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {collectionRequests.length}
                              </Badge>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="border-t">
                              {collectionRequests.length === 0 ? (
                                <div className="p-3 text-center text-xs text-muted-foreground">
                                  No requests in this collection
                                </div>
                              ) : (
                                <div className="space-y-1 p-2">
                                  {collectionRequests.map((request) => (
                                    <div
                                      key={request.$id}
                                      className="group p-2 rounded-md hover:bg-muted cursor-pointer border ml-4"
                                      onClick={() =>
                                        onLoadRequest({
                                          ...request,
                                          headers:
                                            typeof request.headers === "string"
                                              ? JSON.parse(
                                                  request.headers || "{}"
                                                )
                                              : request.headers,
                                        })
                                      }
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <Badge
                                              className={`text-xs ${getMethodColor(
                                                request.method
                                              )}`}
                                            >
                                              {request.method}
                                            </Badge>
                                            <span className="text-sm font-medium truncate">
                                              {request.name}
                                            </span>
                                          </div>
                                          <p className="text-xs text-muted-foreground truncate">
                                            {request.url}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="history"
            className="flex-1 flex flex-col overflow-hidden p-4 pt-2"
          >
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <Label className="text-sm font-medium">Request History</Label>
              <Badge variant="outline" className="text-xs">
                {history.length}
              </Badge>
            </div>

            <ScrollArea className="flex-1 min-h-0 max-h-full">
              <div className="space-y-1 pr-2">
                {history.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No history yet
                  </div>
                ) : (
                  history.map((historyItem) => (
                    <div
                      key={historyItem.$id}
                      className="p-2 rounded-md hover:bg-muted cursor-pointer border"
                      onClick={() => handleHistoryItemClick(historyItem)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs ${getMethodColor(
                              historyItem.method
                            )}`}
                          >
                            {historyItem.method}
                          </Badge>
                          <Badge
                            variant={getStatusColor(historyItem.status)}
                            className="text-xs"
                          >
                            {historyItem.status}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {historyItem.responseTime}ms
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {historyItem.url}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(historyItem.$createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* History Detail Modal */}
      <HistoryDetailModal
        historyItem={selectedHistoryItem}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onTestAgain={handleTestAgain}
      />
    </Card>
  );
}
