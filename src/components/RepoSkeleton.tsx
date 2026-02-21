export function RepoSkeleton() {
    return (
      <div
        className="card repoCard skeletonCard"
        role="status"
        aria-label="Loading repository"
      >
        <div className="repoTop">
          <div className="sk skTitle" />
          <div className="sk skStar" />
        </div>
  
        <div className="sk skLine" />
        <div className="sk skLine short" />
  
        <div className="skeletonMeta">
          <div className="sk skPill" />
          <div className="sk skPill" />
          <div className="sk skPill wide" />
        </div>
      </div>
    );
  }