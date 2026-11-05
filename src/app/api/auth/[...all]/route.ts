import { auth } from "@/lib/auth";
import { db, mongoClient } from "@/lib/mongodb";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

function safeError(error: unknown) {
  const message =
    error instanceof Error ? error.message : String(error);

  return message.replace(
    /mongodb(?:\+srv)?:\/\/[^\s]+/gi,
    "[connection string hidden]"
  );
}

async function handleRequest(request: Request) {
  try {
    await mongoClient.connect();
    await db.command({ ping: 1 });
  } catch (error) {
    console.error(
      "[BookNook database connection failed]",
      safeError(error)
    );

    return Response.json(
      {
        message:
          "Database connection failed. Check the client terminal.",
      },
      { status: 503 }
    );
  }

  try {
    const response =
      request.method === "GET"
        ? await handlers.GET(request)
        : await handlers.POST(request);

    if (response.status >= 500) {
      console.error(
        "[BookNook auth failed]",
        request.method,
        new URL(request.url).pathname,
        "Status:",
        response.status
      );
    }

    return response;
  } catch (error) {
    console.error("[BookNook auth error]", safeError(error));

    return Response.json(
      {
        message:
          "Authentication failed. Check the client terminal.",
      },
      { status: 500 }
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;