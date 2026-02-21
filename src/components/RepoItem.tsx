import type { GitHubRepo } from "../types/github";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/*
  Simple GitHub-like language colors
*/
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Shell: "#89e051",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Rust: "#dea584",
};

function getLangColor(lang: string | null) {
  if (!lang) return "#94a3b8";
  return LANGUAGE_COLORS[lang] ?? "#94a3b8";
}

export function RepoItem({ repo }: { repo: GitHubRepo }) {
  const lang = repo.language ?? "Other";
  const langColor = getLangColor(repo.language);

  return (
    <div className="card repoCard">
      {/* top row */}
      <div className="repoTop">
        <a
          className="repoName"
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          title={repo.full_name}
        >
          {repo.name}
        </a>

        {/* show stars only if > 0 */}
        {repo.stargazers_count > 0 && (
          <div className="star">⭐ {repo.stargazers_count}</div>
        )}
      </div>

      {/* description (hide if empty) */}
      {repo.description?.trim() && (
        <div className="repoDesc">{repo.description}</div>
      )}

      {/* metadata */}
      <div className="repoMeta">
        <span className="repoLang">
          <span
            className="langDot"
            style={{ background: langColor }}
            aria-hidden
          />
          {lang}
        </span>

        <span>Updated {fmtDate(repo.updated_at)}</span>

        <span className="repoFull">{repo.full_name}</span>
      </div>
    </div>
  );
}