import { type MessageInfo } from "@gamenite/shared";
import { populateSafeUserInfo } from "./user.service.ts";
import { randomUUID } from "node:crypto";
import { type UserWithId } from "../types.ts";
import type { MessageRecord } from "../models.ts";

const storedMessages: { [messageId: string]: MessageRecord } = {};

/**
 * Expand a stored message
 *
 * @param messageId - Valid message id
 * @returns the expanded message info object
 */
function populateMessageInfo(messageId: string): MessageInfo {
  const message = storedMessages[messageId];
  return {
    messageId,
    text: message.text,
    createdAt: new Date(message.createdAt),
    createdBy: populateSafeUserInfo(message.createdBy),
  };
}

/**
 * Creates and stores a new message
 *
 * @param user - a valid user
 * @param text - the message's text
 * @param createdAt - the time of message creation
 * @returns the message's info object
 */
export function createMessage(user: UserWithId, text: string, createdAt: Date): MessageInfo {
  const messageId = randomUUID().toString();
  const message: MessageRecord = {
    text,
    createdAt: createdAt.toISOString(),
    createdBy: user.userId,
  };
  storedMessages[messageId] = message;
  return populateMessageInfo(messageId);
}

/**
 * Retrieves a list of message ids from the database
 *
 * @param ids - A list of valid message ids
 * @returns the MessageInfo objects corresponding to those ids
 * @throws if any of the ids are not valid
 */
export function getMessagesById(ids: string[]): MessageInfo[] {
  return ids.map(populateMessageInfo);
}
