import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
    test('renders Navbar, Home, and Footer components', () => {
        render(<App />);

        // Debug the rendered output
        screen.debug();

        // Check if Navbar is rendered
        const navbar = screen.getByRole('navigation');
        expect(navbar).toBeInTheDocument();

        // Check if Home page content is rendered
        const homeContent = screen.getByText(/home/i);
        expect(homeContent).toBeInTheDocument();

        // Check if Footer is rendered
        const footer = screen.getByText(/footer/i);
        expect(footer).toBeInTheDocument();
    });
});