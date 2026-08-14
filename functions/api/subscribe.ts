interface Env {
  LISTMONK_CLIENT_ID: string;
  LISTMONK_CLIENT_SECRET: string;
  TURNSTILE_SECRET_KEY: string;
  LISTMONK_LIST_UUID: string;
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
}

interface Subscription {
  email: string;
  name?: string;
  turnstileToken: string;
}

const LISTMONK_SUBSCRIPTION_URL =
  "https://listmonk.v3frankie.net/api/public/subscription";
const TURNSTILE_VERIFICATION_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const jsonResponse = (body: Record<string, string | boolean>, status: number) =>
  Response.json(body, { status });

const parseSubscription = (value: unknown): Subscription | null => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const input = value as Record<string, unknown>;
  if (typeof input.email !== "string" || typeof input.turnstileToken !== "string") {
    return null;
  }

  const email = input.email.trim();
  const turnstileToken = input.turnstileToken.trim();
  if (
    email.length === 0 ||
    email.length > 254 ||
    !EMAIL_PATTERN.test(email) ||
    turnstileToken.length === 0
  ) {
    return null;
  }

  let name: string | undefined;
  if ("name" in input) {
    if (typeof input.name !== "string") {
      return null;
    }

    const sanitizedName = input.name.trim().replace(/[<>]/g, "");
    if (sanitizedName.length > 100) {
      return null;
    }
    if (sanitizedName.length > 0) {
      name = sanitizedName;
    }
  }

  return { email, name, turnstileToken };
};

const hasRequiredBindings = (env: Env) =>
  [
    env.LISTMONK_CLIENT_ID,
    env.LISTMONK_CLIENT_SECRET,
    env.TURNSTILE_SECRET_KEY,
    env.LISTMONK_LIST_UUID,
  ].every((value) => typeof value === "string" && value.length > 0);

export const onRequestPost = async ({ request, env }: PagesFunctionContext) => {
  if (!hasRequiredBindings(env)) {
    return jsonResponse({ error: "Unable to process request" }, 500);
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  const subscription = parseSubscription(input);
  if (!subscription) {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  let verificationResponse: Response;
  try {
    verificationResponse = await fetch(TURNSTILE_VERIFICATION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: subscription.turnstileToken,
      }),
    });
  } catch {
    return jsonResponse({ error: "Unable to process request" }, 502);
  }

  if (!verificationResponse.ok) {
    return jsonResponse({ error: "Unable to process request" }, 502);
  }

  let verification: unknown;
  try {
    verification = await verificationResponse.json();
  } catch {
    return jsonResponse({ error: "Unable to process request" }, 502);
  }

  if (
    typeof verification !== "object" ||
    verification === null ||
    !("success" in verification) ||
    verification.success !== true
  ) {
    return jsonResponse({ error: "Unable to process request" }, 400);
  }

  const listmonkBody: {
    email: string;
    name?: string;
    list_uuids: string[];
  } = {
    email: subscription.email,
    list_uuids: [env.LISTMONK_LIST_UUID],
  };
  if (subscription.name) {
    listmonkBody.name = subscription.name;
  }

  let listmonkResponse: Response;
  try {
    listmonkResponse = await fetch(LISTMONK_SUBSCRIPTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CF-Access-Client-Id": env.LISTMONK_CLIENT_ID,
        "CF-Access-Client-Secret": env.LISTMONK_CLIENT_SECRET,
      },
      body: JSON.stringify(listmonkBody),
    });
  } catch {
    return jsonResponse({ error: "Unable to process request" }, 502);
  }

  if (!listmonkResponse.ok) {
    return jsonResponse({ error: "Unable to process request" }, 502);
  }

  return jsonResponse({ success: true }, 200);
};
