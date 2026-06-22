# NeoTravel — Task Board

> **Team:** Gendell · Inde · Yahia
> **Stack:** n8n + Next.js + Airtable + Resend + Gemini 2.0 Flash
> **Repo:** github.com/boolshyt/neotravel

---

## 🔴 RIGHT NOW — L1 due June 24 at 23:59

The draft is ready in `L1_DOSSIER_DE_CADRAGE.md`. Each person adds their section, then Gendell submits.

| Who | What to do | Status |
|---|---|---|
| **Gendell** | Read the draft, push it to GitHub, submit PDF on Epitech platform before June 24 23:59 | ⬜ |
| **Inde** | Open `L1_DOSSIER_DE_CADRAGE.md` → add 2–3 paragraphs in Section 2.1 (in French: what NeoTravel does today, why manual is a problem, what automation changes) → push | ⬜ |
| **Yahia** | Open `L1_DOSSIER_DE_CADRAGE.md` → add 2–3 competitor examples in Section 9 (name + one line each: GetTransfer, Mozio, etc.) → push | ⬜ |

Once L1 is submitted → move to Phase 2 below.

---

## Deadlines at a Glance

| Date | Deliverable | Who |
|---|---|---|
| **June 24 at 23:59** | L1 — Dossier de cadrage | All 3 |
| **June 29 at 23:59** | L2 — Prototype + L3 — Handoff docs | Gendell + Inde |
| **June 30 at 23:59** | Presentation slides | Yahia + Inde |
| **July 1** | Live presentation + demo | All 3 |

---

## Account Setup

> Do this before anything else. Everything is free — no credit card needed.

| Account | Who | Link | Notes |
|---|---|---|---|
| GitHub | Gendell ✅ | github.com/boolshyt/neotravel | Already done |
| Gemini API | Gendell | aistudio.google.com | Free — powers the AI agent |
| n8n | Gendell | Local install (see Phase 0) | Free — the automation engine |
| Airtable | Gendell | airtable.com | Free — database + dashboard |
| Vercel | Inde | vercel.com | Free — sign in with GitHub |
| Resend | Inde | resend.com | Free (3,000 emails/month) |
| Node.js | Both | nodejs.org → LTS | Required to run n8n and Next.js |
| Git | Both | git-scm.com | Required to push/pull from repo |

---

## ▶ PHASE 0 — Setup _(June 22, today — do this first)_

> Goal: accounts ready, repo connected, everyone can pull/push code.
> When done: move to Phase 1.

### Gendell
- [ ] Run `git --version` in terminal — if you see a version number, you're good
- [ ] Go to [aistudio.google.com](https://aistudio.google.com) → sign in → Get API key → save it (you'll need it in Phase 3)
- [ ] Go to [nodejs.org](https://nodejs.org) → download LTS → install → verify with `node --version`
- [ ] Install n8n: run `npm install n8n -g` then `n8n start` → open [localhost:5678](http://localhost:5678) to confirm it works
- [ ] Go to [airtable.com](https://airtable.com) → sign up → create a base called **"NeoTravel CRM"**
- [ ] Inside the base, create 4 tables: `Demandes`, `Devis`, `Clients`, `Matrices`
- [ ] In Airtable: profile icon → Account → API → generate a personal access token → save it
- [ ] On GitHub: Settings → Collaborators → add Inde and Yahia's GitHub usernames

### Inde
- [ ] Clone the repo: `git clone https://github.com/boolshyt/neotravel.git`
- [ ] Go to [nodejs.org](https://nodejs.org) → download LTS → install → verify with `node --version`
- [ ] Go to [vercel.com](https://vercel.com) → sign up with GitHub
- [ ] Go to [resend.com](https://resend.com) → sign up → API Keys → create a key → save it
- [ ] Run `git --version` to confirm git is installed

### Yahia
- [ ] Accept the GitHub collaborator invite (Gendell will send it)
- [ ] Clone the repo: `git clone https://github.com/boolshyt/neotravel.git`
- [ ] Run `git --version` to confirm git is installed

---

## ▶ PHASE 1 — L1 Dossier de Cadrage _(June 22–24, due June 24 at 23:59)_

> Goal: complete and submit the L1 document before June 24 at 23:59. Worth 15 points.
> The draft is already written in `L1_DOSSIER_DE_CADRAGE.md` — each person adds their section.
> When done: Gendell moves to Phase 2, Inde moves to Phase 2, Yahia moves to Phase 3 (slides).

### Gendell
- [ ] Read through `L1_DOSSIER_DE_CADRAGE.md` — the full draft is ready
- [ ] Push it to GitHub so the team can access it:
  ```bash
  git add .
  git commit -m "docs: add L1 draft and task board"
  git push
  ```
- [ ] Review the final version once Inde and Yahia have added their sections
- [ ] Convert to PDF (export from VS Code, Notion, or any markdown viewer) and submit on the Epitech platform before June 24 at 23:59

### Inde
- [ ] Pull the latest from the repo: `git pull`
- [ ] Open `L1_DOSSIER_DE_CADRAGE.md`
- [ ] Add your contribution to **Section 2.1** — 2–3 paragraphs in French describing: what NeoTravel does today, why the manual process is a problem, what business value the automation creates
- [ ] Push your changes:
  ```bash
  git add L1_DOSSIER_DE_CADRAGE.md
  git commit -m "docs: add business analysis section to L1"
  git push
  ```

### Yahia
- [ ] Pull the latest from the repo: `git pull`
- [ ] Open `L1_DOSSIER_DE_CADRAGE.md`
- [ ] Add your contribution to **Section 9 (Conclusion)** — find 2–3 real competitors or similar tools (ex: GetTransfer, Koolicar, Mozio) and write one line each: name + what they do
- [ ] Push your changes:
  ```bash
  git add L1_DOSSIER_DE_CADRAGE.md
  git commit -m "docs: add competitor section to L1"
  git push
  ```

---

## ▶ PHASE 2 — Database + Frontend Setup _(June 24–25)_

> Goal: Airtable database built, Next.js project initialized, form structure started.
> Gendell and Inde work in parallel — they don't block each other.
> When done: Gendell moves to Phase 3, Inde moves to Phase 3.

### Gendell — Build the Airtable Database
- [ ] Build `Demandes` table fields: Name, Company, Email, Phone, Departure, Destination, Date, Passengers, TripType, Urgency, Comment, Status, CompletenessScore, CreatedAt
- [ ] Build `Matrices` table fields: SeasonalityCoeff, UrgencyCoeff, CapacityCoeff, Margin _(these must be editable without touching code)_
- [ ] Build `Devis` table fields: LeadID, PrixHT, TVA, PrixTTC, Status, PDFUrl, SentAt, RelanceCount, NextRelanceAt
- [ ] Build `Clients` table fields: Name, Company, Email, Phone, History
- [ ] Set up Airtable Interface: click "Interfaces" tab → create dashboard with views for: leads by status / new this week / awaiting follow-up

### Inde — Initialize the Next.js Project
- [ ] In the `neotravel` folder in terminal:
  ```bash
  npx create-next-app@latest . --typescript --tailwind --app
  ```
- [ ] Create folders: `components/` and `lib/`
- [ ] Create `.env.local` at the root (never commit this file):
  ```
  RESEND_API_KEY=paste_your_key_here
  N8N_WEBHOOK_URL=get_this_from_gendell_in_phase_3
  ```
- [ ] Push to GitHub:
  ```bash
  git add .
  git commit -m "feat: init next.js project"
  git push
  ```
- [ ] Connect repo to Vercel: vercel.com → New Project → Import from GitHub → select `boolshyt/neotravel` → Deploy

---

## ▶ PHASE 3 — Automation + Conversational Form _(June 25–27)_

> Goal: n8n workflows running, form built, form talks to n8n.
> Gendell and Inde work in parallel.
> When done: both move to Phase 4.

### Gendell — Build the n8n Workflows

**Workflow 1 — Lead Qualification**
- [ ] In n8n → New Workflow → name it "Lead Qualification"
- [ ] Add **Webhook node** → copy the webhook URL → save it → share it with Inde
- [ ] Add **Google Gemini Chat Model node** → connect your Gemini API key → select model `gemini-2.0-flash`
- [ ] Write the agent system prompt (role, rules, tone, escalation conditions — see `project/PROJECT_RULES.md`) → paste it into the node
- [ ] Add **Code node** → implement `calculer_devis()` (full formula in `project/PRICING_ENGINE.md`) → paste it in. The AI calls this function — it never estimates prices itself.
- [ ] Add **Airtable node** → connect API key → base "NeoTravel CRM" → table "Demandes" → map form fields to columns
- [ ] Test: use "Test Webhook" in n8n with fake data → confirm lead appears in Airtable

**Workflow 2 — Follow-up Scheduler**
- [ ] Create new workflow: "Follow-up Scheduler"
- [ ] Add **Schedule Trigger** → set to every 2 minutes (for demo; daily for real)
- [ ] Add **Airtable node**: query leads where Status = "Devis envoyé" AND NextRelanceAt ≤ today
- [ ] Add **If node**: RelanceCount < 2 → if true: send follow-up / if false: update status to "Clôturé"
- [ ] Add **Resend email node** → connect Inde's Resend API key → send follow-up email
- [ ] Add **Airtable node**: update RelanceCount +1 and set new NextRelanceAt date

### Inde — Build the Conversational Form
- [ ] Build multi-step form — one question per screen, progress bar, French copy
  Steps: client type → name + company → email → phone → departure → destination → date → passengers → trip type → urgency → comment → confirmation screen
- [ ] On submit: POST all form data as JSON to the N8N_WEBHOOK_URL from `.env.local` (get URL from Gendell)
- [ ] Test: submit the form → ask Gendell to confirm the lead appeared in Airtable
- [ ] Push:
  ```bash
  git add .
  git commit -m "feat: add lead capture form"
  git push
  ```

---

## ▶ PHASE 4 — Email + PDF _(June 27–28)_

> Goal: full flow works end to end — form → AI → quote → PDF → email.
> When done: both move to Phase 5.

### Gendell
- [ ] Confirm email node in n8n is connected to Inde's Resend key and sending correctly
- [ ] Test the full flow: submit form → verify email is received with PDF attached
- [ ] Fix any issues with field mapping or email content

### Inde
- [ ] Write the quote email template (HTML, French, professional): quote amount HT/TVA/TTC, trip details, CTA to confirm or call, NeoTravel contact info
- [ ] Write the PDF quote template: NeoTravel header, client details, trip details, full price breakdown, validity date, signature area
- [ ] Share your Resend API key with Gendell (he needs it for the n8n email node)
- [ ] Test: submit form → confirm you receive the email with the PDF → check content looks correct

---

## ▶ PHASE 5 — Testing + Demo Prep _(June 28–29)_

> Goal: all 5 demo scenarios run without issues. L2 + L3 submitted June 29 at 23:59.
> When done: Gendell done. Inde moves to slides. Yahia continues slides.

### Gendell
- [ ] Run all 5 demo scenarios (see table below)
- [ ] Set follow-up timer to 2 minutes for the demo
- [ ] Install ngrok: `npm install -g ngrok` → `ngrok http 5678` → copy the public URL → share with Inde
- [ ] Confirm Airtable Interface dashboard shows the pipeline correctly

### Inde
- [ ] Write L3 technical procedure: how to install and run the system from scratch (clone, env setup, n8n start, next.js start)
- [ ] Write L3 team procedure: how a salesperson uses the Airtable dashboard day-to-day (non-technical, step by step)
- [ ] Submit L3 with L2 before **June 29 at 23:59**

### Yahia _(parallel to Gendell + Inde)_
- [ ] Test the form as a real client: submit 3 requests (standard, urgent, >85 passengers)
- [ ] Write feedback: what worked, what felt wrong, any errors — share with Gendell/Inde
- [ ] Continue building slides (see Phase 6)

---

## ▶ PHASE 6 — Slides + Oral Prep _(June 29–30, due June 30 at 23:59)_

> Goal: slides submitted, speaking sections assigned, demo rehearsed twice.

### Yahia — Build the Slide Deck
- [ ] Slide 1: Title — NeoTravel | team names | date | MBA1 Epitech
- [ ] Slides 2–3: The problem — 60 leads/day, manual process, missed revenue
- [ ] Slides 4–5: The solution — architecture + the 10 functions (diagram in `CLAUDE.md`)
- [ ] Slide 6: Demo flow — what happens when a client submits the form (can use screenshots)
- [ ] Slide 7: Business impact — leads treated, time saved, follow-up rate
- [ ] Slide 8: Technical choices and why
- [ ] Slide 9: What we'd build next (roadmap)
- [ ] Slide 10: Q&A
- [ ] Submit before **June 30 at 23:59**

### Inde
- [ ] Support Yahia on slides if needed

### All 3
- [ ] Assign speaking sections — everyone must speak on July 1 to receive individual grades
- [ ] Rehearse the live demo together at least twice
- [ ] Prepare answers to jury questions (see table below)

---

## Demo Scenarios — Run Before July 1

| # | Scenario | What to verify |
|---|---|---|
| 1 | **Happy path** — complete data submitted | Lead in Airtable, quote generated, email received with PDF |
| 2 | **Incomplete data** — missing a required field | AI detects the gap, requests the missing info, completes on retry |
| 3 | **>85 passengers** — enter 100 passengers | Routes to "Cas Complexe", no auto-quote, human alert sent |
| 4 | **Follow-up** — submit a lead, wait 2 minutes | Follow-up email arrives automatically |
| 5 | **Dashboard** — open Airtable Interface | Pipeline shows leads by status, new this week, follow-ups pending |

---

## Jury Q&A — Prepare These

| Question | Who answers |
|---|---|
| What business problem does this solve and how do you measure success? | Yahia |
| Why did you choose n8n over other tools? | Gendell |
| How does the system preserve the human relationship? | Inde |
| What would NeoTravel need to do to put this in production? | All 3 |
| Walk me through what happens when a lead submits the form | Gendell |

---

## Git — How to Stay in Sync

Before starting work, always pull first:
```bash
git pull
```
After finishing, push your changes:
```bash
git add .
git commit -m "short description of what you did"
git push
```
