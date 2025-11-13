import { Card as ShadcnCard } from './card.jsx';
import { cn } from '@/lib/utils';

export default function Card({ children, className = '', ...props }) {
    return (
      <ShadcnCard 
        className={cn('p-6', className)}
        {...props}
      >
        {children}
      </ShadcnCard>
    );
  }