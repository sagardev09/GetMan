"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info } from "lucide-react";

export default function CollectionSetupNotice() {
  const openSetupGuide = () => {
    window.open('/scripts/setup-sharing.md', '_blank');
  };

  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          To enable sharing, please set up the required Appwrite collections first.
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={openSetupGuide}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Setup Guide
        </Button>
      </AlertDescription>
    </Alert>
  );
}