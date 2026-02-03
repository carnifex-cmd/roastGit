export type PageFetcher<T> = (page: number, perPage: number) => Promise<T[]>;

export async function paginate<T>(
  fetchPage: PageFetcher<T>,
  limit: number,
  options?: { perPage?: number; maxPages?: number }
): Promise<T[]> {
  const perPage = options?.perPage ?? 30;
  const maxPages = options?.maxPages ?? 10;
  const results: T[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const pageItems = await fetchPage(page, perPage);
    if (pageItems.length === 0) break;
    results.push(...pageItems);
    if (results.length >= limit) {
      return results.slice(0, limit);
    }
    if (pageItems.length < perPage) break;
  }

  return results;
}
