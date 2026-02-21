import { useMemo, useState } from "react";
import "./App.css";

import { SearchBar } from "./components/SearchBar";
import { UserCard } from "./components/UserCard";
import { RepoList } from "./components/RepoList";
import { RepoSkeletonList } from "./components/RepoSkeletonList";
import { useGitHubUser } from "./hooks/useGitHubUser";
import { useGitHubRepos } from "./hooks/useGitHubRepos";

type Sort = "updated" | "stars";

export default function App() {
  const [username, setUsername] = useState("");
  const [sort, setSort] = useState<Sort>("updated");
  const [repoQuery, setRepoQuery] = useState("");

  const userState = useGitHubUser(username);
  const { state: repoState, loadMore, hasMore } = useGitHubRepos(username, sort);

  const isReady = useMemo(
    () => userState.status === "success" && repoState.status === "success",
    [userState, repoState]
  );

  // filter repos client-side
  const filteredRepos = useMemo(() => {
    if (repoState.status !== "success") return [];

    const q = repoQuery.trim().toLowerCase();
    if (!q) return repoState.data;

    return repoState.data.filter((r) => {
      const text = (r.name + " " + (r.description ?? "") + " " + (r.language ?? "")).toLowerCase();
      return text.includes(q);
    });
  }, [repoState, repoQuery]);

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div>
          <h1 className="title">GitHub Explorer</h1>
          <p className="subtitle">Search a user, browse repos, filter, and load more.</p>
        </div>
      </header>

      {/* SEARCH */}
      <div className="panel">
        <SearchBar value={username} onChange={setUsername} />
      </div>

      {/* EMPTY STATE */}
      {userState.status === "idle" && (
        <div className="empty">
          <div className="emptyTitle">Type a username</div>
          <div className="emptyText">Example: torvalds, gaearon, sindresorhus</div>
        </div>
      )}

      {/* USER LOADING */}
      {userState.status === "loading" && <p className="note">Loading user…</p>}

      {/* USER ERROR */}
      {userState.status === "error" && <p className="error">User error: {userState.message}</p>}

      {/* USER CARD */}
      {userState.status === "success" && <UserCard user={userState.data} />}

      {/* CONTROLS */}
      {userState.status === "success" && (
        <div className="panel controls">
          <div className="control">
            <label className="label">Sort repos</label>
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="updated">Recently updated</option>
              <option value="stars">Most stars</option>
            </select>
          </div>

          <div className="control grow">
            <label className="label">Filter repos</label>
            <input
              className="input"
              value={repoQuery}
              onChange={(e) => setRepoQuery(e.target.value)}
              placeholder="Filter by name, description, or language…"
            />
          </div>

          {repoState.status === "success" && <div className="count">{repoState.data.length} repos</div>}
        </div>
      )}

      {/* ✅ SKELETON LOADING */}
      {username.trim() && repoState.status === "loading" && (
        <div style={{ marginTop: 12 }}>
          <RepoSkeletonList count={4} />
        </div>
      )}

      {/* REPO ERROR */}
      {userState.status === "success" && repoState.status === "error" && (
        <p className="error">Repo error: {repoState.message}</p>
      )}

      {/* REPO LIST */}
      {isReady && (
        <>
          <RepoList repos={filteredRepos} />

          <div className="footer">
            {hasMore ? (
              <button className="btn" onClick={loadMore}>
                Load more
              </button>
            ) : (
              <div className="note">No more repos.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}