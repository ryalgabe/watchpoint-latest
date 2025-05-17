'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { completeOnboarding } from '@/actions/onboard'
import { steps, watchBrands } from '@/constants/content/onboarding'

export function OnboardingForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    budget: [50000],
    collection: [] as string[],
    interests: [] as string[],
    experience: '',
  })

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (currentStep === steps.length - 1) {
      try {
        setIsSubmitting(true)

        if (!formData.experience) {
          toast.error('Please select your experience level')
          return
        }

        const submitData = new FormData()
        submitData.append('experience', formData.experience)
        submitData.append('priceRange', formData.budget[0].toString())

        submitData.append(
          'collections',
          formData.collection.length > 0
            ? formData.collection.join(', ')
            : 'None'
        )

        submitData.append(
          'preferredBrands',
          formData.interests.length > 0 ? formData.interests.join(', ') : 'None'
        )

        console.log('Submitting form data:', {
          experience: formData.experience,
          priceRange: formData.budget[0].toString(),
          collections: formData.collection.join(', '),
          preferredBrands: formData.interests.join(', '),
        })

        const result = await completeOnboarding(submitData)

        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('Onboarding completed successfully!')
          router.push('/dashboard')
        }
      } catch (error) {
        toast.error('Failed to save onboarding data')
        console.error(error)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      handleNext()
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold text-gray-200">
                  Investment Budget (€)
                </Label>
                <span className="text-gray-400">
                  €{formData.budget[0].toLocaleString()}
                </span>
              </div>
              <Slider
                value={formData.budget}
                onValueChange={(value) =>
                  setFormData({ ...formData, budget: value })
                }
                min={50000}
                max={500000}
                step={5000}
                className="w-full h-2 rounded-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>€50,000</span>
                <span>€500,000</span>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Rolex Submariner',
                  'Patek Philippe Nautilus',
                  'None yet',
                ].map((watch) => (
                  <Button
                    key={watch}
                    variant="outline"
                    className={`justify-start h-auto p-4 rounded-lg transition-all duration-200 ${
                      formData.collection.includes(watch)
                        ? 'border-blue-600 bg-blue-600/10'
                        : 'border-gray-700 hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      if (watch === 'None yet') {
                        // If clicking None, clear other selections
                        setFormData({
                          ...formData,
                          collection: ['None yet'],
                        })
                      } else {
                        // If clicking other options
                        setFormData({
                          ...formData,
                          collection: formData.collection.includes(watch)
                            ? formData.collection.filter((w) => w !== watch) // Remove if already selected
                            : formData.collection.includes('None yet')
                              ? [watch] // Replace None with new selection
                              : [...formData.collection, watch], // Add to selections
                        })
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {formData.collection.includes(watch) && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                      <span className="text-gray-200">{watch}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {watchBrands.map((brand) => (
                <Button
                  key={brand}
                  variant="outline"
                  className={`justify-start h-auto p-4 rounded-lg transition-all duration-200 ${
                    formData.interests.includes(brand)
                      ? 'border-blue-600 bg-blue-600/10'
                      : 'border-gray-700 hover:bg-gray-800'
                  }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      interests: formData.interests.includes(brand)
                        ? formData.interests.filter((b) => b !== brand)
                        : [...formData.interests, brand],
                    })
                  }
                >
                  <div className="flex items-center gap-3">
                    {formData.interests.includes(brand) && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    )}
                    <span className="text-gray-200">{brand}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <RadioGroup
              value={formData.experience}
              onValueChange={(value: string) =>
                setFormData({ ...formData, experience: value })
              }
              className="grid grid-cols-1 gap-4"
            >
              {['Beginner', 'Intermediate', 'Professional'].map((level) => (
                <Label
                  key={level}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors duration-200 ${
                    formData.experience === level
                      ? 'border-blue-600 bg-blue-600/10'
                      : 'border-gray-700 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={level}
                      id={level}
                      className="sr-only"
                    />
                    <span className="text-gray-200">{level}</span>
                  </div>
                  {formData.experience === level && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </Label>
              ))}
            </RadioGroup>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-8 flex flex-col">
      <div className="space-y-1 w-full max-w-xs flex flex-col">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-gray-400">
            {Math.round(progress)}% completed
          </span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-400">{steps[currentStep].subtitle}</p>
            </div>

            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          size="sm"
          className="border-gray-700 hover:bg-gray-800 rounded-md text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-.5" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          size="sm"
          className="rounded-md text-white text-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : currentStep === steps.length - 1 ? (
            'Complete'
          ) : (
            'Continue'
          )}
          <ArrowRight className="w-4 h-4 ml-.5" />
        </Button>
      </div>
    </div>
  )
}
