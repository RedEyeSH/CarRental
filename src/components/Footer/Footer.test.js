import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer.jsx';

// Mock react-i18next to handle translations in tests
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key, // Mock translation function
    }),
}));

describe('Footer Component', () => {
    test('renders the footer with correct content', () => {
        render(<Footer />);

        const footerElement = screen.getByRole('contentinfo');
        expect(footerElement).toBeInTheDocument();

        // Use a more specific query for the heading or tagline
        const taglineElement = screen.getByText(/footer\.tagline/i);
        expect(taglineElement).toBeInTheDocument();
    });
});