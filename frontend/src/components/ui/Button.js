import { Button as ShadcnButton } from './button.jsx';

// Map our API to shadcn/ui API for backward compatibility
const variantMap = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  danger: 'destructive',
};

const sizeMap = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
};

export default function Button({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'md',
    className = '',
    ...props 
  }) {
    return (
      <ShadcnButton
        onClick={onClick}
        variant={variantMap[variant] || variant}
        size={sizeMap[size] || size}
        className={className}
        {...props}
      >
        {children}
      </ShadcnButton>
    );
  }