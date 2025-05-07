
interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
}

interface RecipeResponse {
  recipe: Recipe;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

interface ImageResponse {
  imageUrl: string;
}

// Description: Get recipe suggestions based on ingredients
// Endpoint: POST /api/get-recipe
// Request: { ingredients: string[] }
// Response: { recipe: { title: string, ingredients: string[], instructions: string[], prepTime: string, cookTime: string, servings: number } }
export const getRecipeSuggestions = (ingredients: string[]): Promise<RecipeResponse> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const servings = Math.floor(Math.random() * 4) + 2;
      const recipe = {
        title: `${ingredients[0].charAt(0).toUpperCase() + ingredients[0].slice(1)} Special with ${ingredients.slice(1).join(' and ')}`,
        ingredients: [
          ...ingredients.map(i => `Fresh ${i}`),
          'Salt to taste',
          'Black pepper',
          'Olive oil',
          'Garlic cloves',
          'Herbs of choice'
        ],
        instructions: [
          'Gather and prepare all ingredients.',
          `Clean and chop ${ingredients.join(', ')}.`,
          'Heat olive oil in a large pan over medium heat.',
          'Add minced garlic and sauté until fragrant.',
          `Add ${ingredients[0]} and cook for 5 minutes.`,
          `Incorporate ${ingredients.slice(1).join(' and ')}.`,
          'Season with salt and pepper.',
          'Cook until desired tenderness is achieved.',
          'Garnish with fresh herbs and serve hot.'
        ],
        prepTime: `${Math.floor(Math.random() * 15) + 10} minutes`,
        cookTime: `${Math.floor(Math.random() * 20) + 15} minutes`,
        servings
      };

      resolve({ recipe });
    }, 1000);
  });
};

// Description: Get nutritional information
// Endpoint: GET /api/nutrition
// Request: { recipe: string }
// Response: { calories: number, protein: number, carbs: number, fat: number, servingSize: string }
export const getNutritionInfo = (_recipe: string): Promise<NutritionInfo> => {
  // Mocking the response with random but realistic values
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        calories: Math.floor(Math.random() * 300) + 200,
        protein: Math.floor(Math.random() * 15) + 10,
        carbs: Math.floor(Math.random() * 30) + 20,
        fat: Math.floor(Math.random() * 15) + 5,
        servingSize: "1 cup (250g)"
      });
    }, 500);
  });
};

// Description: Generate recipe image
// Endpoint: POST /api/generate-image
// Request: { recipe: string }
// Response: { imageUrl: string }
export const generateRecipeImage = (_recipe: string): Promise<ImageResponse> => {
  // Mocking the response with food-related images
  return new Promise((resolve) => {
    setTimeout(() => {
      const images = [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
        "https://images.unsplash.com/photo-1495521821757-a1efb6729352"
      ];
      resolve({
        imageUrl: `${images[Math.floor(Math.random() * images.length)]}?w=800&h=600&fit=crop`
      });
    }, 800);
  });
};