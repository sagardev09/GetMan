"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Copy,
  CheckCircle2,
  Share2,
  ExternalLink,
  Loader2,
  Folder,
  FileText,
  Clock,
  AlertTriangle
} from "lucide-react";

export default function ShareModal({
  isOpen,
  onClose,
  type, // 'collection' or 'request'
  data, // collection or request data
  onShare
}) {
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [includeResponse, setIncludeResponse] = useState(false);

  const handleShare = async () => {
    setIsLoading(true);
    setError("");

    try {
      let result;
      if (type === 'collection') {
        result = await onShare(data.$id);
      } else {
        result = await onShare(data.$id, includeResponse);
      }

      if (result.success) {
        setShareUrl(result.shareUrl);
        setIsShared(true);
      } else {
        setError(result.error || 'Failed to create share');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  const resetModal = () => {
    setShareUrl("");
    setIsShared(false);
    setError("");
    setCopied(false);
    setIsLoading(false);
    setIncludeResponse(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen || !data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share {type === 'collection' ? 'Collection' : 'API Request'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Item Details */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              type === 'collection' 
                ? 'bg-purple-100 dark:bg-purple-900/30' 
                : 'bg-green-100 dark:bg-green-900/30'
            }`}>
              {type === 'collection' ? (
                <Folder className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              ) : (
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {type === 'collection' ? data.collectionName : data.name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {type === 'collection' 
                  ? `${data.requests?.length || 0} requests`
                  : `${data.method} ${data.url}`
                }
              </p>
            </div>
          </div>

          {!isShared ? (
            <>
              {/* Options for request sharing */}
              {type === 'request' && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Share Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-response"
                      checked={includeResponse}
                      onCheckedChange={setIncludeResponse}
                    />
                    <Label 
                      htmlFor="include-response" 
                      className="text-sm flex items-center gap-2"
                    >
                      Include latest response data
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        From history
                      </Badge>
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    If enabled, the shared link will include the most recent response from your request history.
                  </p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert variant={error.includes('not set up') || error.includes('not configured') ? 'default' : 'destructive'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="space-y-2">
                    <div>{error}</div>
                    {(error.includes('not set up') || error.includes('not configured')) && (
                      <div className="pt-2 text-xs text-muted-foreground">
                        Please check the setup instructions in scripts/setup-sharing.md
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Share Button */}
              <Button
                onClick={handleShare}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Creating Share Link...' : 'Create Share Link'}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Share links expire after 30 days and don't require authentication to view.
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Share link created successfully!</span>
                </div>

                {/* Share URL */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Share URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      URL copied to clipboard!
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={openInNewTab}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    onClick={copyToClipboard}
                    className="flex-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  Anyone with this link can view the shared content.
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}