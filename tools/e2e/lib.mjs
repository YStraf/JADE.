// Outils communs aux tests navigateur : Playwright (installation globale) + URL du serveur local.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const root = process.env.PW_ROOT || execSync('npm root -g').toString().trim();
export const { chromium } = createRequire(root + '/')('playwright');
export const BASE = process.env.JADE_BASE || 'http://127.0.0.1:8765/';
export const launch = () => chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
