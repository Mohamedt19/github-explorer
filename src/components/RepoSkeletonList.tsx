import { RepoSkeleton } from "./RepoSkeleton";

export function RepoSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="list" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <RepoSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}