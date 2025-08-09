import { FreestyleSandboxes } from 'freestyle-sandboxes';

export const freestyle = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

// Function to execute serverless code for etymology/sentiment analysis
// Note: The execute method is not available in the current Freestyle SDK version
// This function is preserved for future implementation when the API is available
/*
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
*/

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