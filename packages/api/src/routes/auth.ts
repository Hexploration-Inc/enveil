import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  getGoogleAuthURL,
  oauth2Client,
} from "../services/google-auth.service";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Account } from "../schemas/account";
import { encrypt } from "../lib/crypto";
import { randomUUID } from "crypto";
import { addAccount } from "../services/account.service";

// This route now manages the account list.
// In the future, this should be a proper database service.

const callbackQuerySchema = z.object({
  code: z.string(),
});

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  const authRouter = fastify.withTypeProvider<ZodTypeProvider>();

  // Route to initiate the Google OAuth flow
  authRouter.get("/google", async (request, reply) => {
    const url = getGoogleAuthURL();
    reply.redirect(url);
  });

  // The callback route that Google redirects to after user consent
  authRouter.get(
    "/google/callback",
    {
      schema: {
        querystring: callbackQuerySchema,
      },
    },
    async (request, reply) => {
      const { code } = callbackQuerySchema.parse(request.query);

      try {
        // 1. Exchange the authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // 2. Use tokens to get user's profile info. This is our validation.
        const { data: userInfo } = await oauth2Client.request<{
          name: string;
          email: string;
        }>({ url: "https://www.googleapis.com/oauth2/v2/userinfo" });

        if (!userInfo || !userInfo.email) {
          throw new Error("Failed to fetch user info from Google.");
        }
        console.log(
          "Successfully validated token by fetching user info:",
          userInfo.email
        );

        // 3. Encrypt the tokens for secure storage
        if (!tokens.access_token || !tokens.refresh_token) {
          throw new Error("Missing tokens from Google response.");
        }
        const encryptedAccessToken = await encrypt(tokens.access_token);
        const encryptedRefreshToken = await encrypt(tokens.refresh_token);

        // 4. Create the new account object
        const newAccount: Account = {
          id: randomUUID(),
          email: userInfo.email,
          name: userInfo.name,
          provider: "google",
          oauth: {
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
          },
        };

        // 5. Save the account
        addAccount(newAccount);

        return reply.redirect("http://localhost:3000/");
      } catch (error: any) {
        fastify.log.error("Failed to exchange code for tokens:", error.message);
        return reply.redirect(
          "http://localhost:3000/connect/account?error=true"
        );
      }
    }
  );
}
