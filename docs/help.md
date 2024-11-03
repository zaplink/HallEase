# Project Documentation

## Overview

This document provides essential commands and guidelines for managing the project environment using Docker and PostgreSQL. Use these commands to build, start, stop, and interact with the application and its database effectively.

## Commands

### Docker Commands

#### 1. Build and Start Services

- Command:

```bash
docker-compose up
```

- Description: This command starts all services as defined in the `docker-compose.yml` file.

- Note: Use the `--build` flag only if you've made changes to Dockerfiles or dependencies and need to rebuild images.

- Example:

```bash
docker-compose up --build
```

#### 2. Stop and Remove Services and Volumes

- Command:

```bash
docker-compose down
```

- Description: Stops and removes all containers, networks, and resources created by `docker-compose up`.

- Note: Use the `-v` flag only if you want to remove all associated volumes, including any persistent data stored (e.g., database data).

- Example:

```bash
docker-compose down -v
```

#### 3. Access the Postgres Container

- Command:

```bash
docker exec -it hallease_postgres_1 /bin/bash
```

- Description: Opens an interactive Bash session in the PostgreSQL container. Replace `hallease_postgres_1` with your container’s name if different.

#### 4. Exit the Container

- Command:

```bash
exit
```

- Description: Closes the interactive session within the container.

### PostgreSQL Commands

#### 1. Access the PostgreSQL Command Line Interface (CLI)

- Command:

```bash
psql -U postgres
```

- Description: Opens the PostgreSQL command-line interface using the postgres user, allowing interaction with the database.

#### 2. Export Database (SQL Dump)

- Command:

```bash
pg_dump -U postgres -h localhost -p 5432 hall_management > app/db/hall_management.sql
```

Description: Exports the hall_management database to `app/db/hall_management.sql`. Modify the path as necessary if you prefer to store the dump file elsewhere.

#### 3. PostgreSQL CLI Shortcuts

- List all databases: `\l`
- Connect to a specific database: `\c databasename`
- Exit the PostgreSQL CLI: `\q`
- List all tables in the current database: `\d`

## Application URLs

Once services are running, access the application via the following URLs:

- Frontend URL: http://localhost:5173/
- Backend URL: http://localhost:3000/

Ensure the specified ports are open on your machine. Adjust URLs as needed if the application is configured to run on different ports.

## Notes

- If you initialize the database using an SQL dump file, make sure it is up-to-date to avoid data inconsistency.

- For live updates in the Docker environment, ensure code changes are synchronized with Docker volumes. This will allow changes to reflect without restarting the services, except for changes in `package.json` or similar configuration files.

- Regularly export or backup the database to preserve any modifications made during development.
