import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export interface FollowButtonProps {
  isFollowing: boolean;
  onClick: () => void;
  className?: string;
}

export function FollowButton({ isFollowing, onClick, className }: FollowButtonProps) {
  return (
    <Button variant="outline" size="lg" className={'cursor-pointer' + className} onClick={onClick}>
      <Users size={8} /> {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
