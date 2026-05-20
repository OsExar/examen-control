import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

async function AIConnection(text) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: text,
    });

    return response.text || getFallback(text);

  } catch (error) {
console.log("Gemini temporalmente no disponible, usando fallback local.");    return getFallback(text);
  }
}

function getFallback(text) {
  const lowerText = text.toLowerCase();

  // FALLBACK RECETAS
  if (
    lowerText.includes("receta") ||
    lowerText.includes("comida") ||
    lowerText.includes("calorías")
  ) {
    return `
- Pollo con arroz (20 min, 2, 4.5/5).
  Calorías: 450 kcal
  Proteínas: 35 g
  Carbohidratos: 40 g
  Grasas: 12 g

- Ensalada fitness (10 min, 1, 4.8/5).
  Calorías: 220 kcal
  Proteínas: 18 g
  Carbohidratos: 12 g
  Grasas: 9 g

- Pasta saludable (25 min, 3, 4.6/5).
  Calorías: 390 kcal
  Proteínas: 20 g
  Carbohidratos: 45 g
  Grasas: 11 g
`;
  }

  // FALLBACK EJERCICIOS
  if (
    lowerText.includes("ejercicio") ||
    lowerText.includes("rutina") ||
    lowerText.includes("workout")
  ) {
    return `
- Flexiones (15 min, intensidad media).
  Calorías quemadas: 120 kcal

- Sentadillas (20 min, intensidad alta).
  Calorías quemadas: 180 kcal

- Plancha abdominal (10 min, intensidad baja).
  Calorías quemadas: 80 kcal
`;
  }

  // FALLBACK GENERAL
  return `
- ia no disponible temporalmente.
`;
}

export default AIConnection;