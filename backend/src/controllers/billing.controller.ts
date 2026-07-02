import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../config/db.js";

// Initialize mock/real Stripe integration
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const { plan, workspaceId } = req.body;

    if (!plan || !workspaceId) {
      return res.status(400).json({ error: "Plan and workspaceId are required" });
    }

    console.log(`Billing: Creating checkout session for plan ${plan} in workspace ${workspaceId}`);

    // If Stripe secret key is default or missing, return a simulated redirect URL
    if (!STRIPE_SECRET || STRIPE_SECRET === "dummy_stripe_secret") {
      console.log("Billing: Dev mode bypass, returning mock checkout URL");
      const mockCheckoutUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/settings?session_id=mock_stripe_session_12345&plan=${plan}`;
      
      // Simulate database update for developer testing
      await prisma.subscription.upsert({
        where: { workspaceId },
        update: { plan: plan.toUpperCase(), status: "ACTIVE" },
        create: {
          workspaceId,
          plan: plan.toUpperCase(),
          status: "ACTIVE",
        },
      });

      return res.json({ url: mockCheckoutUrl });
    }

    // Standard Stripe Session Creation goes here in production
    const stripe = new Stripe(STRIPE_SECRET, {
      apiVersion: "2023-10-16" as any
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.toUpperCase()} Plan Subscription`,
            },
            unit_amount: plan.toLowerCase() === "enterprise" ? 4900 : 1900,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.FRONTEND_URL}/dashboard/settings?status=success`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/settings?status=cancel`,
      metadata: {
        workspaceId,
        plan: plan.toUpperCase(),
      },
    });

    return res.json({ url: session.url });
  } catch (error: any) {
    console.error("Create Checkout Session Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Handle Stripe Webhook Events
 */
export async function stripeWebhook(req: Request, res: Response) {
  try {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    console.log("Billing Webhook received");

    if (webhookSecret && sig) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
        apiVersion: "2023-10-16" as any,
      });

      try {
        const event = stripe.webhooks.constructEvent(
          req.body,
          sig as string,
          webhookSecret
        );
        console.log(`Stripe Webhook Verified: Event Type = ${event.type}`);

        if (event.type === "checkout.session.completed") {
          const session = event.data.object as any;
          const workspaceId = session.metadata?.workspaceId;
          const plan = session.metadata?.plan || "PRO";

          if (workspaceId) {
            await prisma.subscription.upsert({
              where: { workspaceId },
              update: { plan, status: "ACTIVE" },
              create: {
                workspaceId,
                plan,
                status: "ACTIVE",
              },
            });
            console.log(`Webhook: Subscription upgraded for workspace ${workspaceId}`);
          }
        }
      } catch (err: any) {
        console.warn("Stripe Signature Verification failed:", err.message);
      }
    }

    return res.json({ received: true });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
}
