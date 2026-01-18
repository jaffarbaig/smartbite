import React, { useState, useEffect } from 'react';
import { Camera, Trash2, Loader, User, Settings, Home, TrendingUp } from 'lucide-react';
import Profile from './Profile';

if (!window.storage) {
  window.storage = {
    async get(key) {
      return { value: localStorage.getItem(key) };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
    }
  };
}

export default function SmartBite() {
  const [currentPage, setCurrentPage] = useState('home');
  const [profile, setProfile] = useState(null);
  const [meals, setMeals] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualPortion, setManualPortion] = useState('');

  // Hardcoded OpenAI API key for AI analysis
  const OPENAI_API_KEY = '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'; // Replace with your actual OpenAI API key

  // Form states for profile
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('ft'); // 'cm' or 'ft'
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');

  // Load data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const profileResult = await window.storage.get('user-profile');
        if (profileResult && profileResult.value) {
          const savedProfile = JSON.parse(profileResult.value);
          setProfile(savedProfile);
          setAge(savedProfile.age?.toString() || '');
          setGender(savedProfile.gender || 'male');
          setHeightUnit(savedProfile.heightUnit || 'ft');
          if (savedProfile.heightUnit === 'ft') {
            setFeet(savedProfile.feet?.toString() || '');
            setInches(savedProfile.inches?.toString() || '');
          } else {
            setHeight(savedProfile.height?.toString() || '');
          }
          setWeight(savedProfile.weight?.toString() || '');
          setActivityLevel(savedProfile.activityLevel || 'moderate');
          setGoal(savedProfile.goal || 'maintain');
        }
      } catch (error) {
        console.log('No profile saved yet');
      }

      try {
        const mealsResult = await window.storage.get('meals-data');
        if (mealsResult && mealsResult.value) {
          setMeals(JSON.parse(mealsResult.value));
        }
      } catch (error) {
        console.log('No meals saved yet');
      }

      try {
        const apiKeyResult = await window.storage.get('anthropic-api-key');
        if (apiKeyResult && apiKeyResult.value) {
          setApiKey(apiKeyResult.value);
        }
      } catch (error) {
        console.log('No API key saved yet');
      }
    };
    loadData();
  }, []);

  // Save profile whenever it changes
  useEffect(() => {
    if (profile) {
      window.storage.set('user-profile', JSON.stringify(profile));
    }
  }, [profile]);

  // Save meals whenever they change
  useEffect(() => {
    if (meals.length > 0) {
      window.storage.set('meals-data', JSON.stringify(meals));
    }
  }, [meals]);

  const calculateProfile = async () => {
    // Validate all required fields
    if (!age || !weight) {
      alert('Please fill in age and weight!');
      return;
    }

    // Validate height based on unit
    if (heightUnit === 'cm' && !height) {
      alert('Please enter your height in centimeters!');
      return;
    }

    if (heightUnit === 'ft' && !feet) {
      alert('Please enter your height in feet!');
      return;
    }

    // Save API key if provided (validation skipped due to CORS limitations)
    if (apiKey) {
      window.storage.set('anthropic-api-key', apiKey);
    }

    // Convert height to cm if in feet/inches
    let heightNum;
    if (heightUnit === 'ft') {
      const totalInches = (parseInt(feet) * 12) + (parseInt(inches) || 0);
      heightNum = totalInches * 2.54; // Convert inches to cm
    } else {
      if (!height) {
        alert('Please enter your height!');
        return;
      }
      heightNum = parseInt(height);
    }

    const ageNum = parseInt(age);
    const weightNum = parseInt(weight);

    // Calculate BMR
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

    const goals = {
      maintain: tdee,
      mildLoss: Math.round(tdee - 250),
      loss: Math.round(tdee - 500),
      mildGain: Math.round(tdee + 250),
      gain: Math.round(tdee + 500)
    };

    // Calculate BMI
    const heightInMeters = heightNum / 100;
    const bmi = (weightNum / (heightInMeters * heightInMeters)).toFixed(1);
    
    let bmiCategory = '';
    let bmiColor = '';
    let weightSuggestion = '';
    let targetWeight = null;
    
    // Calculate ideal weight range for healthy BMI (18.5-24.9)
    const minHealthyWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxHealthyWeight = (24.9 * heightInMeters * heightInMeters).toFixed(1);
    
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'text-blue-600';
      const weightToGain = (minHealthyWeight - weightNum).toFixed(1);
      targetWeight = minHealthyWeight;
      weightSuggestion = `Gain ${weightToGain} kg to reach healthy BMI (target: ${minHealthyWeight} kg)`;
    } else if (bmi < 25) {
      bmiCategory = 'Normal Weight';
      bmiColor = 'text-green-600';
      weightSuggestion = `You're in the healthy range! Maintain ${minHealthyWeight}-${maxHealthyWeight} kg`;
      targetWeight = weightNum;
    } else if (bmi < 30) {
      bmiCategory = 'Overweight';
      bmiColor = 'text-orange-600';
      const weightToLose = (weightNum - maxHealthyWeight).toFixed(1);
      targetWeight = maxHealthyWeight;
      weightSuggestion = `Lose ${weightToLose} kg to reach healthy BMI (target: ${maxHealthyWeight} kg)`;
    } else {
      bmiCategory = 'Obese';
      bmiColor = 'text-red-600';
      const weightToLose = (weightNum - maxHealthyWeight).toFixed(1);
      targetWeight = maxHealthyWeight;
      weightSuggestion = `Lose ${weightToLose} kg to reach healthy BMI (target: ${maxHealthyWeight} kg). Consider consulting a doctor.`;
    }

    // Height assessment for age (WHO growth standards - simplified)
    let heightStatus = '';
    let heightAdvice = '';
    
    if (ageNum < 18) {
      // Average heights (cm) for different ages (simplified WHO standards)
      const avgHeights = {
        male: {
          10: 138, 11: 143, 12: 149, 13: 156, 14: 164, 15: 170, 16: 173, 17: 175, 18: 176
        },
        female: {
          10: 138, 11: 144, 12: 151, 13: 157, 14: 160, 15: 162, 16: 163, 17: 163, 18: 163
        }
      };
      
      const avgHeight = avgHeights[gender][ageNum];
      if (avgHeight) {
        const heightDiff = heightNum - avgHeight;
        if (heightDiff >= -5 && heightDiff <= 5) {
          heightStatus = 'Average height for your age';
          heightAdvice = 'You\'re growing well! Keep eating nutritious foods and stay active.';
        } else if (heightDiff > 5) {
          heightStatus = 'Taller than average for your age';
          heightAdvice = 'Great! You\'re growing well. Make sure to eat enough protein and calcium.';
        } else {
          heightStatus = 'Shorter than average for your age';
          heightAdvice = 'Everyone grows at their own pace! Focus on: protein (eggs, chicken, fish), calcium (milk, cheese), vitamin D (sunlight), and good sleep (8-10 hours). Consider talking to a doctor if concerned.';
        }
      }
    }

    const newProfile = {
      age: ageNum,
      gender,
      height: heightNum,
      weight: weightNum,
      heightUnit,
      feet,
      inches,
      activityLevel,
      goal,
      bmr: Math.round(bmr),
      tdee,
      targetCalories: goals[goal],
      bmi: parseFloat(bmi),
      bmiCategory,
      bmiColor,
      heightStatus,
      heightAdvice,
      weightSuggestion,
      targetWeight: parseFloat(targetWeight),
      minHealthyWeight: parseFloat(minHealthyWeight),
      maxHealthyWeight: parseFloat(maxHealthyWeight)
    };

    setProfile(newProfile);
    window.storage.set('user-profile', JSON.stringify(newProfile));
    setCurrentPage('home');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setImageBase64(base64String);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFood = async () => {
    if (!imageBase64 || !foodName) {
      alert('Please add both a photo and food name!');
      return;
    }

    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
      alert('AI feature requires API key configuration. Please contact support.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `You are a nutrition expert. Look at this image of ${foodName}. Based on the portion size visible in the image, estimate the total calories. 

IMPORTANT: Respond with ONLY a JSON object in this exact format, nothing else:
{
  "calories": <number>,
  "portion": "<brief description of portion size>"
}

Do not include any other text, explanations, or markdown formatting.`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      
      // Check for API errors
      if (data.error) {
        console.error('API Error:', data.error);
        alert(`API Error: ${data.error.message || 'Invalid API key or request failed'}`);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        console.error('Response not OK:', response.status, data);
        alert(`Error ${response.status}: ${data.error?.message || 'Request failed. Please check your API key.'}`);
        setLoading(false);
        return;
      }

      const text = data.choices[0].message.content.trim();
      const cleanText = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanText);

      const newMeal = {
        id: Date.now(),
        name: foodName,
        calories: result.calories,
        portion: result.portion,
        image: imagePreview,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setMeals([newMeal, ...meals]);
      setFoodName('');
      setImagePreview(null);
      setImageBase64(null);
      setLoading(false);

    } catch (error) {
      console.error('Error analyzing food:', error);
      if (error.message.includes('JSON')) {
        alert('Failed to parse AI response. Please try again!');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        alert('Network error. Please check your internet connection!');
      } else {
        alert(`Error: ${error.message || 'Something went wrong. Please check your API key and try again!'}`);
      }
      setLoading(false);
    }
  };

  const deleteMeal = (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const addManualMeal = () => {
    if (!foodName || !manualCalories) {
      alert('Please enter food name and calories!');
      return;
    }

    const newMeal = {
      id: Date.now(),
      name: foodName,
      calories: parseInt(manualCalories),
      portion: manualPortion || 'Manual entry',
      image: imagePreview,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMeals([newMeal, ...meals]);
    setFoodName('');
    setManualCalories('');
    setManualPortion('');
    setImagePreview(null);
    setImageBase64(null);
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const caloriesRemaining = profile ? profile.targetCalories - totalCalories : 0;
  const progressPercent = profile ? Math.min((totalCalories / profile.targetCalories) * 100, 100) : 0;
  const mealCalories = 600; // average meal size assumption
  const snackCalories = 250; // hearty snack / light meal
  const mealsRemaining = caloriesRemaining > 0 ? Math.floor(caloriesRemaining / mealCalories) : 0;
  const lightMealPossible = caloriesRemaining > snackCalories;
  const overageMeals = caloriesRemaining < 0 ? Math.max(0, Math.ceil(Math.abs(caloriesRemaining) / mealCalories)) : 0;

  const decisionSupportText = (() => {
    if (caloriesRemaining <= 0) return 'Over target: choose lighter options next or add a short walk.';
    if (caloriesRemaining >= mealCalories) return 'Plenty of room: enjoy a balanced meal (~600 cal).';
    if (caloriesRemaining >= snackCalories) return 'Good for a light meal or hearty snack (~250-500 cal).';
    return 'Tight margin: stick to a light snack (<200 cal).';
  })();

  const mealEstimateText = (() => {
    if (caloriesRemaining <= 0) {
      return `About ${overageMeals || 1} meal${overageMeals === 1 ? '' : 's'} over target — consider a walk or lighter meals.`;
    }
    if (mealsRemaining >= 2) {
      return '';
    }
    if (mealsRemaining === 1) {
      return 'Room for one balanced meal (~600 cal).';
    }
    if (lightMealPossible) {
      return 'Best fit: one light meal or hearty snack (~250-500 cal).';
    }
    return `Tiny buffer (~${caloriesRemaining} cal): think fruit or yogurt.`;
  })();

  // Auth / User Profile Page (Supabase)
  if (currentPage === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">🔐 Account & Profile</h1>
              <button
                onClick={() => setCurrentPage('home')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                ← Back
              </button>
            </div>
          </div>
          <Profile />
        </div>
      </div>
    );
  }

  // Profile Setup Page
  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">👤 Your Profile</h1>
                <p className="text-gray-600 text-lg">Tell us about yourself to calculate your daily calorie goal</p>
              </div>
              <button
                onClick={() => setCurrentPage('home')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all font-semibold whitespace-nowrap ml-4"
              >
                ← Back
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Age (years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 14"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setGender('male')}
                  className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all shadow-sm ${
                    gender === 'male' ? 'bg-blue-500 text-white shadow-lg scale-105' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👨 Male
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all shadow-sm ${
                    gender === 'female' ? 'bg-pink-500 text-white shadow-lg scale-105' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👩 Female
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Height</label>
              
              {/* Unit Toggle */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setHeightUnit('cm')}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                    heightUnit === 'cm' ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Centimeters (cm)
                </button>
                <button
                  onClick={() => setHeightUnit('ft')}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                    heightUnit === 'ft' ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Feet & Inches
                </button>
              </div>

              {/* Height Input */}
              {heightUnit === 'cm' ? (
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 165"
                  className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              ) : (
                <input
                  type="text"
                  value={feet && inches ? `${feet}'${inches}"` : feet ? `${feet}'` : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const match = value.match(/^(\d+)'?(\d*)?"?$/);
                    if (match) {
                      setFeet(match[1] || '');
                      setInches(match[2] || '');
                    } else if (value === '') {
                      setFeet('');
                      setInches('');
                    }
                  }}
                  placeholder="e.g., 5'6 or 5'6&quot;"
                  className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 55"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
              >
                <option value="sedentary">Sedentary (little exercise)</option>
                <option value="light">Lightly Active (1-3 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="active">Very Active (6-7 days/week)</option>
                <option value="veryActive">Extra Active (intense daily)</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Your Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
              >
                <option value="loss">Lose Weight (0.5 kg/week)</option>
                <option value="mildLoss">Mild Weight Loss (0.25 kg/week)</option>
                <option value="maintain">Maintain Weight</option>
                <option value="mildGain">Mild Weight Gain (0.25 kg/week)</option>
                <option value="gain">Gain Weight (0.5 kg/week)</option>
              </select>
            </div>

            {/* AI API key input temporarily removed from UI */}

            <button
              onClick={calculateProfile}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all mb-3"
            >
              Save Profile
            </button>

            <button
              onClick={() => setCurrentPage('home')}
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Home Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header with Profile Info */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 mb-6">
          {/* Header layout: logo left, buttons and date stacked right */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-0 mb-6">
            {/* Logo Section (Left) */}
            <div className="flex flex-col gap-0 items-center sm:items-start w-full sm:w-auto">
              <img 
                src="/assets/logo.png" 
                alt="SmartBite Logo" 
                className="w-48 sm:w-72 h-auto"
              />
              <p className="text-gray-600 text-sm sm:text-lg font-semibold text-center sm:text-left sm:whitespace-nowrap -mt-2 sm:-mt-12 px-2 sm:px-0">🍽️ Snap a Meal. Get Instant Calorie & Nutrition Insights with AI</p>
            </div>

            {/* Right Section: Buttons and Date Stacked */}
            <div className="flex flex-col gap-2 items-center w-full sm:w-auto sm:-ml-36">
              {/* Account/Profile Buttons */}
              <div className="flex gap-2 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setCurrentPage('auth')}
                  className="bg-blue-100 text-blue-700 px-4 sm:px-5 py-2 sm:py-3 rounded-xl hover:bg-blue-200 transition-all flex items-center gap-2 font-semibold shadow-sm text-sm sm:text-base"
                >
                  <User size={18} className="sm:w-5 sm:h-5" />
                  Account
                </button>
                <button
                  onClick={() => setCurrentPage('profile')}
                  className="bg-purple-100 text-purple-700 px-4 sm:px-5 py-2 sm:py-3 rounded-xl hover:bg-purple-200 transition-all flex items-center gap-2 font-semibold shadow-sm text-sm sm:text-base"
                >
                  <Settings size={18} className="sm:w-5 sm:h-5" />
                  Profile
                </button>
              </div>
              {/* Date Below Buttons */}
              <p className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm shadow-md whitespace-nowrap">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {profile ? (
            <>
              {/* BMI Display */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">Your BMI</p>
                    <p className={`text-4xl font-bold ${profile.bmiColor}`}>{profile.bmi}</p>
                    <p className={`text-base font-bold mt-1 ${profile.bmiColor}`}>{profile.bmiCategory}</p>
                  </div>
                  <div className="text-right text-xs text-gray-600 space-y-1">
                    <p>Underweight: &lt;18.5</p>
                    <p>Normal: 18.5-24.9</p>
                    <p>Overweight: 25-29.9</p>
                    <p>Obese: ≥30</p>
                  </div>
                </div>
                
                {/* BMI Disclaimer */}
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-3 mb-4 flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-blue-700"><span className="font-semibold">Tip:</span> BMI is an estimate and doesn't account for muscle mass.</p>
                </div>
                
                {/* Weight & Goal Section */}
                <div className="bg-white bg-opacity-70 rounded-xl p-4">
                  <p className="text-sm font-bold text-gray-800 mb-4">🎯 Your Goal & Target Weight</p>
                  
                  {/* Goal Mode Selection */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Goal Mode</p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setGoal('loss');
                          setProfile({ ...profile, goal: 'loss', targetCalories: Math.round(profile.tdee - 500) });
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          goal === 'loss'
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        🔴 Lose Weight
                      </button>
                      <button
                        onClick={() => {
                          setGoal('maintain');
                          setProfile({ ...profile, goal: 'maintain', targetCalories: profile.tdee });
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          goal === 'maintain'
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        🟢 Maintain
                      </button>
                      <button
                        onClick={() => {
                          setGoal('gain');
                          setProfile({ ...profile, goal: 'gain', targetCalories: Math.round(profile.tdee + 500) });
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          goal === 'gain'
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        🔵 Gain Weight
                      </button>
                    </div>
                  </div>

                  {/* Target Weight Input */}
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-700 block mb-2">Target Weight (kg)</label>
                    <input
                      type="number"
                      value={profile.userTargetWeight || profile.targetWeight || ''}
                      onChange={(e) => {
                        const newTarget = e.target.value ? parseFloat(e.target.value) : profile.targetWeight;
                        setProfile({ ...profile, userTargetWeight: newTarget });
                      }}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      placeholder={`Recommended: ${profile.targetWeight} kg`}
                    />
                    <p className="text-xs text-gray-500 mt-2">Healthy range: {profile.minHealthyWeight} - {profile.maxHealthyWeight} kg</p>
                  </div>

                  {/* Calorie Target Explanation */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs font-bold text-gray-800 mb-1">Daily Calorie Target</p>
                    <p className="text-sm font-bold text-blue-600 mb-2">{profile.targetCalories} calories/day</p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {goal === 'maintain' && `Based on your goal to maintain current weight`}
                      {goal === 'loss' && `Calculated to help you lose ~0.5 kg/week`}
                      {goal === 'gain' && `Calculated to help you gain ~0.5 kg/week`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Height Status for Under 18 */}
              {profile.heightStatus && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-5">
                  <p className="font-bold text-blue-800 mb-2 text-base">📏 {profile.heightStatus}</p>
                  <p className="text-blue-700 text-sm leading-relaxed">{profile.heightAdvice}</p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-600 font-medium">Daily Progress</span>
                  <span className="font-bold text-gray-900 text-base">{totalCalories} / {profile.targetCalories} cal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner overflow-hidden">
                  <div
                    className={`h-5 rounded-full transition-all shadow-md ${
                      totalCalories > profile.targetCalories 
                        ? 'bg-red-500' 
                        : totalCalories >= profile.targetCalories * 0.8 
                          ? 'bg-yellow-500' 
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min((totalCalories / profile.targetCalories) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>
                    {totalCalories > profile.targetCalories 
                      ? `🔴 Over by ${totalCalories - profile.targetCalories} cal`
                      : totalCalories >= profile.targetCalories * 0.8
                        ? `🟡 Close to limit (${profile.targetCalories - totalCalories} cal remaining)`
                        : `🟢 ${profile.targetCalories - totalCalories} cal remaining`
                    }
                  </span>
                </div>
              </div>

              {/* Calories Remaining */}
              <div className={`rounded-2xl p-6 shadow-lg ${
                caloriesRemaining >= 0 
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' 
                  : 'bg-gradient-to-r from-red-500 to-orange-500'
              } text-white`}>
                <p className="text-sm opacity-90 font-medium mb-1">
                  {caloriesRemaining >= 0 ? 'Calories Remaining' : 'Over Target by'}
                </p>
                <p className="text-5xl font-bold">{Math.abs(caloriesRemaining)}</p>
                <p className="text-sm font-semibold mt-3 opacity-90">{decisionSupportText}</p>
                <p className="text-xs mt-2 opacity-90">{mealEstimateText}</p>
              </div>
            </>
          ) : (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
              <p className="text-amber-900 font-bold mb-3 text-lg">👋 Welcome!</p>
              <p className="text-amber-700 text-base mb-4 leading-relaxed">Set up your profile to get a personalized daily calorie goal!</p>
              <button
                onClick={() => setCurrentPage('profile')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-md"
              >
                Set Up Profile
              </button>
            </div>
          )}
        </div>

        {/* Add Meal Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📸 Add New Meal</h2>
          
          <div className="mb-6">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Food preview" className="w-full h-56 object-cover rounded-2xl shadow-md" />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="absolute top-3 right-3 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 shadow-lg transition-all"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* Take Photo */}
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all bg-gray-50 shadow-sm">
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                  <Camera className="mb-3 text-gray-400" size={36} />
                  <p className="text-sm text-gray-700 font-bold">Take Photo</p>
                </label>

                {/* Upload Photo */}
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-all bg-gray-50 shadow-sm">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                  <svg className="mb-3 text-gray-400" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="text-sm text-gray-700 font-bold">Upload Photo</p>
                </label>
              </div>
            )}
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="What food is this? (e.g., Pizza, Burger)"
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <input
                type="number"
                value={manualCalories}
                onChange={(e) => setManualCalories(e.target.value)}
                placeholder="Calories (e.g., 350)"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <input
                type="text"
                value={manualPortion}
                onChange={(e) => setManualPortion(e.target.value)}
                placeholder="Portion (optional)"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={addManualMeal}
              disabled={!foodName || !manualCalories}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➕ Add Meal
            </button>

            <button
              onClick={analyzeFood}
              disabled={loading || !imagePreview || !foodName}
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={22} />
                  AI Analyzing...
                </>
              ) : (
                '✨ Analyze with AI'
              )}
            </button>
          </div>
        </div>

        {/* Meals List */}
        <div className="space-y-4">
          {meals.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center text-gray-500">
              <p className="text-lg font-medium">No meals logged yet today.</p>
              <p className="text-base mt-2">Add your first meal above! 👆</p>
            </div>
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="bg-white rounded-3xl shadow-xl p-5 flex gap-5">
                {meal.image && (
                  <img 
                    src={meal.image} 
                    alt={meal.name} 
                    className="w-28 h-28 object-cover rounded-2xl shadow-md"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl">{meal.name}</h3>
                      <p className="text-emerald-600 font-bold text-2xl mt-1">{meal.calories} cal</p>
                      {meal.portion && (
                        <p className="text-gray-600 text-sm mt-2">{meal.portion}</p>
                      )}
                      <p className="text-gray-500 text-sm mt-2">{meal.time}</p>
                    </div>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
