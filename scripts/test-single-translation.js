/**
 * Test translation on a single tool to verify it works
 */

import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

async function testTranslation() {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const testCases = [
    { name: "Amazon Rekognition", desc: "Tool for measuring facial similarity." },
    { name: "GhostArchive", desc: "WebMemory" },
    { name: "JSTOR", desc: "Akademisk digitalt bibliotek – Bøker og artikler på hyllene – perfekt for de som liker fotnoter." }
  ];

  for (const test of testCases) {
    console.log(`\n📝 Testing: ${test.name}`);
    console.log(`   Input: "${test.desc}"`);

    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Translate this OSINT tool description to Norwegian (bokmål) with Bjarte Arneson's warm, conversational style. Use metaphors and personality. Return ONLY the translated description, nothing else.

Tool name: ${test.name}
English description: ${test.desc}

Norwegian description with BA-style:`
        }]
      });

      const result = message.content[0].text.trim();
      console.log(`   Output: "${result}"`);

      // Validation
      if (result.includes('Tool name:') || result.includes('description:') || result.includes('Norwegian')) {
        console.log(`   ❌ FAILED: Contains meta-text/instructions`);
      } else if (result.length < 30) {
        console.log(`   ⚠️  WARNING: Too short`);
      } else {
        console.log(`   ✅ LOOKS GOOD`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }
}

testTranslation();
