# MEDIREMINDER Nestjs API

MEDIREMINDER Nestjs API

## 1. Version info

- Postgresql: 12.4

```bash
$ npm install
```
## 2. Create and seed the database
Run the following command to create your database
```
CREATE USER developer SUPERUSER;

ALTER USER developer WITH PASSWORD 'password';

CREATE DATABASE medireminder_nestjs_api_dev WITH OWNER developer;
```

Run the following command to create your PostgreSQL database file. This also creates the tables that are defined in [`prisma/schema.prisma`](./capstone_project/prisma/schema.prisma):

```
npx prisma migrate dev --name init
```
