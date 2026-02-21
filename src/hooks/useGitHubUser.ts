import { useEffect, useRef, useState } from "react";
import type { GitHubUser, LoadState } from "../types/github";
import { getUser } from "../api/github";

export function useGitHubUser(username: string) {
  const [state, setState] = useState<LoadState<GitHubUser>>({
    status: "idle",
  });

  // used to ignore stale responses (extra safety)
  const requestIdRef = useRef(0);

  useEffect(() => {
    const u = username.trim();

    if (!u) {
      setState({ status: "idle" });
      return;
    }

    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    // ✅ keep previous user while loading (less UI jump)
    setState((prev) =>
      prev.status === "success"
        ? { status: "loading", data: prev.data }
        : { status: "loading" }
    );

    getUser(u, controller.signal)
      .then((data) => {
        // ignore stale responses
        if (requestId !== requestIdRef.current) return;
        setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        if (requestId !== requestIdRef.current) return;

        let message = "Failed to load user";

        if (err instanceof Error) {
          message = err.message;
        }

        setState({ status: "error", message });
      });

    return () => controller.abort();
  }, [username]);

  return state;
}