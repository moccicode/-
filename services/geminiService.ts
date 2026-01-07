
import { GoogleGenAI, Type } from "@google/genai";
import { MealTime, Recipe } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
};

export const generateRecipes = async (mealTime: MealTime, ingredients: string): Promise<Recipe[]> => {
  const ai = getAIClient();
  const prompt = `식사 시간: ${mealTime}, 사용자가 가진 냉장고 재료: ${ingredients}. 
  이 조건에 맞는 맛있는 한국식 또는 퓨전 요리 레시피 3가지를 제안해주세요. 
  
  중요 지침:
  1. 사용자가 입력한 재료를 최대한 활용하세요.
  2. 'ingredients' 필드에는 사용자가 이미 가지고 있는 재료 중 요리에 쓰이는 것들을 넣으세요.
  3. 'missingIngredients' 필드에는 요리를 완성하기 위해 추가로 필요하지만 사용자의 입력에는 없었던 재료들을 상세히 나열하세요. (소금, 설탕, 식용유 같은 기본 양념 제외)
  4. 한국어로 답변하세요.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                ingredients: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                missingIngredients: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "사용자에게 없는 추가 필요 재료"
                },
                instructions: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                cookingTime: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ['쉬움', '보통', '어려움'] },
                calories: { type: Type.STRING },
                imagePrompt: { type: Type.STRING, description: "영어로 된 구체적인 요리 사진 묘사 프롬프트" }
              },
              required: ["title", "description", "ingredients", "missingIngredients", "instructions", "cookingTime", "difficulty", "calories", "imagePrompt"]
            }
          }
        },
        required: ["recipes"]
      }
    }
  });

  const data = JSON.parse(response.text);
  return data.recipes;
};

export const generateRecipeImage = async (imagePrompt: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Professional food photography of ${imagePrompt}, appetizing, high resolution, 4k, soft natural lighting, top-down view.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return "https://picsum.photos/400/400"; // Fallback
};
