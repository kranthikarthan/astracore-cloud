'use client';

import React from 'react';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, useTheme } from '@mui/material';

const ColorBox = ({ color, name, label }: { color: string; name: string; label: string }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
        <Box
            sx={{
                width: 100,
                height: 100,
                bgcolor: color,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: (theme) => theme.palette.getContrastText(color),
            }}
        >
            <Typography variant="caption">{color}</Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
            {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
    </Box>
);

export function ThemeShowcase() {
    const theme = useTheme();

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h3" gutterBottom>
                AstraCore Theme Showcase
            </Typography>

            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Color Palette
            </Typography>

            <Typography variant="h6">Primary</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <ColorBox color={theme.palette.primary.main} name="Primary Main" label="Celestial Core Blue" />
                <ColorBox color={theme.palette.primary.light} name="Primary Light" label="Tone 70" />
                <ColorBox color={theme.palette.primary.dark} name="Primary Dark" label="Tone 20" />
            </Box>

            <Typography variant="h6" sx={{ mt: 2 }}>Secondary</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <ColorBox color={theme.palette.secondary.main} name="Secondary Main" label="Cosmic Magenta" />
                <ColorBox color={theme.palette.secondary.light} name="Secondary Light" label="Tone 70" />
                <ColorBox color={theme.palette.secondary.dark} name="Secondary Dark" label="Tone 20" />
            </Box>

            <Typography variant="h6" sx={{ mt: 2 }}>Tertiary</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <ColorBox color={theme.palette.tertiary.main} name="Tertiary Main" label="Solar Amber" />
                <ColorBox color={theme.palette.tertiary.light} name="Tertiary Light" label="Tone 70" />
                <ColorBox color={theme.palette.tertiary.dark} name="Tertiary Dark" label="Tone 20" />
            </Box>

            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Typography
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h1">Heading 1</Typography>
                <Typography variant="h2">Heading 2</Typography>
                <Typography variant="h3">Heading 3</Typography>
                <Typography variant="h4">Heading 4</Typography>
                <Typography variant="h5">Heading 5</Typography>
                <Typography variant="h6">Heading 6</Typography>
                <Typography variant="body1">Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
                <Typography variant="body2">Body 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Typography>
                <Typography variant="button">Button Text</Typography>
            </Paper>

            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Components
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Card Component
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                This is a standard card with the theme's shape and elevation.
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Button variant="contained" color="primary">Primary</Button>
                                <Button variant="outlined" color="primary">Outlined</Button>
                                <Button variant="text" color="primary">Text</Button>
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Button variant="contained" color="secondary">Secondary</Button>
                                <Button variant="contained" color="error">Error</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
