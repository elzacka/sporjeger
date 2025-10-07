# Claude API Optimization Guide

This document outlines optimization strategies for the Bellingcat sync translation feature using Claude API (as of October 2025).

## Current Implementation

The sync script uses **real-time API calls** with batch processing (20 descriptions per call).

### Current Performance
- **Model**: Claude Haiku 3.5 (default)
- **Batch Size**: 20 descriptions per API call
- **Cost**: ~$0.01 per weekly sync (~1000 tools)
- **Processing**: Immediate (within seconds)

## Future Optimization: Batch API

Anthropic's Batch API offers **50% cost savings** for asynchronous processing.

### Batch API Benefits

| Feature | Current (Real-time) | With Batch API |
|---------|---------------------|----------------|
| Cost | $1/$5 per MTok | $0.50/$2.50 per MTok (50% off) |
| Processing Time | Immediate | Within 24 hours |
| Suitable for | Interactive use | Weekly automation |
| Complexity | Simple | Moderate |

### Implementation Considerations

**Pros:**
- ✅ 50% cost reduction
- ✅ Perfect for weekly sync (non-urgent)
- ✅ Can process up to 10,000 requests per batch

**Cons:**
- ⚠️ Requires tracking batch jobs
- ⚠️ Results available within 24 hours (not instant)
- ⚠️ More complex error handling

### When to Implement Batch API

Consider implementing when:
- Translation volume exceeds 5,000 tools regularly
- Monthly API costs exceed $5
- 24-hour processing delay is acceptable

## Model Selection Guide

### Haiku 3.5 (Default)
```javascript
CLAUDE_MODEL: 'claude-3-5-haiku-20241022'
```

**Best for:**
- ✅ Cost optimization
- ✅ Standard translation quality
- ✅ Fast processing
- ✅ Most use cases

**Pricing:** $1/$5 per MTok (real-time), $0.50/$2.50 (batch)

### Sonnet 4.5 (Premium)
```javascript
CLAUDE_MODEL: 'claude-sonnet-4-5-20250929'
```

**Best for:**
- ✅ Maximum translation quality
- ✅ Complex/nuanced descriptions
- ✅ Technical terminology precision
- ✅ When quality > cost

**Pricing:** $3/$15 per MTok (real-time), $1.50/$7.50 (batch)

### Opus 4.1 (Not Recommended)
```javascript
CLAUDE_MODEL: 'claude-opus-4-1-20250805'
```

**Note:** Opus is overkill for translation tasks and 15x more expensive than Haiku with minimal quality improvement for this use case.

**Pricing:** $15/$75 per MTok (real-time), $7.50/$37.50 (batch)

## Cost Estimation

Based on Bellingcat's ~1000 tools with ~50 characters per description:

### Per Sync Cost

| Model | Real-time | Batch API |
|-------|-----------|-----------|
| Haiku 3.5 | $0.01 | $0.005 |
| Sonnet 4.5 | $0.05 | $0.025 |
| Opus 4.1 | $0.25 | $0.125 |

### Monthly Cost (4 syncs)

| Model | Real-time | Batch API |
|-------|-----------|-----------|
| Haiku 3.5 | $0.04 | $0.02 |
| Sonnet 4.5 | $0.20 | $0.10 |
| Opus 4.1 | $1.00 | $0.50 |

### Annual Cost (52 syncs)

| Model | Real-time | Batch API |
|-------|-----------|-----------|
| Haiku 3.5 | $0.52 | $0.26 |
| Sonnet 4.5 | $2.60 | $1.30 |
| Opus 4.1 | $13.00 | $6.50 |

## Additional Optimization Strategies

### 1. Prompt Caching (Future)
Anthropic offers prompt caching that can save 90% on repeated prompts. For translation, this offers minimal benefit since each description is unique.

### 2. Smart Filtering
Only translate new/updated tool descriptions:

```javascript
// Check if description changed before translating
if (existingData[3] !== tool.Description) {
  // Translate only changed descriptions
}
```

### 3. Rate Limit Optimization
Current implementation:
- 500ms delay between batches
- Can be reduced if needed (current limit: 4000 RPM for Haiku)

### 4. Compression
Combine multiple short descriptions in single prompts to reduce overhead.

## Monitoring

### Track API Usage
```bash
# View usage in Anthropic Console
https://console.anthropic.com/settings/usage
```

### Cost Alerts
Set up budget alerts in Anthropic Console to prevent unexpected charges.

## Recommendations

### For Current Scale (<2000 tools)
✅ **Use Haiku 3.5 with real-time API**
- Annual cost: ~$0.50
- Simple implementation
- Immediate results

### For Large Scale (5000+ tools)
✅ **Implement Batch API with Haiku 3.5**
- Annual savings: ~$1.30
- 24-hour delay acceptable
- Worth the implementation effort

### For Premium Quality Needs
✅ **Use Sonnet 4.5 with real-time API**
- Annual cost: ~$2.60
- Best translation quality
- Still very affordable

## Migration Path to Batch API

If you decide to implement Batch API in the future:

1. **Install Batch API SDK** (already included in `@anthropic-ai/sdk`)
2. **Create batch job** instead of direct messages
3. **Poll for completion** (or use webhooks)
4. **Process results** and update Google Sheet

Example structure:
```javascript
// Submit batch
const batch = await anthropic.batches.create({
  requests: translationRequests
});

// Poll until complete (within 24 hours)
while (batch.processing_status !== 'ended') {
  await sleep(60000); // Check every minute
  batch = await anthropic.batches.retrieve(batch.id);
}

// Process results
const results = await anthropic.batches.results(batch.id);
```

## Summary

**Current Recommendation:** Stick with Haiku 3.5 real-time API
- Excellent quality-to-cost ratio
- Simple implementation
- Minimal annual cost (~$0.50)
- Immediate results

Batch API can wait until scale justifies the implementation complexity.
