import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActiveRentals from './ActiveRentals';

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span data-testid="icon"></span>,
}));

describe('ActiveRentals Component', () => {
    beforeEach(() => {
        // Mock fetch globally
        global.fetch = jest.fn((url) => {
            if (url.endsWith('/cars/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { id: 1, brand: 'Fiat', model: '500', license_plate: 'HEL-1', status: 'RENTED', image: null },
                        { id: 2, brand: 'Toyota', model: 'Corolla', license_plate: 'TAM-2', status: 'AVAILABLE', image: null },
                    ]),
                });
            }
            if (url.endsWith('/bookings/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { id: 101, car_id: 1, user_id: 201, start_date: '2025-12-05T00:00:00Z', end_date: '2025-12-10T00:00:00Z' },
                    ]),
                });
            }
            if (url.endsWith('/auth/users/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { id: 201, name: 'John Doe', email: 'john@example.com' },
                    ]),
                });
            }
            return Promise.resolve({ ok: false });
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('renders the component header and search input', async () => {
        render(<ActiveRentals />);
        expect(screen.getByText('Active Rentals')).toBeInTheDocument();
        const searchInput = screen.getByPlaceholderText('Search by car, user, or booking ID...');
        expect(searchInput).toBeInTheDocument();
    });

    test('renders the table with mocked rentals data', async () => {
        render(<ActiveRentals />);

        await screen.findByText(/HEL-1/);

        expect(screen.getByText('Fiat 500 (HEL-1)')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('05/12/2025')).toBeInTheDocument();
        expect(screen.getByText('10/12/2025')).toBeInTheDocument();
    });

    test('handles search input change', async () => {
        render(<ActiveRentals />);
        await screen.findByText(/HEL-1/);

        const searchInput = screen.getByPlaceholderText('Search by car, user, or booking ID...');
        fireEvent.change(searchInput, { target: { value: 'Fiat' } });
        expect(searchInput.value).toBe('Fiat');
    });

    test('renders no active rentals message if none exist', async () => {
        // Override fetch to return no rented cars
        global.fetch = jest.fn((url) => {
            if (url.endsWith('/cars/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { id: 1, brand: 'Fiat', model: '500', license_plate: 'HEL-1', status: 'AVAILABLE' },
                    ]),
                });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        });

        render(<ActiveRentals />);
        await screen.findByText('No active rentals found.');
        expect(screen.getByText('No active rentals found.')).toBeInTheDocument();
    });
});
