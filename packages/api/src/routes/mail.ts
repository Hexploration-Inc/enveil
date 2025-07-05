import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { getAccountById } from "../services/account.service";
import { decrypt } from "../lib/crypto";
import { google } from "googleapis";

const getMessagesParamsSchema = z.object({
  accountId: z.string().uuid(),
});

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  const mailRouter = fastify.withTypeProvider<ZodTypeProvider>();

  mailRouter.get(
    "/accounts/:accountId/messages",
    {
      schema: {
        params: getMessagesParamsSchema,
      },
    },
    async (request, reply) => {
      const { accountId } = getMessagesParamsSchema.parse(request.params);
      const account = getAccountById(accountId);

      if (!account) {
        return reply.status(404).send({ error: "Account not found" });
      }

      try {
        // Each request should have its own OAuth2 client instance to be stateless.
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          "http://localhost:3001/auth/google/callback"
        );

        // Decrypt both the access and refresh tokens.
        const accessToken = await decrypt(account.oauth.accessToken);
        const refreshToken = await decrypt(account.oauth.refreshToken);

        // Set the credentials on the OAuth2 client for this request.
        oauth2Client.setCredentials({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        // Create a Gmail client.
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });

        // Fetch the list of messages.
        const response = await gmail.users.messages.list({
          userId: "me",
          maxResults: 10,
        });

        return reply.send(response.data.messages || []);
      } catch (error: any) {
        fastify.log.error("Failed to fetch emails:", error.message);
        fastify.log.error(error); // Log the full error for better debugging
        return reply.status(500).send({ error: "Failed to fetch emails" });
      }
    }
  );
}
