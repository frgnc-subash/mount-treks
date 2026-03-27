#### Altigo Himalayan Treks

- Define your adventures in Nepal

## Prisma DB setup

Run from project root:

```bash
npx prisma validate
npm run prisma:migrate -- --name auth_google_dashboard
npm run prisma:generate
npm run db:seed
```

If migration still reports missing `DATABASE_URL`, run:

```bash
echo "$DATABASE_URL"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/altigo_treks?schema=public" npx prisma migrate dev --name auth_google_dashboard
```
