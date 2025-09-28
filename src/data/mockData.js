import { faBook, faBoxOpen, faMoneyBill, faCarSide } from "@fortawesome/free-solid-svg-icons";

export const cars = [
    {
        id: 1,
        image: "https://plus.unsplash.com/premium_photo-1737623479045-a6a27357ffa9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D",
        imageName: "car1",
        name: "Toyota",
        price: 31.99
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyfGVufDB8fDB8fHww",
        imageName: "car2",
        name: "BMW",
        price: 42.99
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTd8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
        imageName: "car3",  
        name: "Nissan",
        price: 29.99
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1623006772851-a8bf2c47d304?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
        imageName: "car4",
        name: "BMW",
        price: 35.99
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGNhcnxlbnwwfDF8MHx8fDA%3D",
        imageName: "car5",
        name: "Hyundai",
        price: 49.99
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1612593968469-d44a2e6ab5d2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fGNhcnxlbnwwfDF8MHx8fDA%3D",
        imageName: "car6",
        name: "Kia",
        price: 24.99
    },
    {
        id: 7,
        image: "https://images.unsplash.com/photo-1601827280216-d850636510e0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzZ8fGNhcnxlbnwwfDF8MHx8fDA%3D",
        imageName: "car7",
        name: "Ford",
        price: 59.99
    },
    {
        id: 8,
        image: "https://images.unsplash.com/photo-1581208509730-ea918b007133?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fGNhcnxlbnwwfDF8MHx8fDA%3D",
        imageName: "car8",
        name: "Volkswagen",
        price: 39.99
    },
];

export const kpiData = [
    {
        icon: faBook,
        label: "New Bookings",
        value: 12361,
        change: "+10%",
        color: '#00d1b2',
    },
    {
        icon: faBoxOpen,
        label: "Available Units",
        value: 431225,
        change: "+20%",
        color: '#00ffab',
    },
    {
        icon: faMoneyBill,
        label: "Total Revenue",
        value: 32441,
        change: "+50%",
        color: '#a78bfa',
    },
    {
        icon: faCarSide,
        label: "Rented Cars",
        value: 1325134,
        change: '+5%',
        color: "#38bdf8",
    },
];

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