import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with environment variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the Gemini Pro model
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Base system prompts for each agent
const AGENT_PROMPTS = {
  architect: `You are ARCHITECT, the lead developer AI agent for PRALOR Corp.
Your role: Full-stack development, code review, system architecture.
Personality: Precise, technical, solution-oriented.
You provide clean, production-ready code with best practices.
Always explain your technical decisions briefly.
Format code properly with syntax highlighting hints.`,

  oracle: `You are ORACLE, the market analyst AI agent for PRALOR Corp.
Your role: Market research, crypto trend analysis, data synthesis, business viability assessment.
Personality: Analytical, data-driven, insightful.
You analyze trends, predict market movements, and provide actionable intelligence.
Always back claims with reasoning and confidence levels.`,

  sentry: `You are SENTRY, the security and QA AI agent for PRALOR Corp.
Your role: QA testing, security audits, code review for vulnerabilities, performance optimization.
Personality: Vigilant, thorough, protective.
You identify bugs, security issues, and optimization opportunities.
Always categorize issues by severity: CRITICAL, HIGH, MEDIUM, LOW.`
};

// Generic chat function
export const chat = async (prompt, agentType = null) => {
  try {
    let fullPrompt = prompt;

    if (agentType && AGENT_PROMPTS[agentType]) {
      fullPrompt = `${AGENT_PROMPTS[agentType]}\n\n---\n\nUser Request:\n${prompt}`;
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return { text: response.text(), error: null };
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return { text: null, error: error.message };
  }
};

// ARCHITECT Agent - Code generation and technical solutions
export const architect = {
  async generateCode(description, language = 'javascript') {
    const prompt = `Generate production-ready ${language} code for the following requirement:

${description}

Provide:
1. Clean, well-commented code
2. Brief explanation of the approach
3. Any dependencies needed`;

    return chat(prompt, 'architect');
  },

  async reviewCode(code) {
    const prompt = `Review this code for:
1. Best practices
2. Potential bugs
3. Performance issues
4. Security concerns

Code to review:
\`\`\`
${code}
\`\`\`

Provide specific suggestions with code fixes.`;

    return chat(prompt, 'architect');
  },

  async explainCode(code) {
    const prompt = `Explain this code in detail:
\`\`\`
${code}
\`\`\`

Break down:
1. What it does
2. How it works
3. Key concepts used`;

    return chat(prompt, 'architect');
  }
};

// ORACLE Agent - Market analysis and business intelligence
export const oracle = {
  async analyzeBusiness(idea) {
    const prompt = `Analyze this business idea thoroughly:

"${idea}"

Provide a comprehensive analysis:
1. **Market Viability** (1-10 score with reasoning)
2. **Target Audience** (demographics, psychographics)
3. **Competitive Landscape** (existing solutions, gaps)
4. **Revenue Model Options** (at least 3 models)
5. **Go-to-Market Strategy** (first 90 days)
6. **Risk Assessment** (top 3 risks and mitigations)
7. **Success Metrics** (KPIs to track)

Be specific and actionable.`;

    return chat(prompt, 'oracle');
  },

  async generateBusinessPlan(idea, industry = 'technology') {
    const prompt = `Create a complete business plan for:

Idea: "${idea}"
Industry: ${industry}

Generate:
1. **Executive Summary**
2. **Business Name Suggestions** (3 creative options)
3. **Tagline Options** (3 catchy taglines)
4. **Problem Statement**
5. **Solution Overview**
6. **Target Market Analysis**
7. **Business Model & Revenue Streams**
8. **Marketing Strategy**
9. **Financial Projections** (Year 1 estimates)
10. **Launch Roadmap** (Phases with milestones)

Make it investor-ready.`;

    return chat(prompt, 'oracle');
  },

  async analyzeCrypto(symbol, context = '') {
    const prompt = `Analyze the cryptocurrency ${symbol}:

${context ? `Additional context: ${context}` : ''}

Provide:
1. **Current Sentiment** (Bullish/Bearish/Neutral with reasoning)
2. **Key Factors** affecting price
3. **Technical Signals** (simplified)
4. **News Impact Assessment**
5. **Risk Level** (1-10)
6. **Short-term Outlook** (1-7 days)
7. **Confidence Level** (percentage)

Note: This is for educational purposes only, not financial advice.`;

    return chat(prompt, 'oracle');
  }
};

// SENTRY Agent - Security and quality assurance
export const sentry = {
  async securityAudit(code) {
    const prompt = `Perform a security audit on this code:
\`\`\`
${code}
\`\`\`

Check for:
1. **OWASP Top 10 vulnerabilities**
2. **Input validation issues**
3. **Authentication/Authorization flaws**
4. **Data exposure risks**
5. **Injection vulnerabilities**

Format each finding as:
- [SEVERITY] Issue description
- Location in code
- Recommended fix`;

    return chat(prompt, 'sentry');
  },

  async qaTest(feature, requirements) {
    const prompt = `Generate QA test cases for:

Feature: ${feature}
Requirements: ${requirements}

Provide:
1. **Test Scenarios** (at least 5)
2. **Edge Cases** (at least 3)
3. **Expected Results**
4. **Automated Test Suggestions** (Jest/Cypress format)`;

    return chat(prompt, 'sentry');
  },

  async optimizePerformance(code) {
    const prompt = `Analyze this code for performance optimization:
\`\`\`
${code}
\`\`\`

Identify:
1. **Performance Bottlenecks**
2. **Memory Leaks**
3. **Optimization Opportunities**
4. **Refactored Code** (optimized version)`;

    return chat(prompt, 'sentry');
  }
};

// Construct - Business generation with AI
export const construct = {
  async generate(idea, options = {}) {
    const { industry = 'technology', targetAudience = 'general' } = options;

    const prompt = `You are generating a complete business package for PRALOR's Construct tool.

IDEA: "${idea}"
INDUSTRY: ${industry}
TARGET AUDIENCE: ${targetAudience}

Generate a JSON response with this exact structure:
{
  "name": "Creative business name",
  "tagline": "Catchy slogan",
  "description": "2-3 sentence description",
  "targetAudience": ["audience segment 1", "audience segment 2", "audience segment 3", "audience segment 4"],
  "revenueModel": [
    {"model": "Model Name", "description": "Brief description"},
    {"model": "Model Name", "description": "Brief description"},
    {"model": "Model Name", "description": "Brief description"}
  ],
  "marketSize": "$X.XB by 20XX",
  "uniqueValue": "What makes this different",
  "launchStrategy": [
    "Phase 1: Description",
    "Phase 2: Description",
    "Phase 3: Description",
    "Phase 4: Description"
  ],
  "competitors": ["Competitor 1", "Competitor 2", "Competitor 3"],
  "riskLevel": 1-10,
  "viabilityScore": 1-100
}

Return ONLY valid JSON, no other text.`;

    const result = await chat(prompt, 'oracle');

    if (result.error) return result;

    try {
      // Extract JSON from response
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return { data: parsed, error: null };
      }
      return { data: null, error: 'Failed to parse response' };
    } catch (e) {
      return { data: null, error: 'Invalid JSON response' };
    }
  }
};

// Command - Prompt enhancement
export const command = {
  async enhancePrompt(blocks) {
    const blockText = blocks.map(b => `[${b.type.toUpperCase()}]: ${b.content}`).join('\n\n');

    const prompt = `You are a prompt engineering expert. Enhance this prompt configuration:

${blockText}

Provide:
1. **Enhanced Version** - Improved, more effective prompt
2. **Suggestions** - 3 ways to make it better
3. **Rating** - Score the original prompt 1-10 with reasoning`;

    return chat(prompt, 'architect');
  },

  async suggestBlocks(partialPrompt) {
    const prompt = `Based on this partial prompt, suggest additional blocks:

Current prompt: "${partialPrompt}"

Suggest what's missing:
1. Should add PERSONA block? (if yes, provide content)
2. Should add CONTEXT block? (if yes, provide content)
3. Should add CONSTRAINTS? (if yes, provide content)
4. Should add EXAMPLES? (if yes, provide content)

Be specific and actionable.`;

    return chat(prompt, 'architect');
  }
};

export default {
  chat,
  architect,
  oracle,
  sentry,
  construct,
  command
};
