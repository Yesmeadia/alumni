'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  index: number;
  badge?: string;
  color?: 'indigo' | 'green' | 'amber' | 'blue';
  onClick?: () => void;
}

const colorMap = {
  indigo: 'bg-[#F3F0FA] text-[#2a1b63] border border-[#DDD6F3]/70',
  green: 'bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]/70',
  amber: 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]/70',
  blue: 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]/70',
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  badge,
  color = 'indigo',
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={`border border-[#E5E7EB] bg-white rounded-2xl shadow-[0_2px_10px_-2px_rgba(29,30,32,0.03)] hover:shadow-md hover:border-[#CBD5E1] transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3.5">
        {/* Top Row: Icon Squircle + Optional Pill Badge */}
        <div className="flex items-center justify-between">
          <div
            className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 text-[20px] ${colorMap[color]}`}
          >
            {icon}
          </div>

          {badge && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]/60">
              <Icon name="keyboard_arrow_up" className="text-[12px]" />
              {badge}
            </span>
          )}
        </div>

        {/* Bottom Section: Uppercase Label & Clean Large Numeral */}
        <div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-[#8A8F98] truncate block">
            {title}
          </span>
          <span className="text-2xl sm:text-3xl font-normal text-[#1D1E20] tracking-tight leading-tight block mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          <span className="text-[11px] font-normal text-[#5F6368] block mt-1 truncate">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
