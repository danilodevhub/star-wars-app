'use client';

import { usePathname, useRouter } from 'next/navigation';
import SeeDetailsButton from './SeeDetailsButton';

interface ListItemProps {
  text: string;
}

export default function ListItem({ text }: ListItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSeeDetails = () => {
    // For demo purposes, using the name as the ID
    const id = text.toLowerCase().replace(/\s+/g, '-');
    router.push(`${pathname}/${id}`);
  };

  return (
    <div className="flex items-center justify-between py-[10px]">
      <span className="text-[16px] font-[700] text-black">{text}</span>
      <SeeDetailsButton onClick={handleSeeDetails} />
    </div>
  );
} 