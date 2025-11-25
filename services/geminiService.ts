import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TravelItinerary, TravelPreferences } from "../types";

export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// NOTE: If you wish to use your n8n backend, replace the body of this function
// with a fetch call to your n8n webhook URL.
// Example:
// const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
//   method: 'POST',
//   body: JSON.stringify(preferences)
// });
// return response.json();

export const generateTravelPlan = async (prefs: TravelPreferences): Promise<TravelItinerary> => {
  const prompt = `
    Act as an expert Moroccan travel guide. Create a detailed ${prefs.duration}-day travel itinerary for ${prefs.travelers} people.
    
    Preferences:
    - Cities/Regions: ${prefs.destination.join(", ") || "Best of Morocco"}
    - Style: ${prefs.budget}
    - Interests: ${prefs.interests.join(", ")}
    - Special Requests: ${prefs.specialRequests || "None"}

    Provide a day-by-day breakdown including specific places, activities, and culinary suggestions.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tripTitle: { type: Type.STRING },
          summary: { type: Type.STRING },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.NUMBER },
                title: { type: Type.STRING },
                theme: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      description: { type: Type.STRING },
                      location: { type: Type.STRING },
                    }
                  }
                },
                accommodation: { type: Type.STRING },
                meals: {
                  type: Type.OBJECT,
                  properties: {
                    lunch: { type: Type.STRING },
                    dinner: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate itinerary");
  }

  return JSON.parse(response.text) as TravelItinerary;
};

// Simple chat function for the Assistant page
// We maintain a single session instance implicitly by just sending history if we needed to,
// but for simplicity in this stateless service, we'll start a new chat or just use generateContent for single turns
// For a better experience, we use a chat session.
let chatSession: any = null;

export const chatWithAssistant = async (message: string): Promise<string> => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are a knowledgeable and friendly Moroccan travel guide named Atlas. You help tourists with information about Morocco's culture, history, food, and logistics. Keep answers concise and helpful."
      }
    });
  }

  const result = await chatSession.sendMessage({ message });
  return result.text || "I apologize, I didn't catch that.";
};

// TTS Helper functions
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateSpokenSummary = async (text: string): Promise<AudioBuffer> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Here is your travel summary: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Fenrir' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  
  if (!base64Audio) {
    throw new Error("No audio data returned");
  }

  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
  const audioBuffer = await decodeAudioData(
    decode(base64Audio),
    outputAudioContext,
    24000,
    1,
  );
  
  return audioBuffer;
};