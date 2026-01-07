
import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { generateRecipeImage } from '../services/geminiService';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await generateRecipeImage(recipe.imagePrompt);
        setImageUrl(url);
      } catch (error) {
        console.error("Failed to generate image:", error);
        setImageUrl("https://picsum.photos/seed/" + encodeURIComponent(recipe.title) + "/400/400");
      } finally {
        setIsImageLoading(false);
      }
    };
    fetchImage();
  }, [recipe.imagePrompt, recipe.title]);

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-56 w-full bg-slate-200">
        {isImageLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          추천 {index + 1}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-extrabold text-slate-800 leading-tight">{recipe.title}</h3>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            {recipe.difficulty}
          </span>
        </div>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        
        <div className="flex gap-4 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <span>⏱️</span> {recipe.cookingTime}
          </div>
          <div className="flex items-center gap-1">
            <span>🔥</span> {recipe.calories}
          </div>
        </div>

        {recipe.missingIngredients.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1 block">추가 필요 재료 있음 🛒</span>
            <div className="flex flex-wrap gap-1">
               {recipe.missingIngredients.slice(0, 2).map((item, idx) => (
                 <span key={idx} className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100 italic">
                   +{item}
                 </span>
               ))}
               {recipe.missingIngredients.length > 2 && <span className="text-[10px] text-slate-400">외 {recipe.missingIngredients.length - 2}개</span>}
            </div>
          </div>
        )}

        <button 
          onClick={() => setShowDetail(true)}
          className="mt-auto w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
        >
          상세 레시피
        </button>
      </div>

      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 flex justify-between items-center border-b z-10">
              <h2 className="text-2xl font-extrabold text-slate-900">{recipe.title}</h2>
              <button 
                onClick={() => setShowDetail(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="bg-slate-50 px-4 py-2 rounded-xl">
                  <span className="text-xs text-slate-400 block">조리 시간</span>
                  <span className="font-bold text-slate-700">{recipe.cookingTime}</span>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-xl">
                  <span className="text-xs text-slate-400 block">난이도</span>
                  <span className="font-bold text-slate-700">{recipe.difficulty}</span>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-xl">
                  <span className="text-xs text-slate-400 block">칼로리</span>
                  <span className="font-bold text-slate-700">{recipe.calories}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-emerald-500">●</span> 있는 재료
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.map((ing, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-medium border border-emerald-100">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-orange-500">●</span> 부족한 재료 (장보기)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.missingIngredients.length > 0 ? (
                      recipe.missingIngredients.map((ing, idx) => (
                        <span key={idx} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-sm font-medium border border-orange-100">
                          {ing}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-sm">추가 재료가 필요 없어요! 🙌</span>
                    )}
                  </div>  
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-emerald-500">●</span> 조리 순서
                </h4>
                <div className="space-y-4">
                  {recipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t bg-slate-50 flex justify-end">
              <button 
                onClick={() => setShowDetail(false)}
                className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors"
              >
                레시피 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
