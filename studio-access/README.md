# StudioGate

MVP access gateway for **creative studios**: share **Figma** and **Higgsfield** team accounts with freelancers **without giving them passwords**, then **revoke in one click**.

## Who it's for

Design / AI / production studios that today:
- dictate passwords on calls,
- rotate a shared team password monthly,
- forget to remove freelancer access,
- worry about billing/credits on shared tools.

## What the MVP includes

1. **Web workspace** (`/app`)
   - Owner connects Figma + Higgsfield
   - Invite freelancers and assign tools
   - One-click revoke
   - Audit log
2. **Desktop shell** (`npm run desktop`)
   - Special controlled browser window
   - `Connect` captures team-account session cookies
   - `Open` launches tool for a freelancer in an isolated partition

> Sales tip: use **team/member accounts without billing**, keep owner/billing accounts offline from StudioGate.

## Quick start

```bash
cd studio-access
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

Open http://localhost:3001

### Demo logins (after seed)

| Role | Email | Password |
|------|-------|----------|
| Owner | owner@studio.local | owner123456 |
| Freelancer | freelancer@studio.local | freelancer123 |

### Desktop (real Connect/Open)

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
npm run desktop
```

1. Log in as owner  
2. Click **Connect (desktop)** on Figma / Higgsfield  
3. Log into the **team** account (not billing owner)  
4. Close the connect window  
5. Invite freelancer, grant tools  
6. Freelancer clicks **Open**  
7. Project done → **Revoke**

### Web-only sales demo

If you are on a call without Electron:
- use **Mark connected (demo)**
- walk through invite → open (logs) → revoke

## Pitch price anchor

For studios like yours: **19–29k ₽ / month**  
Pilot: **9.9–15k ₽ for 2 weeks**

## Notes / risks

- Prefer official seats when the tool supports cheap member roles.
- Shared sessions can conflict with a vendor's ToS — disclose this in pilots.
- Figma is in MVP because every studio knows it; Higgsfield is the sharper credit/billing pain.

## Stack

Next.js 15 · Prisma SQLite · JWT auth · Electron controlled browser

## Internal pilot

See **[PILOT.md](./PILOT.md)** for the fastest way to test on your own Figma team today.
