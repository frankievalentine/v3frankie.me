interface D1PreparedStatement {
  bind(...values: string[]): D1PreparedStatement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  VIEWS_DB: D1Database;
  ASSETS: { fetch(input: Request): Promise<Response> };
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
}

interface ViewRow {
  key: string;
  count: number;
}

// Keys mirror the public routes, e.g. "posts/building-deku".
const KEY_PATTERN = /^(posts|projects)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_KEY_LENGTH = 200;
const MAX_KEYS_PER_REQUEST = 20;

const isValidKey = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length <= MAX_KEY_LENGTH &&
  KEY_PATTERN.test(value);

const jsonResponse = (
  body: Record<string, unknown>,
  status: number,
) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

// Only count keys that resolve to a page in the built site, so arbitrary keys
// cannot create rows.
const pageExists = async (request: Request, env: Env, key: string) => {
  const pageUrl = new URL(`/${key}/`, request.url);
  const response = await env.ASSETS.fetch(
    new Request(pageUrl, { method: "HEAD" }),
  );
  return response.ok;
};

export const onRequestGet = async ({ request, env }: PagesFunctionContext) => {
  const keys = [
    ...new Set(
      (new URL(request.url).searchParams.get("keys") ?? "")
        .split(",")
        .filter((key) => key.length > 0),
    ),
  ];
  if (
    keys.length === 0 ||
    keys.length > MAX_KEYS_PER_REQUEST ||
    !keys.every(isValidKey)
  ) {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  let rows: ViewRow[];
  try {
    const placeholders = keys.map(() => "?").join(", ");
    ({ results: rows } = await env.VIEWS_DB.prepare(
      `SELECT key, count FROM views WHERE key IN (${placeholders})`,
    )
      .bind(...keys)
      .all<ViewRow>());
  } catch {
    return jsonResponse({ error: "Unable to process request" }, 500);
  }

  const views: Record<string, number> = Object.fromEntries(
    keys.map((key) => [key, 0]),
  );
  for (const row of rows) {
    views[row.key] = row.count;
  }

  return jsonResponse({ views }, 200);
};

export const onRequestPost = async ({ request, env }: PagesFunctionContext) => {
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  const key =
    typeof input === "object" && input !== null && "key" in input
      ? input.key
      : undefined;
  if (!isValidKey(key)) {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  try {
    if (!(await pageExists(request, env, key))) {
      return jsonResponse({ error: "Not found" }, 404);
    }

    const row = await env.VIEWS_DB.prepare(
      "INSERT INTO views (key, count) VALUES (?, 1) ON CONFLICT (key) DO UPDATE SET count = count + 1 RETURNING count",
    )
      .bind(key)
      .first<Pick<ViewRow, "count">>();

    return jsonResponse({ views: row?.count ?? 1 }, 200);
  } catch {
    return jsonResponse({ error: "Unable to process request" }, 500);
  }
};
