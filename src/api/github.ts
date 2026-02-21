import type { GitHubRepo, GitHubUser } from "../types/github";

const BASE = "https://api.github.com";

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { Accept: "application/vnd.github+json" } });

  if (!res.ok) {
    // GitHub sometimes returns JSON errors, sometimes not
    let msg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

export function getUser(username: string, signal?: AbortSignal) {
  const u = encodeURIComponent(username.trim());
  return fetchJson<GitHubUser>(`${BASE}/users/${u}`, signal);
}

export function listRepos(params: {
  username: string;
  page: number;
  perPage: number;
  sort: "updated" | "stars";
  signal?: AbortSignal;
}) {
  const u = encodeURIComponent(params.username.trim());
  const per = params.perPage;
  const page = params.page;

  // GitHub supports sort=updated; for stars we’ll fetch and sort client-side.
  const sort = params.sort === "updated" ? "updated" : "updated";

  return fetchJson<GitHubRepo[]>(
    `${BASE}/users/${u}/repos?per_page=${per}&page=${page}&sort=${sort}`,
    params.signal
  );
}