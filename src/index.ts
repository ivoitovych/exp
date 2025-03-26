import { LlavaService } from './llava';

// Main application entry point
async function main() {
  try {
    const llavaService = new LlavaService();
    const prompt = 'What is an apple?';
    
    console.log(`\nSending prompt: "${prompt}"\n`);
    console.log("Response:");
    
    // Output response with spaces between tokens for readability
    for await (const part of llavaService.requestCompletion(prompt)) {
      process.stdout.write(part + ' ');
    }
    
    process.stdout.write('\n\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();