## Run

To run all apps and packages, run the following command:

```sh
npm run dev
```
## Project structure
```sh
repo/
 ├── apps/
 │     ├── frontend
 │     └── backend
 │
 ├── packages/
 │     └── shared-types
```
## Run with docker

```sh
docker compose build --no-cache
docker compose up

```
Frontend:
http://localhost:5173

Backend:
http://localhost:3000



Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
npm dlx turbo build
npm exec turbo build
```


## Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
npm dlx turbo build
npm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=backend
```

Without global `turbo`:

```sh
npx turbo build --filter=backend
npm exec turbo build --filter=backend
npm exec turbo build --filter=backend
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
npm exec turbo dev
npm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=backend
```

Without global `turbo`:

```sh
npx turbo dev --filter=backend
npm exec turbo dev --filter=backend
npm exec turbo dev --filter=backend
```