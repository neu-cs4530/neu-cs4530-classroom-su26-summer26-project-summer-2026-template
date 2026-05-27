import { randomUUID } from "node:crypto";
import { type CreateThreadMessage, type ThreadInfo, type ThreadSummary } from "@gamenite/shared";
import { getUserByUsername, populateSafeUserInfo } from "./user.service.ts";
import { createComment, populateCommentInfo } from "./comment.service.ts";
import { type UserWithId } from "../types.ts";
import type { ThreadRecord } from "../models.ts";

let storedThreads: { [threadId: string]: ThreadRecord } = {};

/** Reset stored threads with example data */
export function resetStoredThreads() {
  const user0id = getUserByUsername("user0")!.userId;
  const user1id = getUserByUsername("user1")!.userId;
  const user2id = getUserByUsername("user2")!.userId;
  const user3id = getUserByUsername("user3")!.userId;

  storedThreads = {
    abadcafeabadcafeabadcafe: {
      createdBy: user1id,
      createdAt: new Date().toISOString(),
      title: "Nim?",
      text: "Is anyone around that wants to play Nim? I'll be here for the next hour or so.",
      comments: [],
    },
    deadbeefdeadbeefdeadbeef: {
      createdBy: user1id,
      createdAt: new Date("2025-04-02").toISOString(),
      title: "Hello game knights",
      text: "I'm a big Nim buff and am excited to join this community.",
      comments: [],
    },
    [randomUUID().toString()]: {
      createdBy: user3id,
      createdAt: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      title: "Other games?",
      text: "Nim is great, but I'm hoping some new strategy games will get introduced soon.",
      comments: [],
    },
    [randomUUID().toString()]: {
      createdBy: user2id,
      createdAt: new Date("2025-04-04").toISOString(),
      title: "Strategy guide?",
      text: "I'm pretty confused about the right strategy for Nim, is there anyone around who can help explain this?",
      comments: [],
    },
    [randomUUID().toString()]: {
      createdBy: user0id,
      createdAt: new Date(new Date().getTime() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
      title: "New game: multiplayer number guesser!",
      text: "Strategy.town now has an exciting new game: guess! Try it out today: multiple people can join this exciting game, and guess a number between 1 and 100!",
      comments: [],
    },
  };
}

/**
 * Expand a stored thread
 *
 * @param threadId - Valid thread id
 * @returns the expanded thread info object
 */
function populateThreadInfo(threadId: string): ThreadInfo {
  const thread = storedThreads[threadId];
  return {
    threadId,
    title: thread.title,
    text: thread.text,
    createdBy: populateSafeUserInfo(thread.createdBy),
    createdAt: new Date(thread.createdAt),
    comments: thread.comments.map(populateCommentInfo),
  };
}

/**
 * Expand just the summary information for a stored thread
 *
 * @param threadId - Valid thread id
 * @returns the expanded thread info object
 */
function populateThreadSummary(threadId: string) {
  const thread = storedThreads[threadId];
  return {
    threadId,
    title: thread.title,
    createdBy: populateSafeUserInfo(thread.createdBy),
    createdAt: new Date(thread.createdAt),
    comments: thread.comments.length,
  };
}

/**
 * Create and store a new thread
 *
 * @param user - The thread poster
 * @param contents - Title and text of the thread
 * @param createdAt - Creation time for this thread
 * @returns the new thread's info object
 */
export function createThread(
  user: UserWithId,
  { title, text }: CreateThreadMessage,
  createdAt: Date,
): ThreadInfo {
  const id = randomUUID().toString();
  const thread: ThreadRecord = {
    title,
    text,
    createdAt: createdAt.toISOString(),
    createdBy: user.userId,
    comments: [],
  };
  storedThreads[id] = thread;
  return populateThreadInfo(id);
}

/**
 * Retrieves a single thread from the database
 *
 * @param possibleThreadId - Ostensible thread ID
 * @returns the thread, or null if no thread with that ID exists
 */
export function getThreadById(possibleThreadId: string): ThreadInfo | null {
  const thread = storedThreads[possibleThreadId];
  if (!thread) return null;
  return populateThreadInfo(possibleThreadId);
}

/**
 * Get a list of all threads
 *
 * @returns a list of thread summaries, ordered reverse chronologically by creation date
 */
export function getThreadSummaries(): ThreadSummary[] {
  const unsorted = Object.keys(storedThreads).map(populateThreadSummary);
  return unsorted.toSorted(
    (thread1, thread2) => thread2.createdAt.getTime() - thread1.createdAt.getTime(),
  );
}

/**
 * Add a comment id to a thread
 * @param possibleThreadId - Ostensible thread ID
 * @param user - Commenting user
 * @param text - Contents of the thread
 * @param createdAt - Creation time for thread
 * @returns the updated thread with comment attached, or null if the thread does not exist
 */
export function addCommentToThread(
  possibleThreadId: string,
  user: UserWithId,
  text: string,
  createdAt: Date,
): ThreadInfo | null {
  const oldThread = storedThreads[possibleThreadId];
  if (!oldThread) return null;
  const threadId = possibleThreadId; // We know the thread ID is valid at this point
  const comment = createComment(user, text, createdAt);
  const newThread = { ...oldThread, comments: [...oldThread.comments, comment.commentId] };
  storedThreads[possibleThreadId] = newThread;
  return populateThreadInfo(threadId);
}
