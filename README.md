# Appointment Booking API

This is a backend API for an appointment booking system. The API allows customers to query available appointment slots with sales managers based on language, product interest, and customer rating.

## Getting Started

### Prerequisites
- Node.js (20+)
- Docker
- npm (or another package manager like Yarn)
- Prisma ORM

### Installation

1. Clone the repository:
  ```sh
  git clone <repository-url>
  cd appointment-booking-api
  ```
2. Install dependencies:
  ```sh
  npm install
  ```
3. Create a `.env` file and set the database connection and update the postgres credentials with the actual values:
  ```sh
  DATABASE_URL="postgres://username:password@localhost:5432/postgres"
  POSTGRES_DB=POSTGRES_DB
  POSTGRES_USER=POSTGRES_USER
  POSTGRES_PASSWORD=POSTGRES_PASSWORD
  ```

4. Run the following commands to setup the database:
  ```sh
  docker compose up --build -d
  ```

5. Generate Prisma client:
  ```sh
  npx prisma generate
  ```

### Running the API

Then start the API:
```sh
npm run build
npm run start
```

## API Usage
- **URL:** `POST http://localhost:3000/calendar/query`
- **Request Body:**
  ```json
  {
    "date": "2024-05-03",
    "products": ["SolarPanels", "Heatpumps"],
    "language": "German",
    "rating": "Gold"
  }
  ```
- **Response Example:**
  ```json
  [
    { "available_count": 1, "start_date": "2024-05-03T10:30:00.00Z" },
    { "available_count": 1, "start_date": "2024-05-03T12:00:00.00Z" }
  ]
  ```

## Running Tests
Ensure the API is running, then execute in `tests` folder:
```sh
npm install
npm run test
```
