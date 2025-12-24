export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://grand-humpback-42.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
