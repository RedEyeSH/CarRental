import { faBook, faBoxOpen, faMoneyBill, faCarSide } from "@fortawesome/free-solid-svg-icons";

export const cars = [
    {
        id: 1,
        image: "https://plus.unsplash.com/premium_photo-1737623479045-a6a27357ffa9?w=600&auto=format&fit=crop&q=60",
        imageName: "car1",
        name: "Toyota",
        price: 31.99,
        creationDate: "2025-09-25"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60",
        imageName: "car2",
        name: "BMW",
        price: 42.99,
        creationDate: "2025-09-26"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=600&auto=format&fit=crop&q=60",
        imageName: "car3",
        name: "Nissan",
        price: 29.99,
        creationDate: "2025-09-22"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1623006772851-a8bf2c47d304?w=600&auto=format&fit=crop&q=60",
        imageName: "car4",
        name: "BMW",
        price: 35.99,
        creationDate: "2025-09-28"
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=600&auto=format&fit=crop&q=60",
        imageName: "car5",
        name: "Hyundai",
        price: 49.99,
        creationDate: "2025-09-20"
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1612593968469-d44a2e6ab5d2?w=600&auto=format&fit=crop&q=60",
        imageName: "car6",
        name: "Kia",
        price: 24.99,
        creationDate: "2025-09-27"
    },
    {
        id: 7,
        image: "https://images.unsplash.com/photo-1601827280216-d850636510e0?w=600&auto=format&fit=crop&q=60",
        imageName: "car7",
        name: "Ford",
        price: 59.99,
        creationDate: "2025-09-21"
    },
    {
        id: 8,
        image: "https://images.unsplash.com/photo-1581208509730-ea918b007133?w=600&auto=format&fit=crop&q=60",
        imageName: "car8",
        name: "Volkswagen",
        price: 39.99,
        creationDate: "2025-09-29"
    },
];


export const kpiData = [
    {
        icon: faBook,
        label: "New Bookings",
        value: 2,
        change: "+10%",
        color: '#00d1b2',
    },
    {
        icon: faBoxOpen,
        label: "Available Units",
        value: 2,
        change: "+20%",
        color: '#00ffab',
    },
    {
        icon: faMoneyBill,
        label: "Total Revenue",
        value: 100,
        change: "+50%",
        color: '#a78bfa',
    },
    {
        icon: faCarSide,
        label: "Rented Cars",
        value: 10,
        change: '+5%',
        color: "#38bdf8",
    },
];

export let booking = [
    { id: 1, user: "user1", car: "Toyota Corolla", start_date: "2025-10-15", end_date: "2025-10-20", total_price: 150.0, payment_status: "PENDING", created_at: new Date().toISOString() },
    { id: 2, user: "user2", car: "BMW 320i", start_date: "2025-10-18", end_date: "2025-10-21", total_price: 200.0, payment_status: "PAID", created_at: new Date().toISOString() }
];

let nextId = booking.length + 1;

export const bookingApi = {
    getAll: () => Promise.resolve([...booking]),
    getById: (id) => Promise.resolve(booking.find(b => b.id === id)),
    create: (b) => {
        const newBooking = { id: nextId++, ...b, created_at: new Date().toISOString() };
        booking.push(newBooking);
        return Promise.resolve(newBooking);
    },
    update: (id, updated) => {
        booking = booking.map(b => b.id === id ? { ...b, ...updated } : b);
        return Promise.resolve(booking.find(b => b.id === id));
    },
    delete: (id) => {
        booking = booking.filter(b => b.id !== id);
        return Promise.resolve();
    }
};

export const LineChartData = [
    {
        "id": "japan",
        "data": [
        {
            "x": "plane",
            "y": 254
        },
        {
            "x": "helicopter",
            "y": 192
        },
        {
            "x": "boat",
            "y": 39
        },
        {
            "x": "train",
            "y": 4
        },
        {
            "x": "subway",
            "y": 189
        },
        {
            "x": "bus",
            "y": 267
        },
        {
            "x": "car",
            "y": 268
        },
        {
            "x": "moto",
            "y": 28
        },
        {
            "x": "bicycle",
            "y": 274
        },
        {
            "x": "horse",
            "y": 100
        },
        {
            "x": "skateboard",
            "y": 96
        },
        {
            "x": "others",
            "y": 143
        }
        ]
    },
    {
        "id": "france",
        "data": [
        {
            "x": "plane",
            "y": 120
        },
        {
            "x": "helicopter",
            "y": 53
        },
        {
            "x": "boat",
            "y": 3
        },
        {
            "x": "train",
            "y": 38
        },
        {
            "x": "subway",
            "y": 265
        },
        {
            "x": "bus",
            "y": 153
        },
        {
            "x": "car",
            "y": 113
        },
        {
            "x": "moto",
            "y": 163
        },
        {
            "x": "bicycle",
            "y": 272
        },
        {
            "x": "horse",
            "y": 41
        },
        {
            "x": "skateboard",
            "y": 261
        },
        {
            "x": "others",
            "y": 215
        }
        ]
    },
    {
        "id": "us",
        "data": [
        {
            "x": "plane",
            "y": 231
        },
        {
            "x": "helicopter",
            "y": 26
        },
        {
            "x": "boat",
            "y": 97
        },
        {
            "x": "train",
            "y": 260
        },
        {
            "x": "subway",
            "y": 2
        },
        {
            "x": "bus",
            "y": 196
        },
        {
            "x": "car",
            "y": 57
        },
        {
            "x": "moto",
            "y": 52
        },
        {
            "x": "bicycle",
            "y": 3
        },
        {
            "x": "horse",
            "y": 172
        },
        {
            "x": "skateboard",
            "y": 41
        },
        {
            "x": "others",
            "y": 91
        }
        ]
    },
    {
        "id": "germany",
        "data": [
        {
            "x": "plane",
            "y": 112
        },
        {
            "x": "helicopter",
            "y": 282
        },
        {
            "x": "boat",
            "y": 126
        },
        {
            "x": "train",
            "y": 4
        },
        {
            "x": "subway",
            "y": 297
        },
        {
            "x": "bus",
            "y": 77
        },
        {
            "x": "car",
            "y": 76
        },
        {
            "x": "moto",
            "y": 106
        },
        {
            "x": "bicycle",
            "y": 58
        },
        {
            "x": "horse",
            "y": 89
        },
        {
            "x": "skateboard",
            "y": 212
        },
        {
            "x": "others",
            "y": 28
        }
        ]
    },
    {
        "id": "norway",
        "data": [
        {
            "x": "plane",
            "y": 41
        },
        {
            "x": "helicopter",
            "y": 120
        },
        {
            "x": "boat",
            "y": 232
        },
        {
            "x": "train",
            "y": 132
        },
        {
            "x": "subway",
            "y": 257
        },
        {
            "x": "bus",
            "y": 11
        },
        {
            "x": "car",
            "y": 220
        },
        {
            "x": "moto",
            "y": 156
        },
        {
            "x": "bicycle",
            "y": 281
        },
        {
            "x": "horse",
            "y": 215
        },
        {
            "x": "skateboard",
            "y": 187
        },
        {
            "x": "others",
            "y": 52
        }
        ]
    }
]