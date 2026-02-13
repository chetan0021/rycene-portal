# ⚠️ CRITICAL: Windows Path Issue with Special Characters

## Problem Identified

The directory path `C:\Users\R&D Chetan V\Documents\rycene-portal` contains a **special character (`&`)** that causes Windows command parsing failures.

### Error Symptoms
```
'D' is not recognized as an internal or external command
Error: Cannot find module 'C:\Users\next\dist\bin\next'
```

Windows is incorrectly parsing the path, breaking at the `&` character.

---

## ✅ Solution Options

### **Option 1: Move Project to Path Without Special Characters (RECOMMENDED)**

This is the cleanest and most reliable solution.

#### Steps:

1. **Create a new directory without special characters:**
   ```powershell
   mkdir C:\Projects\rycene-portal
   ```

2. **Copy all files to the new location:**
   ```powershell
   Copy-Item -Path "C:\Users\R&D Chetan V\Documents\rycene-portal\*" -Destination "C:\Projects\rycene-portal" -Recurse -Force
   ```

3. **Navigate to the new directory:**
   ```powershell
   cd C:\Projects\rycene-portal
   ```

4. **Install dependencies:**
   ```powershell
   npm install --legacy-peer-deps
   ```

5. **Run the development server:**
   ```powershell
   npm run dev
   ```

6. **Open browser:**
   - Navigate to `http://localhost:3000`

---

### **Option 2: Use WSL2 (Windows Subsystem for Linux)**

If you have WSL2 installed, you can run the project in a Linux environment which doesn't have this issue.

#### Steps:

1. **Open WSL2 terminal** (Ubuntu, Debian, etc.)

2. **Navigate to the project:**
   ```bash
   cd "/mnt/c/Users/R&D Chetan V/Documents/rycene-portal"
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

---

### **Option 3: Use npx Commands Directly (Workaround)**

This is a temporary workaround but not ideal for development.

#### Steps:

1. **Stay in current directory:**
   ```powershell
   cd "C:\Users\R&D Chetan V\Documents\rycene-portal"
   ```

2. **Run Next.js using npx:**
   ```powershell
   npx next dev
   ```

This bypasses npm scripts but may have other limitations.

---

## 🎯 Recommended Action

**Move the project to `C:\Projects\rycene-portal`** (Option 1)

This is the most reliable solution and will prevent future issues with:
- npm scripts
- Build processes
- Deployment tools
- Git operations
- Any other tools that parse paths

---

## 📋 Quick Migration Script

Save this as `migrate-project.ps1` and run it:

```powershell
# Create new directory
$newPath = "C:\Projects\rycene-portal"
New-Item -ItemType Directory -Path $newPath -Force

# Copy all files
$oldPath = "C:\Users\R&D Chetan V\Documents\rycene-portal"
Copy-Item -Path "$oldPath\*" -Destination $newPath -Recurse -Force

# Navigate to new location
Set-Location $newPath

# Install dependencies
npm install --legacy-peer-deps

Write-Host "✅ Project migrated successfully!" -ForegroundColor Green
Write-Host "New location: $newPath" -ForegroundColor Cyan
Write-Host "Run 'npm run dev' to start the development server" -ForegroundColor Yellow
```

Run with:
```powershell
.\migrate-project.ps1
```

---

## 🔍 Why This Happens

Windows command prompt and PowerShell treat `&` as a special character (command separator). Even though the path is quoted in package.json scripts, the underlying Node.js process spawning mechanism has issues with certain special characters in paths.

**Problematic characters in Windows paths:**
- `&` (ampersand)
- `%` (percent)
- `!` (exclamation)
- `^` (caret)
- `(` `)` (parentheses)

---

## ✅ After Migration

Once you've moved the project, everything will work normally:

```powershell
cd C:\Projects\rycene-portal
npm run dev      # ✅ Works!
npm run build    # ✅ Works!
npm run start    # ✅ Works!
```

---

## 📝 Update Your .env.local

After migration, create `.env.local` in the new location:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

---

## 🚀 Next Steps After Migration

1. ✅ Verify the project runs: `npm run dev`
2. ✅ Configure Supabase (see README.md)
3. ✅ Test admin dashboard at `http://localhost:3000/admin`
4. ✅ Test adding a student
5. ✅ Test QR code generation
6. ✅ Test PDF upload

---

## 💡 Prevention for Future Projects

When creating projects on Windows, always use paths without special characters:

**Good paths:**
- `C:\Projects\my-app`
- `C:\Dev\rycene-portal`
- `D:\Code\nextjs-app`

**Avoid:**
- `C:\Users\R&D Chetan V\...`
- `C:\My Projects (2024)\...`
- `C:\Dev\app-v2.0!\...`
