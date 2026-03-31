#### Altigo Himalayan Treks

- Define your adventures in Nepal

## Prisma DB setup

Run from project root:

```bash
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="replace-with-a-strong-password"
export ADMIN_NAME="Altigo Admin"
npx prisma validate
npm run prisma:migrate -- --name auth_google_dashboard
npm run prisma:generate
npm run db:seed
```

`npm run db:seed` now requires `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` to be set and will not fall back to default credentials.

## Vercel production deploys

Use this build command in Vercel so production deploys apply pending Prisma migrations automatically before building. Preview deployments will skip migrations:

```bash
npm run vercel-build
```

If migration still reports missing `DATABASE_URL`, run:

```bash
echo "$DATABASE_URL"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/altigo_treks?schema=public" npx prisma migrate dev --name auth_google_dashboard
```

## Google Search Console verification

For `URL prefix` verification, add your Search Console token to `.env.local` and redeploy:

```bash
GOOGLE_SITE_VERIFICATION="your-google-search-console-token"
```

The app will expose it as the standard `google-site-verification` meta tag from the root layout.
