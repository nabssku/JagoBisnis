const { execSync } = require('child_process');

try {
  // Check if prisma is available in node paths
  require.resolve('prisma/package.json');
  console.log('Prisma CLI detected. Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.log('Prisma CLI is not installed in this workspace context. Skipping Prisma Client generation.');
  process.exit(0);
}
