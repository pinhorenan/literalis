// src/components/layout/PageHeader.tsx
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn('page-header', className)}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-lg">{description}</p>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default PageHeader;
