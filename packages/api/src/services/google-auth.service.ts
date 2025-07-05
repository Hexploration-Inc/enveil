import { google } from "googleapis";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3001/auth/google/callback";

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Google client ID or secret not configured in .env file");
}

const scopes = [
  // This scope grants read-only access to a user's emails and settings.
  // We use the "modify" scope in the final client to manage emails.
  "https://www.googleapis.com/auth/gmail.readonly",
  // These scopes are for fetching the user's basic profile information.
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

/**
 * Generates the URL that our application directs users to for Google's
 * consent screen. This is the first step in the OAuth2 flow.
 */
export function getGoogleAuthURL() {
  // A temporary client is created here just for generating the URL.
  // It doesn't contain any user-specific tokens.
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );

  return oauth2Client.generateAuthUrl({
    // 'offline' access type gets us a refresh token, which is crucial for
    // long-term access without requiring the user to log in every time.
    access_type: "offline",
    scope: scopes,
    // 'consent' prompt ensures the user is shown the consent screen every
    // time, which guarantees we get a refresh token on each new authorization.
    prompt: "consent",
  });
}
