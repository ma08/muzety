import { FreestyleSandboxes } from 'freestyle-sandboxes';

export const freestyle = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

// Function to execute serverless code for etymology/sentiment analysis
export async function executeAnalysis(code: string): Promise<any> {
  try {
    const result = await freestyle.execute({
      code,
      packages: ['openai', '@xenova/transformers'],
    });
    return result;
  } catch (error) {
    console.error('Freestyle execution error:', error);
    throw error;
  }
}

// Function to deploy to Freestyle Web
export async function deployToFreestyle(gitUrl: string, domain?: string) {
  try {
    const deployment = await freestyle.deployWeb(
      { kind: 'git', url: gitUrl },
      { 
        domains: domain ? [domain] : [`etymology-viz-${Date.now()}.style.dev`],
        build: true
      }
    );
    return deployment;
  } catch (error) {
    console.error('Freestyle deployment error:', error);
    throw error;
  }
}