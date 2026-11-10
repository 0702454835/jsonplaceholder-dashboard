# Post Dashboard

A content management dashboard built with React and Vite that demonstrates full CRUD operations against the [JSONPlaceholder](https://jsonplaceholder.typicode.com) public REST API.

## Features

- **View posts** — fetches all posts from JSONPlaceholder and displays them in a responsive two-column grid
- **Pagination** — 10 posts per page with Previous / Next controls and a live page counter
- **Search** — filters posts by title or body content in real time, resetting to page 1 on each keystroke
- **Stats bar** — shows total posts, current search result count, and current page out of total pages
- **Create post** — modal form to submit a new post; the result is prepended to the local list immediately
- **Edit post** — pre-fills the modal form with existing post data for in-place updates
- **Delete post** — removes a post after a confirmation prompt, with a disabled state while the request is in flight
- **Responsive layout** — single-column stack on screens narrower than 650 px

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Dev server and bundler |
| TanStack Query | 5 | Server state, caching, and mutations |
| Lucide React | latest | Icon library |
| oxlint | latest | Linting |

## Project Structure

```
src/
├── services/
│   └── api.js        # Fetch wrappers for GET, POST, PUT, DELETE
├── App.jsx           # Main dashboard — queries, mutations, layout, and modal form
├── App.css           # Dashboard styles (layout, cards, modal, responsive breakpoints)
├── index.css         # Global reset and base styles
└── main.jsx          # React entry point; QueryClient configured here
```

### QueryClient configuration (`main.jsx`)

| Option | Value | Effect |
|---|---|---|
| `staleTime` | 5 minutes | Posts are not re-fetched while still fresh |
| `retry` | 1 | Failed requests are retried once before throwing |

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview

# Run the linter
npm run lint
```

## API

All data is read from and written to [JSONPlaceholder](https://jsonplaceholder.typicode.com). The API accepts requests and returns realistic responses but does not persist data between sessions — all mutations are reflected in local React Query cache only.

| Method | Endpoint | Used for |
|---|---|---|
| GET | `/posts` | Fetch all posts on load |
| POST | `/posts` | Create a new post |
| PUT | `/posts/:id` | Update an existing post |
| DELETE | `/posts/:id` | Delete a post |
Live Code Walkthrough

Video demonstration (approximately 5 minutes):

https://drive.google.com/file/d/1mDD0vYMPC-mxIv4762hCMuPo6pfgxvmz/view?usp=sharing

Repository

https://github.com/0702454835/jsonplaceholder-dashboard
