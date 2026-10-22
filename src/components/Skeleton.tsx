export function PageSkeleton() {
  return (
    <div className="zx-skeleton-page">
      <div className="zx-skeleton zx-skeleton-title" />
      <div className="zx-skeleton zx-skeleton-sub" />
      <div className="zx-skeleton-grid">
        <div className="zx-skeleton zx-skeleton-card tall" />
        <div className="zx-skeleton zx-skeleton-card" />
        <div className="zx-skeleton zx-skeleton-card" />
        <div className="zx-skeleton zx-skeleton-card wide" />
      </div>
    </div>
  )
}
