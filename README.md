# LiveDoctors

Live Doctors platform feature update

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
bun dev
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

# admin steps
create admin using 
`npx ts-node create_admin.ts` edit the password in script and run and then revert

fill the .`env`
```
DATABASE_URL=postgresql://<username>:<password>@<ip>:<port>/<db_name>
SERVER_PEPPER=<serverpepper>
JWT_SECRET=
```
after admin is created, create plans and features using the script

`npx ts-node scripts/plansandfeature.ts`

# doctor steps 
signup doctor and create the clinic
create clinic http://localhost:3000/admin/chamber
create the interval and days http://localhost:3000/admin/appointment/assign

then need to update the consultation settings, otherwise amount will be 0 for the appointment 
and finally can create patient or appointments and so on
