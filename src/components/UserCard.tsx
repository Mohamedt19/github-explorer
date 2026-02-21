import type { GitHubUser } from "../types/github";

export function UserCard({ user }: { user: GitHubUser }) {
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="cardRow">
        {/* ✅ Clickable avatar */}
        <a
          href={user.html_url}
          target="_blank"
          rel="noreferrer"
          aria-label="Open GitHub profile"
        >
          <img
            className="avatar"
            src={user.avatar_url}
            alt={user.login}
          />
        </a>

        <div style={{ flex: 1 }}>
          <div className="userName">
            {user.name ?? user.login}
            <span className="userLogin">@{user.login}</span>
          </div>

          {user.bio && <div className="userBio">{user.bio}</div>}

          <div className="userStats">
            <span>Repos: {user.public_repos}</span>
            <span>Followers: {user.followers}</span>
            <span>Following: {user.following}</span>
          </div>
        </div>

        {/* profile button */}
        <a
          className="linkBtn"
          href={user.html_url}
          target="_blank"
          rel="noreferrer"
        >
          View Profile
        </a>
      </div>
    </div>
  );
}