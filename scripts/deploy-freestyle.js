const { FreestyleSandboxes } = require('freestyle-sandboxes');

async function deploy() {
  console.log('🚀 Deploying Muzety to Freestyle...');
  
  // Check if we have the API key
  const apiKey = process.env.FREESTYLE_API_KEY;
  if (!apiKey) {
    console.error('❌ FREESTYLE_API_KEY not found in environment variables');
    process.exit(1);
  }

  const freestyle = new FreestyleSandboxes({ apiKey });

  try {
    // Deploy from GitHub using the documented approach
    console.log('🌐 Deploying from GitHub to Freestyle Web...');
    
    const deployment = await freestyle.deployWeb(
      { 
        kind: 'git',
        url: 'https://github.com/ma08/muzety' // GitHub repo URL
      },
      { 
        domains: [`muzety-${Date.now()}.style.dev`],
        build: true // Automatically detect framework and build
      }
    );
    
    console.log('✅ Deployment successful!');
    if (deployment && deployment.domains) {
      console.log(`🔗 URL: https://${deployment.domains[0]}`);
    }
    if (deployment && deployment.id) {
      console.log(`📊 Deployment ID: ${deployment.id}`);
    }
    console.log('\n🎉 Your app is being deployed to Freestyle!');
    console.log('📌 Check https://admin.freestyle.sh for deployment status');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy();