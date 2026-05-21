import {
  isAppConfigured,
  META_APP_SECRET,
  WEBHOOK_VERIFY_TOKEN,
} from "@/lib/config";
import {
  handleWebhookGet,
  handleWebhookPost,
  type WebhookRouteConfig,
} from "@/lib/webhook-handler";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const webhookConfig: WebhookRouteConfig = {
  logTag: "webhook",
  verifyToken: WEBHOOK_VERIFY_TOKEN,
  appSecret: META_APP_SECRET,
  isConfigured: isAppConfigured,
};

export function GET(request: NextRequest) {
  return handleWebhookGet(request, webhookConfig);
}

export async function POST(request: NextRequest) {
  return handleWebhookPost(request, webhookConfig);
}
