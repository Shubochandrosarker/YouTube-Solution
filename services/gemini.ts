import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GeneratedImageResult {
  imageUrl: string | null;
  text: string | null;
}

export interface GeneratedTextResult {
  content: string;
  metadata?: any;
}

/**
 * Generates a YouTube thumbnail
 */
export const generateThumbnail = async (
  prompt: string,
  logoBase64?: string,
  logoMimeType?: string,
  aspectRatio: string = "16:9"
): Promise<GeneratedImageResult> => {
  try {
    const parts: any[] = [];

    if (logoBase64 && logoMimeType) {
      parts.push({
        inlineData: {
          data: logoBase64,
          mimeType: logoMimeType,
        },
      });
      parts.push({
        text: `${prompt} Please incorporate the visual style or elements of the provided logo into the design naturally.`,
      });
    } else {
      parts.push({
        text: prompt,
      });
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    let imageUrl: string | null = null;
    let textOutput: string | null = null;

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        } else if (part.text) {
          textOutput = part.text;
        }
      }
    }

    return { imageUrl, text: textOutput };
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw error;
  }
};

/**
 * Generates SEO text content (Titles, Tags, Audit, etc.)
 */
export const generateSEOContent = async (
  taskType: 'audit' | 'title' | 'optimize' | 'description' | 'hashtags' | 'tags',
  inputData: any
): Promise<string> => {
  let prompt = "";
  let tools: any[] = [];

  switch (taskType) {
    case 'audit':
      prompt = `Act as a YouTube SEO Expert. Analyze this channel link/info: ${inputData.url || inputData.text}. 
      Provide a comprehensive audit including an estimated SEO Score (0-100), Strengths, Weaknesses, and a list of specific Improvement Suggestions.
      If a URL is provided, use Google Search to find public details about the channel.`;
      tools = [{googleSearch: {}}];
      break;
    case 'title':
      prompt = `Generate 5 high-CTR, SEO-optimized YouTube video titles based on these focus keywords: "${inputData.keywords}". 
      Include estimated monthly search volume (Low/Medium/High) for the main keywords used. Format as a clean list.`;
      break;
    case 'optimize':
      prompt = `Optimize this existing video title: "${inputData.title}" using these focus keywords: "${inputData.keywords}". 
      Provide 3 improved variations that are punchy and click-worthy. Explain why they are better.`;
      break;
    case 'description':
      prompt = `Write a professional, SEO-optimized YouTube video description.
      Topic: ${inputData.topic}
      Keywords to include: ${inputData.keywords}
      Structure it with an engaging Hook, Body, and Call to Action. Include timestamps placeholders.`;
      break;
    case 'hashtags':
      prompt = `Generate 15 viral and related hashtags for a YouTube video about: "${inputData.topic}". 
      Sort them by relevance.`;
      break;
    case 'tags':
      prompt = `Generate 20 high search volume tags (comma-separated) for a YouTube video about: "${inputData.topic}". 
      Also provide a JSON formatted list of these tags with an AI-estimated global search volume for each (e.g., {"tag": "example", "volume": "High"}).`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: tools.length > 0 ? tools : undefined,
      }
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Error generating SEO content:", error);
    throw error;
  }
};