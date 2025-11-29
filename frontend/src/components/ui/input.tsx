import * as React from "react"
import { TextField, TextFieldProps } from "@mui/material"
import { cn } from "@/lib/utils"

export interface InputProps extends Omit<TextFieldProps, 'variant' | 'size'> {
    size?: 'small' | 'medium' | 'large' | 'default' | 'sm' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, size = 'small', onChange, value, ...props }, ref) => {
        // Map custom sizes to MUI sizes
        let muiSize: 'small' | 'medium' = 'small';
        if (size === 'medium' || size === 'large' || size === 'lg') {
            muiSize = 'medium';
        }

        // Ensure onChange is always defined if value is provided
        const handleChange = onChange || (() => {});

        return (
            <TextField
                ref={ref}
                variant="outlined"
                size={muiSize}
                value={value ?? ''}
                onChange={handleChange}
                className={cn(className)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                        '&:hover': {
                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                        },
                    },
                }}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
