
import React, { useState } from 'react';
import { MealTime, Recipe } from './types';
import MealSelector from './components/MealSelector';
import RecipeCard from './components/RecipeCard';
import { generateRecipes } from './services/geminiService';

const App: React.FC = () => {
  const [mealTime, setMealTime] = useState<MealTime>(MealTime.LUNCH);
  const [ingredients, setIngredients] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      alert('냉장고에 있는 재료를 입력해주세요!');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setRecipes([]);

    try {
      const generatedRecipes = await generateRecipes(mealTime, ingredients);
      setRecipes(generatedRecipes);
    } catch (err) {
      console.error(err);
      setError('레시피를 생성하는 중에 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 md:px-8">
      {/* Header */}
      <header className="max-w-4xl w-full text-center mb-12">
        <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold mb-4">
          🍳 냉장고를 부탁해 AI
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          오늘 뭐 먹지?
        </h1>
        <p className="text-slate-500 text-lg">
          지금 있는 재료들로 만들 수 있는 최고의 레시피를 제안해 드립니다.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl w-full space-y-12">
        {/* Step 1: Meal Selection */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-sm">1</span>
            언제 드실 건가요?
          </h2>
          <MealSelector selectedMeal={mealTime} onSelect={setMealTime} />
        </section>

        {/* Step 2: Ingredient Input */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-sm">2</span>
            냉장고에 어떤 재료가 있나요?
          </h2>
          <div className="space-y-4">
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="예: 계란, 양파, 베이컨, 우유, 찬밥 (콤마로 구분해주세요)"
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none text-slate-700"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 ${
                isGenerating 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg transform hover:-translate-y-1'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-400"></div>
                  셰프 AI가 고민 중입니다...
                </div>
              ) : '레시피 3가지 추천받기'}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        {recipes.length > 0 && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-800">
                ✨ 추천 요리 레시피
              </h2>
              <span className="text-sm text-slate-400">AI가 엄선한 3가지 제안</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} index={index} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-slate-200 w-full max-w-4xl text-center text-slate-400 text-sm">
        <p>© 2024 Fridge Chef AI. All rights reserved.</p>
        <p className="mt-1">Powered by Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
