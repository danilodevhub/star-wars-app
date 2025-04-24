'use client';

import SeeDetailsButton from './SeeDetailsButton';

interface ListItemProps {
  text: string;
}

export default function ListItem({ text }: ListItemProps) {
  return (
    <div className="flex items-center justify-between py-[10px]">
      <span className="text-[16px] font-[700] text-black">{text}</span>
      <SeeDetailsButton onClick={() => {}} />
    </div>
  );
} 