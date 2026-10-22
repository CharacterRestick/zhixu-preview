export function Brand({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <div className={`zx-brand ${light ? 'is-light' : ''} ${compact ? 'is-compact' : ''}`}>
      <span className="zx-brand-symbol" aria-hidden="true">
        <span className="zx-brand-orbit orbit-a" />
        <span className="zx-brand-orbit orbit-b" />
        <span className="zx-brand-core" />
      </span>
      {!compact && (
        <span className="zx-brand-word">
          <strong>知序</strong>
          <small>ZHIXU · LEARNING</small>
        </span>
      )}
    </div>
  )
}
