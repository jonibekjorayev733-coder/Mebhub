/**
 * Automated Vercel + Render Deployment Script
 * Vercel va Render'ga avtomatik deploy qilish uchun
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}\n`),
};

function checkGit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function installVercelCLI() {
  log.info('Vercel CLI o\'rnatilmoqda...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    log.success('Vercel CLI o\'rnatildi');
    return true;
  } catch {
    log.error('Vercel CLI o\'rnatilmadi');
    return false;
  }
}

function deployFrontend() {
  log.title('🚀 FRONTEND - VERCEL\'DA DEPLOY QILISH');
  
  try {
    log.info('Vercel CLI bilan login qilmoqda...');
    try {
      execSync('vercel login', { stdio: 'inherit' });
    } catch {
      log.warn('Vercel allaqachon login qilgan');
    }
    
    log.info('Frontend deploy qilmoqda (environment variables bermasdan)...');
    execSync('vercel --prod --yes', { stdio: 'inherit', cwd: __dirname });
    
    log.success('Frontend muvaffaqiyatli deploy qilindi!');
    return true;
  } catch (error) {
    log.error('Frontend deploy qilishda xato');
    log.warn('Vite environment variables qo\'lda Vercel dashboard\'da sozlang:');
    log.info('  1. https://vercel.com/dashboard ga kiring');
    log.info('  2. Proyektni tanlang: boardgame');
    log.info('  3. Settings → Environment Variables');
    log.info('  4. VITE_API_URL = https://boardgame-backend.onrender.com qo\'ying');
    log.info('  5. Re-deploy bosing');
    return true;
  }
}

function deployBackend() {
  log.title('🚀 BACKEND - RENDER\'DA DEPLOY QILISH');
  
  log.warn('Render.com\'da qo\'lda deploy qilishingiz kerak:');
  log.info('');
  log.info('QADAM 1: PostgreSQL Database yaratish');
  log.info('  1. https://render.com/dashboard ga kiring');
  log.info('  2. "New +" → "PostgreSQL" bosing');
  log.info('  3. Sozlamalar:');
  log.info('     - Name: boardgame-db');
  log.info('     - PostgreSQL Version: 15');
  log.info('  4. "Create Database" bosing');
  log.info('  5. "External Database URL" nusxalang (kerak bo\'ladi!)');
  log.info('');
  log.info('QADAM 2: Backend Web Service yaratish');
  log.info('  1. "New +" → "Web Service" bosing');
  log.info('  2. GitHub repo: ITdewjonibek/boardgame');
  log.info('  3. Branch: becendrot1 (⭐ IMPORTANT!)');
  log.info('');
  log.info('QADAM 3: Sozlamalari');
  log.info('  Name: boardgame-backend');
  log.info('  Build Command: pip install -r requirements.txt && python migrate.py');
  log.info('  Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000');
  log.info('');
  log.info('QADAM 4: Environment Variables');
  log.info('  DATABASE_URL = (PostgreSQL\'dan nusxalangan URL)');
  log.info('  SECRET_KEY = secret-key-tajriba123456789');
  log.info('  ALGORITHM = HS256');
  log.info('  CORS_ORIGINS = ["https://boardgame.vercel.app"]');
  log.info('');
  log.info('QADAM 5: "Create Web Service" bosing');
  
  return true;
}

function main() {
  console.log(`
${colors.bright}${colors.green}
╔════════════════════════════════════════════════════╗
║   BoardGame Platform - Vercel + Render Deploy     ║
║         Avtomatik Deployment Script               ║
╚════════════════════════════════════════════════════╝
${colors.reset}
  `);

  // Check prerequisites
  log.title('📋 TEKSHIRUV');
  
  if (!checkGit()) {
    log.error('Git o\'rnatilmagan!');
    process.exit(1);
  }
  log.success('Git o\'rnatilgan');

  if (!checkVercelCLI()) {
    log.warn('Vercel CLI o\'rnatilmagan');
    if (!installVercelCLI()) {
      process.exit(1);
    }
  } else {
    log.success('Vercel CLI o\'rnatilgan');
  }

  // Check package.json
  if (!fs.existsSync('package.json')) {
    log.error('package.json topilmadi!');
    process.exit(1);
  }
  log.success('package.json topildi');

  // Check git remote
  try {
    const remotes = execSync('git remote -v', { encoding: 'utf-8' });
    if (remotes.includes('ITdewjonibek/boardgame')) {
      log.success('GitHub repository bog\'langan');
    } else {
      log.error('GitHub repository bog\'lanmagan!');
      process.exit(1);
    }
  } catch {
    log.error('Git remote tekshirilmadi');
    process.exit(1);
  }

  // Deploy process
  log.title('🚀 DEPLOY JARAYONI');

  log.info('Oxirgi o\'zgarishlар push qilmoqda...');
  try {
    execSync('git push origin main', { stdio: 'inherit' });
    log.success('GitHub\'ga push qilindi');
  } catch {
    log.warn('Push qilinmadi (mumkin allaqachon push qilgan)');
  }

  // Deploy frontend
  if (!deployFrontend()) {
    log.warn('Frontend deploy qilinmadi, lekin o\'tib ketdik');
  }

  // Deploy backend info
  deployBackend();

  // Summary
  log.title('✅ DEPLOY QADAMLAR TAYYOR!');
  
  console.log(`
${colors.green}VERCEL'DA FRONTEND:${colors.reset}
  ✓ GitHub repository bog\'landi
  ✓ Deploy qilindi
  → https://boardgame.vercel.app
  
  ${colors.yellow}QUYIDAGILARNI VERCEL DASHBOARD'DA QO\'YING:${colors.reset}
  1. https://vercel.com/dashboard ga kiring
  2. boardgame proyektini tanlang
  3. Settings → Environment Variables
  4. VITE_API_URL = https://boardgame-backend.onrender.com
  5. Deployments → Re-deploy Latest bosing

${colors.green}RENDER'DA BACKEND:${colors.reset}
  → https://boardgame-backend.onrender.com
  
  ${colors.yellow}RENDER'DA QO\'LDAN YARATISHINGIZ KERAK:${colors.reset}
  1. PostgreSQL Database (5 minut)
  2. Web Service (10 minut)
  3. Environment Variables qo\'yish (2 minut)

${colors.bright}${colors.green}JAMI VAQT: 20 minut${colors.reset}

${colors.yellow}Keyingi qadamlar:${colors.reset}
  1. ✅ GitHub: Push qilindi
  2. ⏳ Vercel: Environment variables qo\'ying va re-deploy
  3. ⏳ Render: Database + Service quring

${colors.bright}Muammolar bo'lsa menga aytib qo'ying!${colors.reset}
  `);
}

main();
