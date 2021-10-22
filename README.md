# Crowd Picker
Have your community decide what the next movie you watch be.

# Hosted Site
https://crowd-picker.vercel.app/

## Example list
https://crowd-picker.vercel.app/list/s5HnMR8-

# Features
- Login system
- Persistant votes
- Unlimited lists

# Tech
- Next.js (Framework)
- Next Auth
- React
- Styled Components
- PostgreSQL

# Requirements
- An API key from OMDB: http://www.omdbapi.com/apikey.aspx
- Register application with OAuth provider (This app uses Google)
- A PostgreSQL database with the following tables:
  <details>
  <summary>Table Queries</summary>
  <p>
  
  ```sql
      CREATE TABLE users (
      id SERIAL,
      email text PRIMARY KEY,
      theme text DEFAULT 'light',
      created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE lists (
        id SERIAL,
        list_id text PRIMARY KEY,
        creator text REFERENCES users(email) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE movies (
        id SERIAL UNIQUE,
        list_id text REFERENCES lists(list_id) ON DELETE CASCADE,
        movie_id text NOT NULL,
        movie_data jsonb NOT NULL,
        watched boolean DEFAULT false,
        created_at TIMESTAMP DEFAULT now(),
        PRIMARY KEY(list_id, movie_id)
      );

      CREATE TABLE likes (
        id int REFERENCES movies(id) ON DELETE CASCADE,
        email text REFERENCES users(email) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT now(),
        PRIMARY KEY(id, email)
      );

      CREATE TABLE never_watched (
        id int REFERENCES movies(id) ON DELETE CASCADE,
        email text REFERENCES users(email) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT now(),
        PRIMARY KEY(id, email)
      );
  ```
  
  </p>
  </details>

# Installation
> 1. git clone https://github.com/tedcrisan/crowd-picker.git
> 2. yarn install or npm install (Choose whatever command is equivalent in your package manager)
> 3. Populate .env.local file 
  <details>
  <summary>Necessary Environment Variables</summary>
  
  ```
  - NEXT_PUBLIC_OMDB_API_KEY
  - AUTH0_CLIENT_ID
  - AUTH0_CLIENT_SECRET
  - AUTH0_DOMAIN
  - NEXTAUTH_URL
  - GOOGLE_ID
  - GOOGLE_SECRET
  - DB_CONN_STRING
  ```
  
  </details>

# Deployment
I used Vercel to deploy the app. Please use what you feel comfortable (Heroku, Netlify, DigitalOcean, etc...)
