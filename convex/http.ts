import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// Clerk webhook for user sync
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payload = await request.json();
    const eventType = payload.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } =
        payload.data;

      await ctx.runMutation(internal.users.syncUserFromClerk, {
        clerkUserId: id,
        email: email_addresses[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        imageUrl: image_url,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Polar webhook for subscription updates
http.route({
  path: "/polar-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payload = await request.json();

    // Verify webhook signature (implement based on Polar docs)
    const signature = request.headers.get("polar-signature");
    // TODO: Verify signature with POLAR_WEBHOOK_SECRET

    const eventType = payload.type;

    if (
      eventType === "subscription.created" ||
      eventType === "subscription.updated"
    ) {
      const { customer_id, subscription_id, status, metadata } = payload.data;

      // Use metadata.clerkUserId to find the user
      const clerkUserId = metadata?.clerkUserId;

      if (clerkUserId) {
        await ctx.runMutation(internal.subscriptions.updateSubscription, {
          clerkUserId,
          polarCustomerId: customer_id,
          polarSubscriptionId: subscription_id,
          status: status === "active" ? "active" : "canceled",
          tier: "pro", // Assumes only pro tier exists
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
