# Translation Agent Configuration Guide

## Understanding Modern AI "Learning" (October 2025)

### What "Machine Learning" Actually Means Here

**Traditional Machine Learning** (outdated for this use case):
- Train a custom model on your data
- Requires thousands of examples
- Expensive ($1000s-$10,000s)
- Slow (weeks to months)
- Becomes outdated quickly

**Modern Approach** (what we'll use):
- **Prompt Engineering**: Give Claude your style guides in the prompt
- **Prompt Caching**: Store those guides in cache for 90% cost reduction
- **Context Windows**: Claude can "read" up to 200K tokens (~150,000 words)
- **No training needed**: Works immediately

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│  Your Documents (Cached - 90% cheaper)                  │
│  ├─ Klarspråk guidelines from Språkrådet                │
│  ├─ eBook tone of voice examples                        │
│  └─ OSINT terminology glossary                          │
├─────────────────────────────────────────────────────────┤
│  Translation Instructions (Cached)                      │
│  "Use klarspråk principles, match the tone from the     │
│   eBook examples, preserve OSINT terms..."              │
├─────────────────────────────────────────────────────────┤
│  Input Text (Not cached - changes every time)           │
│  "A tool for analyzing social media profiles..."        │
└─────────────────────────────────────────────────────────┘
                        ↓
                  Claude Reads All
                        ↓
              Translation Output
```

**Key Insight**: Claude "reads" your documents **every time** but caching makes it cost almost nothing!

## Your Documents Strategy

### 1. Klarspråk Guidelines (Språkrådet)

**Purpose**: Ensure translations follow Norwegian clear language principles
**Size**: Typically 5,000-20,000 tokens
**Caching Strategy**: Cache entire document

**Example Structure**:
```javascript
const klarsprakGuidelines = {
  type: 'text',
  text: `# Klarspråk Guidelines from Språkrådet

[Full content of the guidelines document]

Key principles:
- Use short sentences
- Avoid passive voice
- Choose common words over rare ones
...`,
  cache_control: { type: 'ephemeral' }
};
```

### 2. eBook Tone of Voice Reference

**Purpose**: Match writing style and tone
**Size**: Could be large (50,000+ tokens for full book)

**Two Approaches**:

**A. Excerpts (Recommended for cost)**
- Select 10-20 representative paragraphs
- Include variety of topics/styles
- ~5,000-10,000 tokens
- Cache the entire selection

```javascript
const toneExamples = {
  type: 'text',
  text: `# Norwegian Tone of Voice Reference

These examples demonstrate the desired writing style:

Example 1: [excerpt about technology]
"[Norwegian text from eBook...]"

Example 2: [excerpt about investigation]
"[Norwegian text from eBook...]"

...`,
  cache_control: { type: 'ephemeral' }
};
```

**B. Full eBook with RAG (If you want everything)**
- Store entire book in vector database
- Search for relevant passages based on content being translated
- Only send relevant excerpts to Claude
- More complex but uses full book

### 3. OSINT Terminology Glossary

**Purpose**: Consistent technical term translation
**Size**: ~2,000-5,000 tokens
**Caching Strategy**: Cache entire glossary

```javascript
const osintGlossary = {
  type: 'text',
  text: `# OSINT Translation Glossary

Technical Terms (Keep in English):
- OSINT → OSINT (not "åpen kildeetterretning")
- API → API
- metadata → metadata
- geolocation → geolocation

Norwegian Translations:
- investigation → etterforskning
- tool → verktøy
- search → søk
- analysis → analyse
...`,
  cache_control: { type: 'ephemeral' }
};
```

## Complete Implementation Example

```javascript
/**
 * Translation with your custom style guides
 * All documents cached for 90% cost reduction
 */
async function translateWithStyleGuides(texts) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,

    // All of these are cached (after first call)
    system: [
      klarsprakGuidelines,    // Cache 1: Språkrådet guidelines
      toneExamples,           // Cache 2: eBook tone reference
      osintGlossary,          // Cache 3: Technical terms
      {
        type: 'text',
        text: `You are an expert Norwegian translator specializing in OSINT tools.

CRITICAL INSTRUCTIONS:
1. Follow ALL Klarspråk principles from Språkrådet (above)
2. Match the tone and style from the eBook examples (above)
3. Use the OSINT glossary for technical terms (above)
4. Translate to Norwegian bokmål
5. Prioritize clarity and accessibility

Your translations should feel natural to Norwegian security researchers
while remaining technically accurate.`,
        cache_control: { type: 'ephemeral' }
      }
    ],

    // Only this part changes (not cached)
    messages: [{
      role: 'user',
      content: texts.map((t, i) => `${i + 1}. ${t}`).join('\n\n')
    }]
  });

  return response.content[0].text;
}
```

## Cost Analysis

### First Translation (Writing to Cache)
```
Klarspråk: 10,000 tokens × $1.50/MTok × 1.25 = $0.019
eBook: 8,000 tokens × $1.50/MTok × 1.25 = $0.015
Glossary: 3,000 tokens × $1.50/MTok × 1.25 = $0.006
Instructions: 500 tokens × $1.50/MTok × 1.25 = $0.001
Content: 10,000 tokens × $1.50/MTok = $0.015
Total: $0.056
```

### All Subsequent Translations (Reading from Cache)
```
Cached content: 21,500 tokens × $1.50/MTok × 0.10 = $0.003
Content: 10,000 tokens × $1.50/MTok = $0.015
Total: $0.018 (68% savings!)
```

**With weekly syncs**: After first run, you save **68-90% on every translation**!

## Document Size Recommendations

| Document | Ideal Size | Max Size | Strategy |
|----------|-----------|----------|----------|
| Klarspråk | Full text | 20,000 tokens | Cache all |
| eBook | 10-20 excerpts | 10,000 tokens | Cache excerpts |
| Glossary | Full list | 5,000 tokens | Cache all |

**If eBook is large**: I can help you select the most representative excerpts or implement RAG.

## Next Steps

1. **Share your documents** - I'll analyze and extract key sections
2. **I'll implement caching** - Optimize structure for cost/quality
3. **Test translation** - Verify it follows your style
4. **Iterate** - Refine based on results

## RAG Alternative (If Documents Are Very Large)

If your eBook is very large (100K+ tokens), we can use **RAG**:

```javascript
// Store eBook in vector database
await vectorStore.add(ebookChunks);

// At translation time, find relevant excerpts
const relevantExcerpts = await vectorStore.search(textToTranslate);

// Only send relevant parts to Claude
const toneExamples = {
  text: relevantExcerpts.join('\n\n'),
  cache_control: { type: 'ephemeral' }
};
```

This is more complex but uses your full eBook intelligently.

## Machine Learning Misconception

**You don't need to "train" anything!** Modern LLMs (like Claude) are:
- Already trained on trillions of words
- Can understand Norwegian perfectly
- Just need your specific preferences (via cached documents)

**Your role**: Curate the right reference materials (which you have!)
**Claude's role**: Apply those principles to each translation
**Caching's role**: Make it cost-effective to include all references

This is called **"few-shot learning"** or **"in-context learning"** - the modern replacement for custom model training.
