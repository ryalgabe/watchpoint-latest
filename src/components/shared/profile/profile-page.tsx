'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import {
  Loader2,
  Save,
  LogOut,
  Bell,
  CreditCard,
  User,
  Settings,
  CheckCircle2,
} from 'lucide-react'
import { useUser, useClerk } from '@clerk/nextjs'
import { updateProfile, updateOnboardingPreferences } from '@/actions/profile'
import { ProfileSidebar } from '@/components/shared/profile/profile-sidebar'
import { MobileNavigation } from '@/components/shared/profile/profile-mobile-nav'
import { SecuritySection } from '@/components/shared/profile/security-section'
import {
  experienceLevels,
  watchBrands,
  watchCollections,
} from '@/constants/content/onboarding'

export function ProfilePage() {
  const router = useRouter()
  const { user, isLoaded: isUserLoaded } = useUser()
  const { signOut } = useClerk()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    username: '',
    email: '',
    imageUrl: '',
  })

  // Onboarding preferences state
  const [preferencesForm, setPreferencesForm] = useState({
    experience: '',
    budget: [50000],
    collections: [] as string[],
    preferredBrands: [] as string[],
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    marketAlerts: true,
    priceDrops: true,
    newListings: false,
    weeklyDigest: true,
  })

  // Subscription status
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isPremium: false,
    plan: 'Free',
    nextBillingDate: '',
  })

  // Add editing state
  const [isEditing, setIsEditing] = useState(false)

  // Load user data
  useEffect(() => {
    if (isUserLoaded && user) {
      // Set profile data
      setProfileForm({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        imageUrl: user.imageUrl || '',
      })

      // Set preferences data from metadata
      const metadata = user.publicMetadata
      setPreferencesForm({
        experience: (metadata.experience as string) || '',
        budget: [Number(metadata.priceRange) || 50000],
        collections: ((metadata.collections as string) || '')
          .split(', ')
          .filter(Boolean),
        preferredBrands: (metadata.preferredBrands as string[]) || [],
      })

      setSubscriptionStatus({
        isPremium: (metadata.isPremium as boolean) || false,
        plan: (metadata.isPremium as boolean) ? 'Premium' : 'Free',
        nextBillingDate: (metadata.nextBillingDate as string) || 'N/A',
      })

      setIsLoading(false)
    }
  }, [isUserLoaded, user])

  const handleProfileSave = async () => {
    if (!user) return

    try {
      setIsSaving(true)

      // Validate form data
      if (!profileForm.fullName.trim()) {
        toast.error('Full name is required')
        return
      }

      if (!profileForm.username.trim()) {
        toast.error('Username is required')
        return
      }

      // Update profile in Clerk and database
      const result = await updateProfile({
        userId: user.id,
        fullName: profileForm.fullName,
        username: profileForm.username,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreferencesSave = async () => {
    if (!user) return

    try {
      setIsSaving(true)

      // Validate form data
      if (!preferencesForm.experience) {
        toast.error('Please select your experience level')
        return
      }

      const result = await updateOnboardingPreferences({
        userId: user.id,
        experience: preferencesForm.experience,
        priceRange: preferencesForm.budget[0].toString(),
        collections: preferencesForm.collections,
        preferredBrands: preferencesForm.preferredBrands,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Preferences updated successfully')
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast.error('Failed to update preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNotificationsSave = async () => {
    try {
      setIsSaving(true)
      // Here you would implement the server action to save notification settings
      // For now, we'll just simulate a successful save
      setTimeout(() => {
        toast.success('Notification settings updated successfully')
        setIsSaving(false)
      }, 1000)
    } catch (error) {
      console.error('Error updating notification settings:', error)
      toast.error('Failed to update notification settings')
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060614] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 text-[#2E62E8] animate-spin" />
          <p className="text-[#878787] font-medium">Loading your profile...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060614] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <MobileNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <div>
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Account Settings
                </h1>
                <p className="text-[#878787] text-lg">
                  Manage your profile and preferences
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-[#2A2A37] hover:bg-[#15151E] hidden md:flex items-center gap-2 px-6 py-3 text-base font-medium transition-all duration-200 hover:scale-105"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-5">
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {activeTab === 'profile' && (
                    <Card className="bg-[#0B0B1A]/80 backdrop-blur-lg border-[#2A2A37] p-8 rounded-xl shadow-xl">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-[#2E62E8]/10 rounded-xl">
                          <User className="w-6 h-6 text-[#2E62E8]" />
                        </div>
                        <h2 className="text-2xl font-semibold">
                          Profile Information
                        </h2>
                      </div>

                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <Label htmlFor="fullName" className="text-base">
                              Full Name
                            </Label>
                            <Input
                              id="fullName"
                              value={profileForm.fullName}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  fullName: e.target.value,
                                })
                              }
                              className="bg-[#15151E]/60 border-[#2A2A37] focus-visible:ring-[#2E62E8] focus-visible:ring-offset-[#060614] h-12 text-base"
                              placeholder="Enter your full name"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="username" className="text-base">
                              Username
                            </Label>
                            <Input
                              id="username"
                              value={profileForm.username}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  username: e.target.value,
                                })
                              }
                              className="bg-[#15151E]/60 border-[#2A2A37] focus-visible:ring-[#2E62E8] focus-visible:ring-offset-[#060614] h-12 text-base"
                              placeholder="Choose a username"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="email" className="text-base">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            value={profileForm.email}
                            disabled
                            className="bg-[#15151E]/60 border-[#2A2A37] focus-visible:ring-[#2E62E8] focus-visible:ring-offset-[#060614] h-12 text-base opacity-70"
                          />
                          <p className="text-sm text-[#878787]">
                            Email can't be changed in your profile settings
                          </p>
                        </div>

                        <div className="pt-4">
                          <Button
                            onClick={handleProfileSave}
                            disabled={isSaving}
                            className="bg-[#2E62E8] hover:bg-[#2E62E8]/90 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                          >
                            {isSaving ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Saving Changes...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'preferences' && (
                    <Card className="bg-[#0B0B1A]/80 backdrop-blur-lg border-[#2A2A37] p-8 rounded-2xl shadow-xl">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-[#2E62E8]/10 rounded-xl">
                            <Settings className="w-6 h-6 text-[#2E62E8]" />
                          </div>
                          <h2 className="text-xl font-semibold">
                            Investment Preferences
                          </h2>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(!isEditing)}
                          className="border-[#2A2A37] hover:bg-[#15151E] px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                        >
                          {isEditing ? 'Cancel' : 'Edit Preferences'}
                        </Button>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3">
                          <Label className="text-md font-medium">
                            Experience Level
                          </Label>
                          {isEditing ? (
                            <RadioGroup
                              value={preferencesForm.experience}
                              onValueChange={(value) =>
                                setPreferencesForm({
                                  ...preferencesForm,
                                  experience: value,
                                })
                              }
                              className="grid grid-cols-3 gap-4"
                            >
                              {experienceLevels.map((level) => (
                                <div key={level} className="relative">
                                  <RadioGroupItem
                                    value={level}
                                    id={level}
                                    className="peer sr-only"
                                  />
                                  <Label
                                    htmlFor={level}
                                    className="flex items-center justify-center p-4 rounded-xl border-2 border-[#2A2A37] bg-[#15151E]/60 hover:bg-[#2E62E8]/10 hover:border-[#2E62E8] peer-data-[state=checked]:border-[#2E62E8] peer-data-[state=checked]:bg-[#2E62E8]/10 cursor-pointer transition-all duration-200"
                                  >
                                    {level}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          ) : (
                            <div className="p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
                              <span className="text-sm font-medium">
                                {preferencesForm.experience || 'Not set'}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <Label className="text-md font-medium">
                            Investment Budget
                          </Label>
                          {isEditing ? (
                            <div className="space-y-6">
                              <Slider
                                value={preferencesForm.budget}
                                onValueChange={(value) =>
                                  setPreferencesForm({
                                    ...preferencesForm,
                                    budget: value,
                                  })
                                }
                                max={200000}
                                step={1000}
                                className="[&_[role=slider]]:bg-[#2E62E8]"
                              />
                              <p className="text-[#878787] text-sm font-medium">
                                €{preferencesForm.budget[0].toLocaleString()}
                              </p>
                            </div>
                          ) : (
                            <div className="p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
                              <span className="text-sm font-medium">
                                €{preferencesForm.budget[0].toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <Label className="text-md font-medium">
                            Watch Collections
                          </Label>
                          {isEditing ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {watchCollections.map((collection) => (
                                <Button
                                  key={collection}
                                  variant="outline"
                                  className={`justify-start h-auto p-4 rounded-xl transition-all duration-200 ${
                                    preferencesForm.collections.includes(
                                      collection
                                    )
                                      ? 'border-[#2E62E8] bg-[#2E62E8]/10 text-white'
                                      : 'border-[#2A2A37] hover:bg-[#15151E] hover:border-[#2E62E8]'
                                  }`}
                                  onClick={() =>
                                    setPreferencesForm({
                                      ...preferencesForm,
                                      collections:
                                        preferencesForm.collections.includes(
                                          collection
                                        )
                                          ? preferencesForm.collections.filter(
                                              (c) => c !== collection
                                            )
                                          : [
                                              ...preferencesForm.collections,
                                              collection,
                                            ],
                                    })
                                  }
                                >
                                  <CheckCircle2
                                    className={`w-5 h-5 mr-2 transition-opacity ${
                                      preferencesForm.collections.includes(
                                        collection
                                      )
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    }`}
                                  />
                                  {collection}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
                              {preferencesForm.collections.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {preferencesForm.collections.map(
                                    (collection) => (
                                      <Badge
                                        key={collection}
                                        className="bg-[#2E62E8]/10 text-[#2E62E8] border border-[#2E62E8]/30 px-3 py-1 rounded-lg text-sm"
                                      >
                                        {collection}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-[#878787] text-sm">
                                  No collections selected
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <Label className="text-md font-medium">
                            Preferred Brands
                          </Label>
                          {isEditing ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {watchBrands.map((brand) => (
                                <Button
                                  key={brand}
                                  variant="outline"
                                  className={`justify-start h-auto p-4 rounded-xl transition-all duration-200 ${
                                    preferencesForm.preferredBrands.includes(
                                      brand
                                    )
                                      ? 'border-[#2E62E8] bg-[#2E62E8]/10 text-white hover:bg-[#2E62E8]/10'
                                      : 'border-[#2A2A37] hover:bg-[#15151E] hover:border-[#2E62E8]'
                                  }`}
                                  onClick={() =>
                                    setPreferencesForm({
                                      ...preferencesForm,
                                      preferredBrands:
                                        preferencesForm.preferredBrands.includes(
                                          brand
                                        )
                                          ? preferencesForm.preferredBrands.filter(
                                              (b) => b !== brand
                                            )
                                          : [
                                              ...preferencesForm.preferredBrands,
                                              brand,
                                            ],
                                    })
                                  }
                                >
                                  <CheckCircle2
                                    className={`w-5 h-5 mr-2 transition-opacity ${
                                      preferencesForm.preferredBrands.includes(
                                        brand
                                      )
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    }`}
                                  />
                                  {brand}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
                              {preferencesForm.preferredBrands.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {preferencesForm.preferredBrands.map(
                                    (brand) => (
                                      <Badge
                                        key={brand}
                                        className="bg-[#2E62E8]/10 text-[#2E62E8] hover:bg-[#2E62E8]/10 border border-[#2E62E8]/30 px-3 py-1 rounded-lg text-sm"
                                      >
                                        {brand}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-[#878787] text-sm">
                                  No brands selected
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {isEditing && (
                          <Button
                            onClick={handlePreferencesSave}
                            disabled={isSaving}
                            className="w-full text-white px-8 py-3 rounded-xl font-medium"
                          >
                            {isSaving ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Saving Changes...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                              </div>
                            )}
                          </Button>
                        )}
                      </div>
                    </Card>
                  )}

                  {activeTab === 'notifications' && (
                    <Card className="bg-[#0B0B1A]/80 backdrop-blur-lg border-[#2A2A37] p-8 rounded-2xl shadow-xl">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-[#2E62E8]/10 rounded-xl">
                          <Bell className="w-6 h-6 text-[#2E62E8]" />
                        </div>
                        <h2 className="text-2xl font-semibold">
                          Notification Preferences
                        </h2>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
                          <div className="space-y-1">
                            <Label className="text-lg">
                              Email Notifications
                            </Label>
                            <p className="text-[#878787] text-sm">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: checked,
                              })
                            }
                            className="data-[state=checked]:bg-[#2E62E8]"
                          />
                        </div>

                        <Separator className="bg-[#2A2A37]" />

                        <div className="space-y-3">
                          <h3 className="text-md font-medium">Alert Types</h3>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
                              <div className="space-y-1">
                                <Label className="text-base">
                                  Market Alerts
                                </Label>
                                <p className="text-sm text-[#878787]">
                                  Important market changes and trends
                                </p>
                              </div>
                              <Switch
                                checked={notificationSettings.marketAlerts}
                                onCheckedChange={(checked) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    marketAlerts: checked,
                                  })
                                }
                                className="data-[state=checked]:bg-[#2E62E8]"
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
                              <div className="space-y-1">
                                <Label className="text-base">Price Drops</Label>
                                <p className="text-sm text-[#878787]">
                                  Alerts when watch prices drop significantly
                                </p>
                              </div>
                              <Switch
                                checked={notificationSettings.priceDrops}
                                onCheckedChange={(checked) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    priceDrops: checked,
                                  })
                                }
                                className="data-[state=checked]:bg-[#2E62E8]"
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
                              <div className="space-y-1">
                                <Label className="text-base">
                                  New Listings
                                </Label>
                                <p className="text-sm text-[#878787]">
                                  Notifications about new watches for sale
                                </p>
                              </div>
                              <Switch
                                checked={notificationSettings.newListings}
                                onCheckedChange={(checked) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    newListings: checked,
                                  })
                                }
                                className="data-[state=checked]:bg-[#2E62E8]"
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
                              <div className="space-y-1">
                                <Label className="text-base">
                                  Weekly Digest
                                </Label>
                                <p className="text-sm text-[#878787]">
                                  Weekly summary of market activity
                                </p>
                              </div>
                              <Switch
                                checked={notificationSettings.weeklyDigest}
                                onCheckedChange={(checked) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    weeklyDigest: checked,
                                  })
                                }
                                className="data-[state=checked]:bg-[#2E62E8]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-6">
                          <Button
                            onClick={handleNotificationsSave}
                            disabled={isSaving}
                            className="w-full bg-[#2E62E8] hover:bg-[#2E62E8]/90 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                          >
                            {isSaving ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Saving Changes...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'subscription' && (
                    <Card className="bg-[#0B0B1A]/80 backdrop-blur-lg border-[#2A2A37] p-8 rounded-2xl shadow-xl">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-[#2E62E8]/10 rounded-xl">
                          <CreditCard className="w-6 h-6 text-[#2E62E8]" />
                        </div>
                        <h2 className="text-xl font-semibold">
                          Subscription Management
                        </h2>
                      </div>

                      <div className="space-y-8">
                        <div className="bg-[#15151E]/60 border border-[#2A2A37] rounded-xl p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">
                              Current Plan
                            </h3>
                            <Badge
                              className={
                                subscriptionStatus.isPremium
                                  ? 'bg-[#2E62E8]/10 text-[#2E62E8] hover:bg-[#2E62E8]/10 border border-[#2E62E8]/30 px-3 py-1 rounded-lg'
                                  : 'bg-[#15151E] border-[#2A2A37] text-white px-3 py-1 rounded-lg'
                              }
                            >
                              {subscriptionStatus.plan}
                            </Badge>
                          </div>

                          {subscriptionStatus.isPremium ? (
                            <div className="space-y-4">
                              <p className="text-[#878787] text-sm">
                                You are currently on the Premium plan with
                                access to all features.
                              </p>
                              <div className="flex items-center justify-between text-sm p-3 bg-[#15151E]/80 rounded-lg">
                                <span className="text-[#878787]">
                                  Next billing date
                                </span>
                                <span className="font-medium">
                                  {subscriptionStatus.nextBillingDate || 'N/A'}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                className="w-full border-[#2A2A37] hover:bg-[#15151E] rounded-xl py-3 transition-all duration-200 hover:scale-105"
                              >
                                Manage Subscription
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <p className="text-[#878787] text-sm">
                                You are currently on the Free plan with limited
                                features.
                              </p>
                              <Button className="w-full bg-[#2E62E8] hover:bg-[#2E62E8]/90 rounded-xl py-3 transition-all duration-200 hover:scale-105">
                                Upgrade to Premium
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="bg-[#15151E]/60 border-[#2A2A37] p-6 rounded-xl">
                            <h3 className="font-semibold text-lg mb-4">
                              Free Plan
                            </h3>
                            <ul className="space-y-3 text-[#878787] mb-6 text-sm">
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>Basic market insights</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>Limited watch tracking</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>Community access</span>
                              </li>
                            </ul>
                            <div className="pt-4 border-t border-[#2A2A37]">
                              <p className="font-semibold text-sm mb-4">
                                €0 / month
                              </p>
                              <Button
                                variant="outline"
                                className="w-full border-[#2A2A37] hover:bg-[#15151E] rounded-xl py-3"
                                disabled
                              >
                                Current Plan
                              </Button>
                            </div>
                          </Card>

                          <Card className="bg-[#15151E]/60 border-[#2A2A37] p-6 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-[#2E62E8] text-white text-xs font-semibold py-1 px-3 rounded-bl-lg">
                              RECOMMENDED
                            </div>
                            <h3 className="font-semibold text-lg mb-4">
                              Premium Plan
                            </h3>
                            <ul className="space-y-3 text-[#878787] mb-6 text-sm">
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>Advanced market analytics</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>Unlimited watch tracking</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>Price alerts and notifications</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>Expert investment advice</span>
                              </li>
                            </ul>
                            <div className="pt-4 border-t border-[#2A2A37]">
                              <p className="font-semibold text-sm mb-4">
                                €19.99 / month
                              </p>
                              <Button className="w-full bg-[#2E62E8] hover:bg-[#2E62E8]/90 rounded-xl py-3 transition-all duration-200 hover:scale-105">
                                Upgrade Now
                              </Button>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'security' && <SecuritySection />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
