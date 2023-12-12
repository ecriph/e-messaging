# e-Messaging

A dockerized cross-platform chat application, built with react-native and nestjs

### Start project

- Start your resources by running the docker command run `docker compose -f docker-compose.dev.yml up`

### Mobile App

- To start the mobile application:
- Navigate to mobile directory with command:
  - `cd mobile`
  - `yarn add`
- create a .env file, and add your environment variables with the format from `.env-example` file

- To start project run code
  - `yarn start`

### Backend

- To start the nestjs application:
- Navigate to the api directory with the command:

  - `cd api`
  - `npm install`
  - create a .env file, and add your environment variables with the format from

  ```
  APP_ENV=local
  MAIN_API_URL=http://10.0.2.2:3000
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
  ```

- To start project run code
  - `npm run start:dev`

### Development Status

- in progress
