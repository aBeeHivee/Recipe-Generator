import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mic, Loader2, MicOff, Clock, Users, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { getRecipeSuggestions, getNutritionInfo, generateRecipeImage } from '@/api/recipe';

interface FormData {
  ingredients: string;
}

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export function HomePage() {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [nutrition, setNutrition] = useState<NutritionInfo | null>(null);
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setValue('ingredients', transcript);
      };

      recognition.onerror = (event: any) => {
        console.error(event.error);
        setIsListening(false);
        toast({
          title: "Error",
          description: "Failed to recognize speech",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const ingredients = data.ingredients.split(',').map(i => i.trim());

      // Get recipe
      const { recipe: recipeData } = await getRecipeSuggestions(ingredients);
      setRecipe(recipeData);

      // Get nutrition info
      const nutritionData = await getNutritionInfo(recipeData.title);
      setNutrition(nutritionData);

      // Generate image
      const { imageUrl } = await generateRecipeImage(recipeData.title);
      setImage(imageUrl);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get recipe suggestions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🍳 Recipe AI Assistant
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your ingredients and let AI create a delicious recipe for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  {...register('ingredients')}
                  placeholder="Enter ingredients (comma-separated)..."
                  className="min-h-[100px] bg-white dark:bg-gray-900"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Recipe...
                    </>
                  ) : (
                    'Create Recipe'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`flex-shrink-0 transition-all duration-200 ${isListening ? 'bg-red-100 dark:bg-red-900' : ''}`}
                  onClick={startListening}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {recipe && (
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">{recipe.title}</CardTitle>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Prep: {recipe.prepTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4" />
                  <span>Cook: {recipe.cookTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Serves: {recipe.servings}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {image && (
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={image}
                    alt="Recipe visualization"
                    className="w-full h-72 object-cover transform hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Ingredients</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {recipe.ingredients.map((ingredient: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Instructions</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {recipe.instructions.map((step: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {nutrition && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-4">Nutrition Information</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-300">Calories</div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-200">{nutrition.calories}</div>
                    </div>
                    <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="text-sm font-medium text-pink-600 dark:text-pink-300">Protein</div>
                      <div className="text-2xl font-bold text-pink-700 dark:text-pink-200">{nutrition.protein}g</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-300">Carbs</div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-200">{nutrition.carbs}g</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="text-sm font-medium text-green-600 dark:text-green-300">Fat</div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-200">{nutrition.fat}g</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Serving Size: {nutrition.servingSize}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}