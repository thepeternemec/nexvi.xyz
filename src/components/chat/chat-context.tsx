import { createContext, useContext } from "react";

export type ChatContextValue = {
  insertPrompt?: (slug: string) => void;
};

export const ChatContext = createContext<ChatContextValue>({});

export function useChatContext() {
  return useContext(ChatContext);
}
