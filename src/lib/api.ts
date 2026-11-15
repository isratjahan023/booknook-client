"use client";

import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
  protectedRequest = true
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (protectedRequest) {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new ApiError("Please log in to continue.", 401);
    }

    headers.set("Authorization", `Bearer ${data.token}`);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  let response: Response;

  try {
    response = await fetch(`${API_URL}${normalizedPath}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    // Preserve intentional cancellation.
    if (options.signal?.aborted) {
      throw error;
    }

    throw new ApiError(
      "Could not connect to the server. Check your connection, API URL, and whether the backend is running.",
      0
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "Request failed. Please try again.";

    throw new ApiError(message, response.status);
  }

  return data as T;
}

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userName: string;
  userEmail: string;
  ownerId: string;
  createdAt: string;
};

export type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
};