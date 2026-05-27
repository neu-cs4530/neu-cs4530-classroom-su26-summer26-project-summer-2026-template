import { type CommentInfo } from "@gamenite/shared";
import { populateSafeUserInfo } from "./user.service.ts";
import { randomUUID } from "node:crypto";
import { type UserWithId } from "../types.ts";
import type { CommentRecord } from "../models.ts";

const storedComments: { [commentId: string]: CommentRecord } = {};

/**
 * Expand a stored comment
 *
 * @param commentId - Valid comment id
 * @returns the expanded comment info object
 */
export function populateCommentInfo(commentId: string): CommentInfo {
  const comment = storedComments[commentId];
  return {
    commentId,
    text: comment.text,
    createdAt: new Date(comment.createdAt),
    createdBy: populateSafeUserInfo(comment.createdBy),
    editedAt: comment.editedAt ? new Date(comment.editedAt) : undefined,
  };
}

/**
 * Creates and stores a new comment
 *
 * @param userId - a valid user id
 * @param text - the comment's text
 * @param createdAt - the time of comment creation
 * @returns the comment's info object
 */
export function createComment(user: UserWithId, text: string, createdAt: Date): CommentInfo {
  const id = randomUUID().toString();
  const comment: CommentRecord = {
    text,
    createdAt: createdAt.toISOString(),
    createdBy: user.userId,
  };
  storedComments[id] = comment;
  return populateCommentInfo(id);
}
