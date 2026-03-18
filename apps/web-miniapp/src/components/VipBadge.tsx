'use client';

import { useVipStatus } from '@/hooks/useVipStatus';
import { COURSE_ID } from '@/data/course-map';

export function VipBadge() {
  const isVip = useVipStatus(COURSE_ID);
  if (!isVip) return null;
  return (
    <span
      className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
      style={{
        background: 'rgba(245,158,11,0.18)',
        border: '1px solid rgba(245,158,11,0.45)',
        color: '#f59e0b',
      }}
    >
      👑 VIP
    </span>
  );
}
