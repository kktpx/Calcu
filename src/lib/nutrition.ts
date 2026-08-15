export type Gender = 'male' | 'female' | 'other'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type FitnessGoal = 'lose' | 'maintain' | 'gain'

export function calculateBMR(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  // Mifflin-St Jeor Equation
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age)
  
  if (gender === 'male') {
    bmr += 5
  } else if (gender === 'female') {
    bmr -= 161
  } else {
    // For 'other', we take the average of male and female BMR
    bmr -= 78 
  }
  
  return bmr
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  
  return bmr * multipliers[activityLevel]
}

export function calculateMacroTargets(tdee: number, goal: FitnessGoal): { calories: number, protein: number, carbs: number, fat: number } {
  let targetCalories = tdee
  
  if (goal === 'lose') {
    targetCalories -= 500 // 500 calorie deficit for ~1lb/week loss
  } else if (goal === 'gain') {
    targetCalories += 300 // 300 calorie surplus for lean gain
  }
  
  // Macronutrient distribution
  // Protein: ~30% (or roughly 1.8-2.2g per kg of bodyweight, but percentage is simpler here)
  // Fat: ~25%
  // Carbs: ~45% (remainder)
  
  // Adjusted for standard goals:
  // Cutting (lose): higher protein to preserve muscle
  // Bulking (gain): higher carbs for energy
  
  let proteinPercent = 0.30
  let fatPercent = 0.25
  let carbsPercent = 0.45
  
  if (goal === 'lose') {
    proteinPercent = 0.35
    fatPercent = 0.25
    carbsPercent = 0.40
  } else if (goal === 'gain') {
    proteinPercent = 0.25
    fatPercent = 0.25
    carbsPercent = 0.50
  }
  
  const protein = (targetCalories * proteinPercent) / 4 // 4 calories per gram of protein
  const fat = (targetCalories * fatPercent) / 9 // 9 calories per gram of fat
  const carbs = (targetCalories * carbsPercent) / 4 // 4 calories per gram of carbs
  
  return {
    calories: Math.round(targetCalories),
    protein: Math.round(protein),
    fat: Math.round(fat),
    carbs: Math.round(carbs)
  }
}
