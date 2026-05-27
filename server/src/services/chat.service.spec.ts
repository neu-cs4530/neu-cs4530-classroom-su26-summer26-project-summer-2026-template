import { describe, expect, it } from "vitest";
import { addMessageToChat, createChat, forceChatById } from "./chat.service.ts";
import { createMessage } from "./message.service.ts";
import { getUserByUsername } from "./user.service.ts";

describe("forceChatById", () => {
  it("returns a valid chat given a valid chat ID", () => {
    const user1 = getUserByUsername("user1")!;
    const chat = createChat(new Date());
    expect(forceChatById(chat.chatId, user1)).toStrictEqual(chat);
  });

  it("throws for an invalid chat ID", () => {
    const user1 = getUserByUsername("user1")!;
    expect(() => forceChatById("fake", user1)).toThrow(
      new Error("user user1 accessed invalid chat id"),
    );
  });
});

describe("addMessageToChat", () => {
  it("adds chats in order", () => {
    const user1 = getUserByUsername("user1")!;
    const message1 = createMessage(user1, "Hello world 1", new Date());
    const message2 = createMessage(user1, "Hello world 2", new Date());
    const chat = createChat(new Date());
    addMessageToChat(chat.chatId, user1, message1.messageId);
    addMessageToChat(chat.chatId, user1, message2.messageId);
    expect(forceChatById(chat.chatId, user1)).toStrictEqual({
      chatId: chat.chatId,
      createdAt: chat.createdAt,
      messages: [message1, message2],
    });
  });

  it("throws for an invalid chat ID", () => {
    const user1 = getUserByUsername("user1")!;
    const message = createMessage(user1, "Hello world", new Date());
    expect(() => addMessageToChat("fake", user1, message.messageId)).toThrow(
      new Error("user user1 sent to invalid chat id"),
    );
  });
});
