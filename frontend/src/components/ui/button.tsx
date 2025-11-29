import * as React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
    variant?: 'contained' | 'outlined' | 'text' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
    size?: 'small' | 'medium' | 'large' | 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'contained', size = 'medium', className, children, ...props }, ref) => {
        // Map custom variants to MUI variants
        let muiVariant: 'contained' | 'outlined' | 'text' = 'contained';
        if (variant === 'outlined' || variant === 'text' || variant === 'ghost' || variant === 'link') {
            muiVariant = variant === 'outlined' ? 'outlined' : 'text';
        } else if (variant === 'default' || variant === 'destructive' || variant === 'secondary') {
            muiVariant = 'contained';
        }

        // Map custom sizes to MUI sizes
        let muiSize: 'small' | 'medium' | 'large' = 'medium';
        if (size === 'small' || size === 'sm') {
            muiSize = 'small';
        } else if (size === 'large' || size === 'lg') {
            muiSize = 'large';
        } else if (size === 'icon') {
            muiSize = 'small';
        }

        // Handle destructive variant
        const color = variant === 'destructive' ? 'error' : 'primary';

        return (
            <MuiButton
                ref={ref}
                variant={muiVariant}
                size={muiSize}
                color={color}
                className={className}
                {...props}
            >
                {children}
            </MuiButton>
        );
    }
);
Button.displayName = "Button";

export { Button };
