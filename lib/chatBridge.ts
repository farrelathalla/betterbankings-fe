// The chat widget is mounted once by app/regmaps/layout.tsx, so components on a
// page can't reach it through props. They ask it a question through this window
// event instead; ChatWidget listens for it, opens itself and sends the question.

export const ASK_CHAT_EVENT = "regmaps:ask-chat";

export interface AskChatDetail {
  question: string;
}

export function askChatbot(question: string) {
  window.dispatchEvent(
    new CustomEvent<AskChatDetail>(ASK_CHAT_EVENT, { detail: { question } }),
  );
}
