import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
    test('renders Navbar, Home, and Footer components', () => {
        render(<App />);

        const navbar = screen.getByRole('navigation');
        expect(navbar).toBeInTheDocument();

        const homeContent = screen.getByText(/home/i);
        expect(homeContent).toBeInTheDocument();

        const footer = screen.getByText(/footer/i);
        expect(footer).toBeInTheDocument();
    });
});