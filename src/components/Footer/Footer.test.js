import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer.jsx';

describe('Footer Component', () => {
    test('renders the footer with correct content', () => {
        render(<Footer />);

        const footerElement = screen.getByRole('contentinfo');
        expect(footerElement).toBeInTheDocument();

        const headingElement = screen.getByText('footer');
        expect(headingElement).toBeInTheDocument();
    });
});