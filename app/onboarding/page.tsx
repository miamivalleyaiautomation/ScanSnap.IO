'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserProfile } from '@/hooks/useUserProfile'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function OnboardingPage() {
  const router = useRouter()
  const { userProfile, updateProfile } = useUserProfile()
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState({
    primaryUseCase: '',
    documentTypes: [] as string[],
    notificationSettings: {
      scanComplete: true,
      weeklyReports: false,
      productUpdates: true
    }
  })

  const useCases = [
    { id: 'business', label: 'Business Documents', description: 'Receipts, invoices, contracts' },
    { id: 'personal', label: 'Personal Files', description: 'Tax documents, medical records' },
    { id: 'academic', label: 'Academic Papers', description: 'Research, notes, textbooks' },
    { id: 'legal', label: 'Legal Documents', description: 'Contracts, forms, court papers' }
  ]

  const documentTypes = [
    'Receipts & Invoices',
    'Contracts & Agreements',
    'Medical Records',
    'Tax Documents',
    'Academic Papers',
    'Business Cards',
    'Forms & Applications',
    'Handwritten Notes'
  ]

  const handleUseCaseSelect = (useCase: string) => {
    setPreferences(prev => ({ ...prev, primaryUseCase: useCase }))
    setStep(2)
  }

  const handleDocumentTypeToggle = (docType: string) => {
    setPreferences(prev => ({
      ...prev,
      documentTypes: prev.documentTypes.includes(docType)
        ? prev.documentTypes.filter(t => t !== docType)
        : [...prev.documentTypes, docType]
    }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [key]: value
      }
    }))
  }

  const handleComplete = async () => {
    try {
      await updateProfile({
        onboarding_completed: true,
        // You could store preferences in a JSON column or separate table
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  if (userProfile?.onboarding_completed) {
    router.push('/dashboard')
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to ScanSnap
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let's set up your account in {step}/3 steps
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= i
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {i}
                    </div>
                    {i < 3 && (
                      <div
                        className={`flex-1 h-1 ml-4 ${
                          step > i ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Primary Use Case */}
            {step === 1 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  What will you primarily use ScanSnap for?
                </h3>
                <div className="space-y-3">
                  {useCases.map((useCase) => (
                    <button
                      key={useCase.id}
                      onClick={() => handleUseCaseSelect(useCase.id)}
                      className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{useCase.label}</div>
                      <div className="text-sm text-gray-500">{useCase.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Document Types */}
            {step === 2 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  What types of documents will you scan? (Select all that apply)
                </h3>
                <div className="space-y-2">
                  {documentTypes.map((docType) => (
                    <label key={docType} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={preferences.documentTypes.includes(docType)}
                        onChange={() => handleDocumentTypeToggle(docType)}
                      />
                      <span className="ml-3 text-sm text-gray-700">{docType}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Notifications */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Scan Complete Notifications
                      </span>
                      <p className="text-xs text-gray-500">
                        Get notified when your scans are processed
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={preferences.notificationSettings.scanComplete}
                      onChange={(e) => handleNotificationChange('scanComplete', e.target.checked)}
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Weekly Usage Reports
                      </span>
                      <p className="text-xs text-gray-500">
                        Weekly summary of your scanning activity
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={preferences.notificationSettings.weeklyReports}
                      onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Product Updates
                      </span>
                      <p className="text-xs text-gray-500">
                        New features and improvements
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={preferences.notificationSettings.productUpdates}
                      onChange={(e) => handleNotificationChange('productUpdates', e.target.checked)}
                    />
                  </label>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Complete Setup
                  </button>
                </div>
              </div>
            )}

            {/* Skip Option */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip setup for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}