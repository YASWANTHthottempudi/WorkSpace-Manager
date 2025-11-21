import { Input as ShadcnInput } from './input.jsx';
import { cn } from '@/lib/utils';

export default function Input({ 
    label, 
    error, 
    className = '',
    value,
    ...props 
  }) {
    // Ensure value is always a string (never undefined or null) to prevent controlled/uncontrolled switch
    const safeValue = value ?? '';
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <ShadcnInput
          className={cn(className)}
          aria-invalid={error ? 'true' : undefined}
          value={safeValue}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }