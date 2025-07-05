import { z } from "zod";

export const AccountSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  provider: z.literal("google"),
  oauth: z.object({
    accessToken: z.object({
      iv: z.string(),
      content: z.string(),
    }),
    refreshToken: z.object({
      iv: z.string(),
      content: z.string(),
    }),
  }),
});

export type Account = z.infer<typeof AccountSchema>;
