import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const clientName = process.argv[2];

if (!clientName) {
  console.error('\x1b[31mError: Please specify a client name (e.g. "fashionking" or "seemasarees")\x1b[0m');
  console.log('Usage: npm run setup <client-name>');
  process.exit(1);
}

const sourceFile = path.join(rootDir, `.env.${clientName}`);
const targetFile = path.join(rootDir, '.env');

if (!fs.existsSync(sourceFile)) {
  console.error(`\x1b[31mError: Environment file not found: ${sourceFile}\x1b[0m`);
  process.exit(1);
}

try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log(`\x1b[32mSuccessfully configured environment for: \x1b[1m${clientName.toUpperCase()}\x1b[22m\x1b[0m`);
  console.log(`Copied ${path.basename(sourceFile)} -> .env`);
} catch (err) {
  console.error('\x1b[31mFailed to copy environment file:\x1b[0m', err);
  process.exit(1);
}
