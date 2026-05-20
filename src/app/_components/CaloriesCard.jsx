"use client";

import { MoreVertical } from "lucide-react";

export default function CaloriesCard({ data }) {
  if (!data) return null;

  const {
    meta_calorias = 2000,
    meta_proteinas = 0,
    meta_carbohidratos = 0,
    meta_grasas = 0,
    consumidas = 0,
    proteinas = 0,
    carbohidratos = 0,
    grasas = 0,
  } = data;

  const progress = Math.min((consumidas / meta_calorias) * 100, 100);

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm p-5 space-y-5">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Calorías diarias</h2>
        <MoreVertical className="w-5 h-5 text-gray-400" />
      </div>

      {/* Circle */}
      <div className="flex justify-center">
        <div className="relative w-44 h-44">
          
          {/* Fondo */}
          <div className="absolute inset-0 rounded-full border-[14px] border-gray-100" />

          {/* Progreso */}
          <div
            className="absolute inset-0 rounded-full border-[14px] border-blue-600 transition-all duration-500"
            style={{
              clipPath: `inset(${100 - progress}% 0 0 0)`,
            }}
          />

          {/* Center */}
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-3xl font-bold text-gray-900">
              {consumidas}
            </span>
            <span className="text-xs text-gray-500">
              / {meta_calorias} kcal
            </span>
            <span className="text-xs text-blue-600 font-medium mt-1">
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-blue-50 rounded-xl p-3">
          <div className="text-blue-700 font-semibold">{proteinas}g</div>
          <div className="text-[11px] text-gray-500">Proteína</div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-3">
          <div className="text-emerald-600 font-semibold">{carbohidratos}g</div>
          <div className="text-[11px] text-gray-500">Carbos</div>
        </div>

        <div className="bg-orange-50 rounded-xl p-3">
          <div className="text-orange-500 font-semibold">{grasas}g</div>
          <div className="text-[11px] text-gray-500">Grasas</div>
        </div>
      </div>
    </div>
  );
}