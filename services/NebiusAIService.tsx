// We don't need the openai import for our fetch implementation
// import { createRequest } from 'openai';

// Get API key from environment variables
const NEBIUS_API_KEY = process.env.EXPO_PUBLIC_NEBIUS_API_KEY || "";

/**
 * Analyzes an image using Nebius AI Vision model and returns a textual description
 * @param base64Image - Base64 encoded image data without prefix
 * @returns A promise that resolves to a description of the image
 */
export async function analyzeImage(base64Image: string): Promise<string> {
  try {
    // Format the API request body
    const requestBody = {
      model: "Qwen/Qwen2-VL-7B-Instruct",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "You are an AI assistant designed to help blind users understand their visual surroundings. Your responses must be clear, concise, and immediately useful.\n\nRESPONSE GUIDELINES:\n\n- Provide only the essential information needed to understand the image\n- Use spatial language (left, right, top, bottom) to orient the user\n- Mention colors, objects, text, and scene context when relevant\n- Never exceed 3 sentences unless reading text\n- Avoid unnecessary details or ambiguous descriptions\n- Don't mention yourself or that you're processing an image"
        },
        {
          role: "user",
          content: [
            { type: "text", text: "What's in this image?" },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }
      ]
    };

    // Make the API request
    const response = await fetch('https://api.studio.nebius.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEBIUS_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    // Parse the response
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Nebius API error:', data);
      throw new Error(data.error?.message || 'Failed to analyze image');
    }

    // Extract the assistant's response
    return data.choices[0]?.message?.content || "No description available.";
  } catch (error) {
    console.error("Nebius API error:", error);
    throw new Error("Failed to analyze image.");
  }
}
