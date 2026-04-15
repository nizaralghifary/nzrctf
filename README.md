<br />
<div align="center">
  <h3 align="center">NzrCTF</h3>

  <p align="center">
    The easiest way to try web exploit challenge
    <br />
    <br />
    <a href="https://ctf.nizar.my.id">Visit Site</a>
  </p>
  <p align="center">
    NzrCTF is a beginner-friendly CTF platform designed to help you learn web exploitation through real-world scenarios
  </p>
</div>

### Features
- Leaderboard system to track player progress
- Submission history for reviewing attempts
- Stage lock system to enforce learning flow
- Neobrutalist UI design
- Real vulnerable targets

> Some features may be limited as we continue improving scalability and infrastructure

### Installation

**Clone Repository**
```bash
git clone https://github.com/nizaralghifary/nzrctf.git
cd nzrctf
bun install
```

> Make sure `bun` is installed on your device, if your device doesn't installed it, run `curl -fsSL https://bun.com/install | bash` or `npm i -g bun`. See https://bun.com/docs/installation

**Setup `.env.local`**

Replace `.env.example` to `.env.local` and fill every variable below
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ALLOWED_ORIGINS=
NODE_ENV= 
```