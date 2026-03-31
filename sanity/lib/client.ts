import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Safe fetch wrapper that returns empty results when Sanity is not configured.
 * This allows the build to succeed with placeholder credentials.
 */
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, string | number | boolean | string[]>
): Promise<T> {
  if (projectId === "placeholder") {
    const expectsSingle = /\[0\]/.test(query);
    return (expectsSingle ? null : []) as T;
  }
  try {
    if (params) {
      return await client.fetch<T>(query, params);
    }
    return await client.fetch<T>(query);
  } catch {
    return ([] as unknown) as T;
  }
}
