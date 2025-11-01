"use client";

import { EmptyState } from "@/components/chatBox-components/EmptyState";

export default function DirectMessagesPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <EmptyState />
    </div>
  );
}