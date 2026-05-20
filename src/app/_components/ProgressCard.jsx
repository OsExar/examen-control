"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProgressCard({
  pesoActual,
  objetivo,
  diferenciaMes,
  caloriasQuemadas,
}) {
  return (
    <div className="w-full rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-5">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Progreso</h2>

        <Link href="/pages/progress">
          <ArrowRight className="w-5 h-5 text-gray-400 hover:text-gray-700 transition" />
        </Link>
      </div>

      {/* Main stats */}
      <div className="flex justify-between items-start">

        {/* Peso */}
        <div>
          <div className="text-3xl font-bold text-gray-900">
            {pesoActual.toFixed(1)} lbs
          </div>
          <div className="text-sm text-gray-500">
            Objetivo: {objetivo || "Sin objetivo"}
          </div>
        </div>

        {/* Cambio mensual */}
        <div className="text-right">
          <div
            className={`text-sm font-semibold ${
              diferenciaMes > 0
                ? "text-emerald-500"
                : diferenciaMes < 0
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {diferenciaMes > 0
              ? `-${diferenciaMes} lbs`
              : diferenciaMes < 0
              ? `+${Math.abs(diferenciaMes)} lbs`
              : "0 lbs"}
          </div>
          <div className="text-xs text-gray-400">Este mes</div>
        </div>
      </div>

      {/* Burned calories card */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
          <span className="text-sm text-gray-600">Calorías quemadas</span>
        </div>

        <div className="text-xl font-bold text-gray-900">
          {caloriasQuemadas ?? 0} kcal
        </div>
      </div>
    </div>
  );
}