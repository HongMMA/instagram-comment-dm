import {
  isWebhookApp1Configured,
  META_APP_SECRET_APP1,
  WEBHOOK_VERIFY_TOKEN_APP1,
} from "@/lib/config";
import {
  handleWebhookGet,
  handleWebhookPost,
  type WebhookRouteConfig,
} from "@/lib/webhook-handler";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

/** Meta 첫 번째 앱 전용 — Callback: https://<도메인>/api/webhook2 */
const config: WebhookRouteConfig = {
  logTag: "webhook2",
  verifyToken: WEBHOOK_VERIFY_TOKEN_APP1,
  appSecret: META_APP_SECRET_APP1,
  isWebhookConfigured: isWebhookApp1Configured,
};

export function GET(request: NextRequest) {
  return handleWebhookGet(request, config);
}

export async function POST(request: NextRequest) {
  return handleWebhookPost(request, config);
}
