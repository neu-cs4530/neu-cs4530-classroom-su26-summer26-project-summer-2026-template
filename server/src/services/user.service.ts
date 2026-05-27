import { type SafeUserInfo, type UserAuth, type UserUpdateRequest } from "@gamenite/shared";
import { randomUUID } from "node:crypto";
import type { UserRecord, AuthRecord } from "../models.ts";
import type { UserWithId } from "../types.ts";

const disallowedUsernames = new Set(["login", "signup", "list"]);

let storedUsers: { [userId: string]: UserRecord } = {};

// remove this comment and the next eslint-disable annotation when you submit the assignment:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let storedAuths: { [username: string]: AuthRecord } = {};

/**
 * Retrieves a single user from the database.
 *
 * @param userId - Valid user id.
 * @returns the found user object (without the password).
 */
export function populateSafeUserInfo(userId: string): SafeUserInfo {
  const record = storedUsers[userId];
  return {
    username: record.username,
    display: record.display,
    createdAt: new Date(record.createdAt),
  };
}

/**
 * Retrieves a single user from the database.
 *
 * @param username - The username of the user to find
 * @returns the found user object (without the password) or null
 */
export function getUserByUsername(username: string): UserWithId | null {
  for (const [userId, userRecord] of Object.entries(storedUsers)) {
    if (userRecord.username === username) {
      return { userId, username };
    }
  }
  return null;
}

/**
 * Create and store a new user
 *
 * @param newUser - The user object to be saved, containing user details like username, password, etc.
 * @returns Resolves with the saved user object (without the password) or an error message.
 */
export function createUser(
  username: string,
  password: string,
  createdAt: Date,
): SafeUserInfo | { error: string } {
  if (disallowedUsernames.has(username)) {
    return { error: "That is not a permitted username" };
  }
  const user: UserRecord = {
    username,
    password,
    createdAt: createdAt.toISOString(),
    display: username,
  };
  const id = randomUUID().toString();
  storedUsers[id] = user;
  return {
    username,
    createdAt,
    display: username,
  };
}

/**
 * Retrieves a list of usernames from the database
 *
 * @param usernames - A list of usernames
 * @returns the SafeUserInfo objects corresponding to those users
 * @throws if any of the usernames are not valid
 */
export function getUsersByUsername(usernames: string[]): SafeUserInfo[] {
  return usernames.map((username) => {
    const user = Object.values(storedUsers).find((user) => user.username === username);
    if (!user) {
      throw new Error(`No user ${username}`);
    }
    return { ...user, createdAt: new Date(user.createdAt) };
  });
}

/**
 * Updates user information in the database
 *
 * @param username - A valid username for the user to update
 * @param updates - An object that defines the fields to be updated and their new values
 * @returns the updated user object (without the password)
 * @throws if the username does not exist in the database
 */
export function updateUser(
  username: string,
  { display, password }: UserUpdateRequest,
): SafeUserInfo {
  for (const user of Object.values(storedUsers)) {
    if (user.username === username) {
      if (password !== undefined) user.password = password;
      if (display !== undefined) user.display = display;
      return { ...user, createdAt: new Date(user.createdAt) };
    }
  }
  throw new Error(`No user ${username}`);
}

/**
 * Takes a username and password, and either returns the corresponding user object
 * (without the password) or null if the username/password combination does not
 * match stored values.
 *
 * @param auth - A user's authentication information (username and password)
 * @returns the corresponding user object (without the password) or null.
 */
export function checkAuth({ username, password }: UserAuth): UserWithId | null {
  const userEntry = Object.entries(storedUsers).find(
    ([userId, user]) => user.username === username && user.password === password,
  );
  if (!userEntry) return null;
  return { userId: userEntry[0], username: userEntry[1].username };
}

/**
 * Takes a username and password, and returns the corresponding user
 * (without the password) or an error if the username/password combination
 * doesn't match stored values.
 *
 * @param auth - A user's authentication information (username and password)
 * @returns the corresponding user object (without the password)
 * @throws if the auth information is incorrect
 */
export function enforceAuth(auth: UserAuth): UserWithId {
  const user = checkAuth(auth);
  if (!user) throw new Error("Invalid auth");
  return user;
}

/** Clear the stored authentication */
export function resetStoredAuth() {
  storedAuths = {};
}

/** Reset stored users with example data */
export function resetStoredUsers() {
  storedUsers = {};
  resetStoredAuth();
  createUser("user0", "pwd0000", new Date());
  createUser("user1", "pwd1111", new Date());
  createUser("user2", "pwd2222", new Date());
  createUser("user3", "pwd3333", new Date());

  updateUser("user0", { display: "The Knight Of Games" });
  updateUser("user1", { display: "Yāo" });
  updateUser("user2", { display: "Sénior Dos" });
  updateUser("user3", { display: "Frau Drei" });
}
