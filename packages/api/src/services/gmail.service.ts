import { google } from "googleapis";
import { Account } from "../schemas/account";
import { decrypt } from "../lib/crypto";
import { GaxiosError } from "gaxios";

/**
 * Creates a fully authenticated Gmail API client for a specific user account.
 * This function is the cornerstone of our interaction with Google's services.
 * It encapsulates the logic for creating an OAuth2 client, setting the user's
 * specific tokens, and preparing the Gmail client for use. This ensures that
 * every API request is properly authenticated for the correct user and is stateless.
 *
 * @param account - The user's account object, containing encrypted tokens.
 * @returns An authenticated Gmail API client instance.
 */
async function createGmailClient(account: Account) {
  // Each request must have its own OAuth2 client instance to be stateless.
  // This prevents one user's authentication from leaking to another's.
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    // The redirect URI must match the one in your Google Cloud Console.
    "http://localhost:3001/auth/google/callback"
  );

  // Decrypt the stored tokens before use.
  const accessToken = await decrypt(account.oauth.accessToken);
  const refreshToken = await decrypt(account.oauth.refreshToken);

  // Set the credentials for the OAuth2 client. This tells the client which
  // user it is acting on behalf of.
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  // Return the configured Gmail client, ready to make API calls.
  return google.gmail({ version: "v1", auth: oauth2Client });
}

/**
 * Fetches a list of email message references (ID and Thread ID) from Gmail.
 * This function uses the created Gmail client to perform the action.
 *
 * @param account - The user account to fetch messages for.
 * @returns A promise that resolves to an array of message references.
 * @throws {GaxiosError} If the API call fails (e.g., permissions error).
 */
export async function listMessages(account: Account) {
  try {
    const gmail = await createGmailClient(account);
    const response = await gmail.users.messages.list({
      userId: "me", // 'me' is a special value indicating the authenticated user.
      maxResults: 20, // Fetch the 20 most recent messages.
    });

    return response.data.messages || [];
  } catch (err) {
    // The error is re-thrown so it can be caught and handled by the route
    // handler, which will then send an appropriate HTTP response.
    const error = err as GaxiosError;
    console.error("Gmail API Error in listMessages:", error.message);
    throw error;
  }
}
