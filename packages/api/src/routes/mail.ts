import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { getAccountById } from "../services/account.service";
import { listMessages } from "../services/gmail.service";

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
        // Delegate all the complex work to the gmail.service
        const messages = await listMessages(account);
        return reply.send(messages);
      } catch (error: any) {
        // The service layer logs the detailed error; the route just sends a
        // generic but appropriate response to the client.
        const statusCode = error.code || 500;
        return reply
          .status(statusCode)
          .send({ error: "Failed to fetch emails", message: error.message });
      }
    }
  );
}
