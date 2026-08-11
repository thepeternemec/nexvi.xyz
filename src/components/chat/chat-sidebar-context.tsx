import { createContext, useContext } from "react";

export const ChatSidebarContext = createContext<{ openSidebar: () => void }>({
  openSidebar: () => undefined,
});

export function useChatSidebar() {
  return useContext(ChatSidebarContext);
}
