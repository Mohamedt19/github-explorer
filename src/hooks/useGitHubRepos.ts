import { useEffect, useMemo, useState } from "react";
import type { GitHubRepo, LoadState } from "../types/github";
import { listRepos } from "../api/github";

export type Sort = "updated" | "stars";

export function useGitHubRepos(username: string, sort: Sort) {
  const [state, setState] = useState<LoadState<GitHubRepo[]>>({ status: "idle" });
  const [page, setPage] = useState(1);

  const perPage = 10;

  // load more only makes sense when we're paging by "updated"
  const canPaginate = sort === "updated";
  const [hasMore, setHasMore] = useState(false);

  // Reset when username OR sort changes
  useEffect(() => {
    const u = username.trim();

    setPage(1);
    setHasMore(false);

    if (!u) {
      setState({ status: "idle" });
      return;
    }

    setState({ status: "loading" });
  }, [username, sort]);

  // Load page 1 whenever username OR sort changes
  useEffect(() => {
    const u = username.trim();
    if (!u) return;

    const controller = new AbortController();

    listRepos({ username: u, page: 1, perPage, sort, signal: controller.signal })
      .then((repos) => {
        // if stars: we'll show top 10 (no load more)
        if (sort === "stars") {
          const top = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
          setHasMore(false);
          setState({ status: "success", data: top });
          return;
        }

        // updated: normal paging
        setHasMore(repos.length === perPage);
        setState({ status: "success", data: repos });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Failed to load repos";
        setState({ status: "error", message });
      });

    return () => controller.abort();
  }, [username, sort]);

  async function loadMore() {
    const u = username.trim();
    if (!u) return;
    if (!canPaginate) return;        // ✅ disable load more in stars mode
    if (state.status !== "success") return;
    if (!hasMore) return;

    const nextPage = page + 1;

    try {
      const more = await listRepos({ username: u, page: nextPage, perPage, sort });

      setPage(nextPage);
      setHasMore(more.length === perPage);

      setState((prev) =>
        prev.status === "success"
          ? { status: "success", data: [...prev.data, ...more] }
          : prev
      );
    } catch {
      setHasMore(false);
    }
  }

  // no extra sorting here anymore (keeps list stable)
  const stableState = useMemo(() => state, [state]);

  return { state: stableState, loadMore, hasMore };
}