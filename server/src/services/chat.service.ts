import { randomUUID } from "node:crypto";
import { type ChatInfo } from "@gamenite/shared";
import { getMessagesById } from "./message.service.ts";
import { type UserWithId } from "../types.ts";
import type { ChatRecord, RecordId } from "../models.ts";

export const storedChats: { [chatId: string]: ChatRecord } = {};

/**
 * Expand a stored chat
 *
 * @param chatId - Valid chat id
 * @returns the expanded chat info object
 */
function populateChatInfo(chatId: RecordId): ChatInfo {
  const chat = storedChats[chatId];
  return {
    chatId,
    createdAt: new Date(chat.createdAt),
    messages: getMessagesById(chat.messages),
  };
}

/**
 * Creates and store a new chat
 *
 * @param createdAt - Time of chat creation
 * @returns the chat's info object
 */
export function createChat(createdAt: Date): ChatInfo {
  const id = randomUUID().toString();
  const chat: ChatRecord = {
    createdAt: createdAt.toISOString(),
    messages: [],
  };
  storedChats[id] = chat;
  return populateChatInfo(id);
}

/**
 * Produces the chat for a given id
 *
 * @param chatId - Ostensible chat id
 * @param user - Authenticated user
 * @returns the chat's info object
 * @throws if the chat id is not valid
 */
export function forceChatById(chatId: string, user: UserWithId): ChatInfo {
  const chat = storedChats[chatId];
  if (!chat) throw new Error(`user ${user.username} accessed invalid chat id`);

  return populateChatInfo(chatId);
}

/**
 * Adds a message to a chat, updating the chat
 *
 * @param chatId - Ostensible chat id
 * @param user - Authenticated user
 * @param message - Valid message id
 * @returns the updated chat info object
 * @throws if the chat id is not valid
 */
export function addMessageToChat(chatId: string, user: UserWithId, messageId: RecordId): ChatInfo {
  const chat = storedChats[chatId];
  if (!chat) throw new Error(`user ${user.username} sent to invalid chat id`);
  const newChat: ChatRecord = {
    ...chat,
    messages: [...chat.messages, messageId],
  };
  storedChats[chatId] = newChat;
  return populateChatInfo(chatId);
}
