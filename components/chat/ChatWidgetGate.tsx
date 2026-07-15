"use client";

import { useAuth } from "@/hooks/useAuth";
import ChatWidget from "./ChatWidget";

export default function ChatWidgetGate() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;
  return <ChatWidget />;
}
