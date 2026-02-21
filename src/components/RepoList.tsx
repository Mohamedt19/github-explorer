import type { GitHubRepo } from "../types/github";
import { RepoItem } from "./RepoItem";

export function RepoList({ repos }: { repos: GitHubRepo[] }) {
  if (repos.length === 0) {
    return (
      <div className="empty">
        <div className="emptyTitle">No repositories found</div>
        <div className="emptyText">Try changing your filter.</div>
      </div>
    );
  }

  return (
    <div className="list">
      {repos.map((repo) => (
        <RepoItem key={repo.id} repo={repo} />
      ))}
    </div>
  );
}