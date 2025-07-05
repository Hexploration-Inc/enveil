import "dotenv/config";
import Fastify from "fastify";
import authRoutes from "./routes/auth";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

// Enable CORS for our web app
fastify.register(cors, {
  origin: "http://localhost:3000",
});

// Add Zod type provider
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

// Register auth routes
fastify.register(authRoutes, { prefix: "/auth" });

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
