const { FreestyleSandboxes } = require('freestyle-sandboxes');
const { execSync } = require('child_process');

async function deploy() {
  console.log('🚀 Deploying to Freestyle...');
  
  // Check if we have the API key
  const apiKey = process.env.FREESTYLE_API_KEY;
  if (!apiKey) {
    console.error('❌ FREESTYLE_API_KEY not found in environment variables');
    process.exit(1);
  }

  const freestyle = new FreestyleSandboxes({ apiKey });

  try {
    // First, build the Next.js app
    console.log('📦 Building Next.js application...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Initialize git if not already
    try {
      execSync('git status', { stdio: 'ignore' });
    } catch {
      console.log('📝 Initializing git repository...');
      execSync('git init', { stdio: 'inherit' });
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "Initial commit for etymology visualizer"', { stdio: 'inherit' });
    }

    // Deploy to Freestyle
    console.log('🌐 Deploying to Freestyle Web...');
    const deployment = await freestyle.deployWeb(
      { 
        kind: 'files',
        files: '.' // Deploy current directory
      },
      { 
        domains: [`etymology-viz-${Date.now()}.style.dev`],
        build: true,
        framework: 'nextjs'
      }
    );

    console.log('✅ Deployment successful!');
    console.log(`🔗 URL: https://${deployment.domains[0]}`);
    console.log(`📊 Deployment ID: ${deployment.id}`);
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy();