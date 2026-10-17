import React from 'react';
import { useAdminDashboardViewModel } from './useAdminDashboardViewModel';
import { color, type, radius, spacing, shadow } from '../../../core/theme/tokens';
import { FlagReason } from '../../../domain/entities/Moderation';

const REASON_LABEL: Record<FlagReason, string> = {
  misleading_price: 'Misleading price',
  duplicate: 'Duplicate',
  poor_images: 'Poor images',
  suspected_scam: 'Suspected scam',
  other: 'Other',
};

export function AdminDashboardScreen({ regionId, regionLabel }: { regionId: string; regionLabel: string }) {
  const vm = useAdminDashboardViewModel(regionId);

  return (
    <div style={s.page}>
      <header style={s.topbar}>
        <input style={s.search} placeholder="Search moderation tickets…" />
        <div style={s.adminChip}>
          <div style={s.avatarDot} />
          <div>
            <div style={s.adminName}>System admin</div>
            <div style={s.adminRole}>Level 4 moderator</div>
          </div>
        </div>
      </header>

      <main style={s.main}>
        <div style={s.titleRow}>
          <div>
            <h1 style={s.title}>Daily governance overview</h1>
            <p style={s.subtitle}>Real-time moderation metrics for {regionLabel}.</p>
          </div>
          <button style={s.rangeButton} onClick={() => vm.reload()}>Refresh</button>
        </div>

        {vm.error && <div style={s.errorBanner}>{vm.error}</div>}

        <section style={s.statGrid}>
          <StatCard label="Pending verifications" value={vm.stats?.pendingVerifications} trendPct={vm.stats?.pendingVerificationsTrendPct} />
          <StatCard label="Flagged listings" value={vm.stats?.flaggedListings} trendPct={vm.stats?.flaggedListingsTrendPct} inverse />
          <StatCard label="Total active users" value={vm.stats?.totalActiveUsers} trendPct={vm.stats?.totalActiveUsersTrend} />
          <StatCard label="Revenue (Ksh)" value={vm.stats ? `${(vm.stats.revenueKsh / 1_000_000).toFixed(2)}M` : undefined} trendPct={vm.stats?.revenueTrendPct} />
        </section>

        <section style={s.splitRow}>
          <div style={s.queueCard}>
            <div style={s.cardHeaderRow}>
              <h2 style={s.cardTitle}>Flagged listings queue</h2>
              <span style={s.linkText}>View all tickets</span>
            </div>

            <div style={s.tableHead}>
              <span style={{ flex: 2 }}>Property</span>
              <span style={{ flex: 1 }}>Reason</span>
              <span style={{ flex: 1 }}>Landlord</span>
              <span style={{ flex: 1 }}>Date</span>
              <span style={{ width: 90, textAlign: 'right' as const }}>Actions</span>
            </div>

            {vm.loading && <div style={s.emptyRow}>Loading queue…</div>}
            {!vm.loading && vm.queue.length === 0 && <div style={s.emptyRow}>Queue is clear — nothing flagged right now.</div>}

            {vm.queue.map((t) => (
              <div key={t.id} style={s.tableRow}>
                <div style={{ flex: 2 }}>
                  <div style={s.propertyTitle}>{t.propertyTitle}</div>
                  <div style={s.propertySub}>{t.unitDetail}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={s.reasonPill}>{REASON_LABEL[t.reason]}</span>
                </div>
                <div style={{ flex: 1, ...s.rowText }}>{t.landlordName}</div>
                <div style={{ flex: 1, ...s.rowText }}>{new Date(t.flaggedAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}</div>
                <div style={{ width: 90, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button style={s.iconButtonApprove} onClick={() => vm.approveTicket(t.id)} aria-label="Approve">✓</button>
                  <button style={s.iconButtonReject} onClick={() => vm.rejectTicket(t.id)} aria-label="Reject">✕</button>
                </div>
              </div>
            ))}
          </div>

          <div style={s.velocityCard}>
            <h2 style={s.cardTitle}>Market velocity</h2>
            <MarketVelocityChart points={vm.velocity} />
            <div style={s.legendRow}>
              <Legend swatch={color.msitu700} label="New listings" />
              <Legend swatch={color.sisal600} label="Bookings" />
            </div>
          </div>
        </section>

        <section style={s.kycCard}>
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardTitle}>Recent KYC submissions</h2>
            <span style={s.newBadge}>{vm.kyc.length} new today</span>
          </div>
          <div style={s.kycRow}>
            {vm.kyc.map((k) => (
              <div key={k.id} style={s.kycPerson}>
                <div style={s.kycAvatar}>{k.applicantName.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.kycName}>{k.applicantName}</div>
                  <div style={s.kycContext}>{k.submittedContext}</div>
                </div>
                <button style={s.verifyButton} onClick={() => vm.approveKycSubmission(k.id)}>Verify now</button>
              </div>
            ))}
            {!vm.loading && vm.kyc.length === 0 && <div style={s.emptyRow}>No new submissions.</div>}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, trendPct, inverse }: { label: string; value?: number | string; trendPct?: number; inverse?: boolean }) {
  const positive = (trendPct ?? 0) >= 0;
  const good = inverse ? !positive : positive;
  return (
    <div style={s.statCard}>
      <div style={s.statHeaderRow}>
        {trendPct !== undefined && (
          <span style={{ ...s.trendPill, color: good ? color.msitu700 : color.alert, background: good ? color.msitu100 : '#FBE9E7' }}>
            {positive ? '+' : ''}{trendPct}%
          </span>
        )}
      </div>
      <div style={s.statLabel}>{label}</div>
      <div style={s.statValue}>{value ?? '—'}</div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: swatch, display: 'inline-block' }} />
      <span style={{ fontFamily: type.body, fontSize: 12, color: color.inkMuted }}>{label}</span>
    </div>
  );
}

function MarketVelocityChart({ points }: { points: { label: string; newListings: number; bookings: number }[] }) {
  const max = Math.max(1, ...points.flatMap((p) => [p.newListings, p.bookings]));
  const barWidth = 14;
  const gap = 10;
  const groupWidth = barWidth * 2 + 4;
  const width = points.length * (groupWidth + gap);
  const height = 140;

  return (
    <svg viewBox={`0 0 ${Math.max(width, 200)} ${height}`} width="100%" height={height} role="img" aria-label="New listings vs bookings by day">
      {points.map((p, i) => {
        const x = i * (groupWidth + gap);
        const newH = (p.newListings / max) * (height - 24);
        const bookH = (p.bookings / max) * (height - 24);
        return (
          <g key={p.label}>
            <rect x={x} y={height - 20 - newH} width={barWidth} height={newH} rx={3} fill={color.msitu700} />
            <rect x={x + barWidth + 4} y={height - 20 - bookH} width={barWidth} height={bookH} rx={3} fill={color.sisal600} />
            <text x={x + groupWidth / 2} y={height - 4} textAnchor="middle" fontSize={10} fontFamily={type.body} fill={color.inkMuted}>
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { background: color.parchment, minHeight: '100vh', fontFamily: type.body, color: color.ink },
  topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing(3)} ${spacing(6)}`, borderBottom: `1px solid ${color.border}`, background: '#fff' },
  search: { flex: 1, maxWidth: 420, border: `1px solid ${color.border}`, borderRadius: radius.md, padding: '10px 14px', fontFamily: type.body, fontSize: 13, background: color.parchment },
  adminChip: { display: 'flex', alignItems: 'center', gap: 10 },
  avatarDot: { width: 36, height: 36, borderRadius: radius.pill, background: color.msitu700 },
  adminName: { fontFamily: type.body, fontWeight: 600, fontSize: 13 },
  adminRole: { fontFamily: type.body, fontSize: 11, color: color.inkMuted },
  main: { padding: spacing(6), maxWidth: 1200, margin: '0 auto' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing(5) },
  title: { fontFamily: type.display, fontSize: 26, margin: 0, color: color.ink },
  subtitle: { fontFamily: type.body, fontSize: 13, color: color.inkMuted, margin: '4px 0 0' },
  rangeButton: { border: `1px solid ${color.border}`, background: '#fff', borderRadius: radius.md, padding: '8px 16px', fontFamily: type.body, fontSize: 13, cursor: 'pointer' },
  errorBanner: { background: '#FBE9E7', color: color.alert, borderRadius: radius.md, padding: spacing(3), fontSize: 13, marginBottom: spacing(4) },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing(4), marginBottom: spacing(5) },
  statCard: { background: '#fff', border: `1px solid ${color.border}`, borderRadius: radius.md, padding: spacing(4), boxShadow: shadow.card },
  statHeaderRow: { display: 'flex', justifyContent: 'flex-end', marginBottom: spacing(2) },
  trendPill: { fontFamily: type.data, fontSize: 11, borderRadius: radius.pill, padding: '2px 8px' },
  statLabel: { fontFamily: type.body, fontSize: 12, color: color.inkMuted },
  statValue: { fontFamily: type.display, fontSize: 28, marginTop: 4 },
  splitRow: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: spacing(4), marginBottom: spacing(5), alignItems: 'start' },
  queueCard: { background: '#fff', border: `1px solid ${color.border}`, borderRadius: radius.md, padding: spacing(4), boxShadow: shadow.card },
  velocityCard: { background: '#fff', border: `1px solid ${color.border}`, borderRadius: radius.md, padding: spacing(4), boxShadow: shadow.card },
  cardHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing(3) },
  cardTitle: { fontFamily: type.display, fontSize: 17, margin: 0 },
  linkText: { fontFamily: type.body, fontSize: 12, color: color.msitu700, cursor: 'pointer' },
  tableHead: { display: 'flex', fontFamily: type.body, fontSize: 11, color: color.inkMuted, borderBottom: `1px solid ${color.border}`, paddingBottom: 8, marginBottom: 4 },
  tableRow: { display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${color.border}` },
  rowText: { fontFamily: type.body, fontSize: 13, color: color.ink },
  propertyTitle: { fontFamily: type.body, fontWeight: 600, fontSize: 13 },
  propertySub: { fontFamily: type.body, fontSize: 11, color: color.inkMuted },
  reasonPill: { background: '#FBE4D8', color: color.sisal600, fontFamily: type.body, fontSize: 11, borderRadius: radius.pill, padding: '3px 10px' },
  iconButtonApprove: { border: `1px solid ${color.msitu700}`, color: color.msitu700, background: 'transparent', borderRadius: radius.sm, width: 28, height: 28, cursor: 'pointer' },
  iconButtonReject: { border: `1px solid ${color.alert}`, color: color.alert, background: 'transparent', borderRadius: radius.sm, width: 28, height: 28, cursor: 'pointer' },
  legendRow: { display: 'flex', gap: 16, marginTop: spacing(3) },
  emptyRow: { padding: spacing(4), textAlign: 'center', color: color.inkMuted, fontSize: 13 },
  kycCard: { background: '#fff', border: `1px solid ${color.border}`, borderRadius: radius.md, padding: spacing(4), boxShadow: shadow.card },
  newBadge: { background: color.msitu100, color: color.msitu700, fontFamily: type.body, fontSize: 11, borderRadius: radius.pill, padding: '3px 10px' },
  kycRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing(4) },
  kycPerson: { display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${color.border}`, borderRadius: radius.md, padding: spacing(3) },
  kycAvatar: { width: 40, height: 40, borderRadius: radius.pill, background: color.udongo100, color: color.udongo700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 15 },
  kycName: { fontFamily: type.body, fontWeight: 600, fontSize: 13 },
  kycContext: { fontFamily: type.body, fontSize: 11, color: color.inkMuted },
  verifyButton: { background: color.msitu700, color: '#fff', border: 'none', borderRadius: radius.sm, padding: '8px 12px', fontFamily: type.body, fontSize: 12, cursor: 'pointer' },
};
