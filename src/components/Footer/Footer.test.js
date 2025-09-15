import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer.jsx';

describe('Footer Component', () => {
    test('renders the footer with correct content', () => {
        render(<Footer />);

        // Check if the footer element is in the document
        const footerElement = screen.getByRole('contentinfo');
        expect(footerElement).toBeInTheDocument();

        // Check if the h1 with text "footer" is in the document
        const headingElement = screen.getByText('footer');
        expect(headingElement).toBeInTheDocument();
    });
});