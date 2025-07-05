import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { getAccounts } from "../services/account.service";

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  const accountsRouter = fastify.withTypeProvider<ZodTypeProvider>();

  accountsRouter.get("/accounts", async (request, reply) => {
    const accounts = getAccounts();
    // We must not expose sensitive tokens to the frontend.
    const safeAccounts = accounts.map(({ oauth, ...rest }) => rest);
    return reply.send(safeAccounts);
  });
}
