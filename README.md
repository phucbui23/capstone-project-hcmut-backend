# MEDIREMINDER Nestjs API

MEDIREMINDER Nestjs API

## 1. Version info

- Postgresql: 12.4

```bash
npm install
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
npx prisma migrate
```

First, we need to assure that the right schema is being used, run the above command first to migrate.Before seeding the database, we need to add the following packages to the project, run:

```nodejs
npm install -D typescript ts-node @types/node
```

Then we need to add the script for seeding, in the [_package.json_](./package.json) file, we add the following option:

```json
"prisma": {
    "seed": "ts-node prisma/seed.ts"
},
```

Also, in this seeding process, we have to process the JSON file directly, so we need to add the following option to the [_tsconfig.json_](tsconfig.json) file, the first one to allow import JSON, the second one to read the JSON file:

```json
"resolveJsonModule": true,
"esModuleInterop": true,
```

To seed the medication to the database, run:

```nodejs
npx prisma db seed
```

### Note:

Since seeding will create system users in **local database** (not on firebase). So in oder to use firebase services for doctors and patients, you have to log into admin with the following creadential and manually create those 2 users using provided APIs.

**username**: hospital.admin.1  
**password**: hospitaladmin

## 3. Run api

To run api, first run register (if don't have an account) and log in to receive access token. Attach this token to header everytime you test an api.

List of provided [APIs](http://localhost:3000/api#/), first run:.

```nodejs
npm run:start dev
```
