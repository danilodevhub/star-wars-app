'use client';

import { usePathname, useRouter } from 'next/navigation';
import SeeDetailsButton from '@/app/components/SeeDetailsButton';

interface ListItemProps {
  text: string;
  id: number | string;
}

export default function ListItem({ text, id }: ListItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSeeDetails = () => {    
      router.push(`${pathname}/${id}`);    
  };

  return (
    <div className="flex items-center justify-between py-[10px]">
      <span className="text-[16px] font-[700] text-black">{text}</span>
      <SeeDetailsButton onClick={handleSeeDetails} />
    </div>
  );
} 