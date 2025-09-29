import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActiveRentals from './ActiveRentals';

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span data-testid="icon"></span>,
}));

describe('ActiveRentals Component', () => {
    test('renders the component with correct structure', () => {
        render(<ActiveRentals />);

        expect(screen.getByText('Active Rentals')).toBeInTheDocument();

        expect(screen.getByText('Helsinki')).toBeInTheDocument();
        expect(screen.getByText('Tampere')).toBeInTheDocument();
        expect(screen.getByText('Espoo')).toBeInTheDocument();
        expect(screen.getByText('Vantaa')).toBeInTheDocument();

        expect(screen.getByText('City')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Start-Date')).toBeInTheDocument();
        expect(screen.getByText('End-Date')).toBeInTheDocument();
    });

    test('renders the search input', () => {
        render(<ActiveRentals />);

        const searchInput = screen.getByPlaceholderText('Search...');
        expect(searchInput).toBeInTheDocument();
    });


    test('renders the table with mock data', () => {
        render(<ActiveRentals />);

        expect(screen.getByText('HEL-1')).toBeInTheDocument();
        expect(screen.getByText('Fiat 500 for 5 days in Helsinki')).toBeInTheDocument();
        expect(screen.getByText('Dec 5')).toBeInTheDocument();
        expect(screen.getByText('Dec 10')).toBeInTheDocument();
    });

    test('handles search input change', () => {
        render(<ActiveRentals />);

        const searchInput = screen.getByPlaceholderText('Search...');
        fireEvent.change(searchInput, { target: { value: 'Fiat' } });

        expect(searchInput.value).toBe('Fiat');
    });
});