import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/** `null` for single-document queries, `[]` for list queries. */
function emptyResult<T>(query: string): T {
  const expectsSingle = /\[0\]/.test(query);
  return (expectsSingle ? null : []) as T;
}

/**
 * Safe fetch wrapper that returns empty results when Sanity is not configured
 * or unreachable. This allows the build to succeed with placeholder credentials.
 * Use this instead of `client.fetch` everywhere, including in client components.
 */
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, string | number | boolean | string[]>
): Promise<T> {
  if (projectId === "placeholder") {
    return emptyResult<T>(query);
  }
  try {
    if (params) {
      return await client.fetch<T>(query, params);
    }
    return await client.fetch<T>(query);
  } catch {
    return emptyResult<T>(query);
  }
}
