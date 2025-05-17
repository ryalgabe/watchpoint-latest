'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Loader2, Shield, Key, AlertTriangle } from 'lucide-react'
import { useClerk } from '@clerk/nextjs'
import { deleteAccount } from '@/actions/profile'

export function SecuritySection() {
  const { openUserProfile } = useClerk()
  const [isDeleting, setIsDeleting] = useState(false)
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: true,
  })

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      const result = await deleteAccount()

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Account deleted successfully')
        // Redirect to home page or sign-in page
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="bg-[#0B0B1A]/80 backdrop-blur-lg border-[#2A2A37] p-8 rounded-2xl shadow-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#2E62E8]/10 rounded-xl">
          <Shield className="w-6 h-6 text-[#2E62E8]" />
        </div>
        <h2 className="text-2xl font-semibold">Security Settings</h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
            <div className="space-y-1">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-sm text-[#878787]">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={securitySettings.twoFactorAuth}
              onCheckedChange={(checked) =>
                setSecuritySettings({
                  ...securitySettings,
                  twoFactorAuth: checked,
                })
              }
              className="data-[state=checked]:bg-[#2E62E8]"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
            <div className="space-y-1">
              <Label className="text-base">Login Notifications</Label>
              <p className="text-sm text-[#878787]">
                Receive alerts about new sign-ins to your account
              </p>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) =>
                setSecuritySettings({
                  ...securitySettings,
                  loginNotifications: checked,
                })
              }
              className="data-[state=checked]:bg-[#2E62E8]"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#15151E]/60 rounded-xl border border-[#2A2A37]">
            <div className="space-y-1">
              <Label className="text-base">Automatic Session Timeout</Label>
              <p className="text-sm text-[#878787]">
                Automatically log out after period of inactivity
              </p>
            </div>
            <Switch
              checked={securitySettings.sessionTimeout}
              onCheckedChange={(checked) =>
                setSecuritySettings({
                  ...securitySettings,
                  sessionTimeout: checked,
                })
              }
              className="data-[state=checked]:bg-[#2E62E8]"
            />
          </div>
        </div>

        <Separator className="bg-[#2A2A37]" />

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Account Access</h3>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start border-[#2A2A37] hover:bg-[#15151E] p-4 rounded-xl h-auto"
              onClick={() => openUserProfile()}
            >
              <Key className="w-5 h-5 mr-3" />
              Change Password
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full justify-start bg-red-900/20 hover:bg-red-900/30 text-red-500 border-red-900/50 p-4 rounded-xl h-auto"
                >
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#0B0B1A] border-[#2A2A37] rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[#878787]">
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6">
                  <AlertDialogCancel className="border-[#2A2A37] hover:bg-[#15151E] hover:text-white rounded-xl">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600 rounded-xl"
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Deleting...</span>
                      </div>
                    ) : (
                      'Delete Account'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </Card>
  )
}
