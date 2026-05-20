'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/app/_components/caltrackLogo'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'
import { useRegister } from '@/app/_context/RegisterContext'
import { isObjetivoPerderPeso, isObjetivoGanarPeso } from '@/app/_constants/objectives'

function calcularMacros({
  peso,
  altura,
  edad,
  genero,
  actividad_fisica,
  objetivo,
}) {
  const pesoKg = Number(peso) * 0.453592
  const alturaCm = Number(altura)
  const edadNum = Number(edad)

  let tmb = 0
  const generoNorm = (genero || '').toLowerCase()

  if (
    generoNorm === 'masculino' ||
    generoNorm === 'male' ||
    generoNorm === 'hombre'
  ) {
    tmb = 88.36 + 13.4 * pesoKg + 4.8 * alturaCm - 5.7 * edadNum
  } else {
    tmb = 447.6 + 9.2 * pesoKg + 3.1 * alturaCm - 4.3 * edadNum
  }

  let factor = 1.2
  if (actividad_fisica === 'sedentario') factor = 1.2
  else if (actividad_fisica === 'ligero') factor = 1.375
  else if (actividad_fisica === 'moderado') factor = 1.55
  else if (actividad_fisica === 'intenso') factor = 1.725

  let calorias = tmb * factor

  let macros = { p: 0.3, c: 0.4, g: 0.3 }

  if (isObjetivoPerderPeso(objetivo)) {
    calorias -= 300
    macros = { p: 0.35, c: 0.35, g: 0.3 }
  } else if (isObjetivoGanarPeso(objetivo)) {
    calorias += 300
    macros = { p: 0.25, c: 0.5, g: 0.25 }
  }

  calorias = Math.round(calorias)

  return {
    calorias,
    proteinas: Math.round((calorias * macros.p) / 4),
    carbohidratos: Math.round((calorias * macros.c) / 4),
    grasas: Math.round((calorias * macros.g) / 9),
  }
}

export default function FinalRegisterPage() {
  const { registerData } = useRegister()
  const [macros, setMacros] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (
      registerData?.peso &&
      registerData?.altura &&
      registerData?.edad &&
      registerData?.genero &&
      registerData?.actividad_fisica &&
      registerData?.objetivo
    ) {
      setMacros(calcularMacros(registerData))
    }
  }, [registerData])

  const handleContinue = async () => {
    if (!macros) return

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('No autenticado')
      setLoading(false)
      return
    }

    // ✅ METAS (FIXED: upsert correcto)
    const { error: metaError } = await supabase
      .from('metas_caloricas')
      .upsert(
        {
          usuario_id: user.id,
          calorias_objetivo: macros.calorias,
          proteinas: macros.proteinas,
          carbohidratos: macros.carbohidratos,
          grasas: macros.grasas,
        },
        {
          onConflict: 'usuario_id',
        }
      )

    if (metaError) {
      setError(metaError.message)
      setLoading(false)
      return
    }

    // Peso inicial
    const { error: pesoError } = await supabase
      .from('peso_progreso')
      .insert({
        usuario_id: user.id,
        peso: registerData.peso,
      })

    if (pesoError) {
      setError(pesoError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.push('/pages/calories')
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white min-h-screen p-8 gap-8">
      
      {/* back */}
      <Link href="/pages/user-details" className="absolute top-4 left-4">
        ←
      </Link>

      <Logo />

      <p className="text-center text-black text-lg font-medium">
        Tu consumo diario de calorías debe ser de:
        <br />
        <span className="font-bold">
          {macros ? `${macros.calorias} kcal` : 'Calculando...'}
        </span>
      </p>

      {macros && (
        <div className="text-black text-center">
          <div>Proteínas: <b>{macros.proteinas}g</b></div>
          <div>Carbohidratos: <b>{macros.carbohidratos}g</b></div>
          <div>Grasas: <b>{macros.grasas}g</b></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}

      <button
        onClick={handleContinue}
        disabled={loading || !macros}
        className="w-full bg-black text-white p-3 rounded-2xl"
      >
        {loading ? 'Guardando...' : 'Continuar'}
      </button>
    </div>
  )
}