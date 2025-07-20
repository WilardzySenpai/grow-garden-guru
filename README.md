# Grow A Garden - Guru

Grow A Garden - Guru is a comprehensive game intelligence platform for the popular game "Grow A Garden". This platform provides players with tools and information to enhance their gaming experience.

## Features

- **Fruit Calculator:** Calculate the most profitable fruits to grow.
- **Item Encyclopedia:** A complete encyclopedia of all items in the game.
- **Market Board:** Track the in-game market prices of items.
- **Mutationpedia:** A comprehensive guide to all mutations in the game.
- **Pet Encyclopedia:** A list of all obtainable and unobtainable pets.
- **Weather Status:** Check the current weather in the game.
- **System Monitor:** Monitor the status of the game's servers.
- **Notification Feed:** Get notified about important in-game events.
- **Authentication:** Secure authentication with Discord.

## Technologies Used

- **Vite:** A fast build tool for modern web projects.
- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript.
- **shadcn/ui:** A collection of reusable UI components.
- **Tailwind CSS:** A utility-first CSS framework.
- **Supabase:** An open-source Firebase alternative for building secure and scalable backends.
- **React Router:** A declarative routing library for React.
- **Recharts:** A composable charting library for React.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm (or yarn/pnpm)
- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) is recommended for managing Node.js versions.

### Installation

1.  Clone the repo
    ```sh
    git clone <YOUR_GIT_URL>
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Start the development server
    ```sh
    npm run dev
    ```

## Supabase Setup

This project uses Supabase for its backend. The Supabase client is pre-configured, so you don't need to set up any environment variables for the client to work. However, if you want to work on the backend, you will need to set up the Supabase CLI and link it to your Supabase project.

1.  Install the Supabase CLI
    ```sh
    npm install -g supabase
    ```
2.  Log in to your Supabase account
    ```sh
    supabase login
    ```
3.  Link your local repository to your Supabase project
    ```sh
    supabase link --project-ref <YOUR_PROJECT_REF>
    ```
    You can find your project reference in the `supabase/config.toml` file.
4.  Push the database migrations
    ```sh
    supabase db push
    ```

## Deployment

This project can be deployed to any static site hosting service, such as Vercel, Netlify, or GitHub Pages.

To build the project for production, run the following command:

```sh
npm run build
```

This will create a `dist` directory with all the static files that can be deployed.
