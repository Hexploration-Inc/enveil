import { google } from "googleapis";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3001/auth/google/callback";

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Google client ID or secret not configured in .env file");
}

// Create a new OAuth2 client with the credentials
export const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

// Define the scopes we need access to
const scopes = [
  "https://mail.google.com/", // Use the broader mail scope for IMAP
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export function getGoogleAuthURL() {
  // Generate the url that will be used for the consent dialog.
  return oauth2Client.generateAuthUrl({
    access_type: "offline", // 'offline' gets us a refresh token
    scope: scopes,
    prompt: "consent", // Force refresh token to be sent every time
  });
}
