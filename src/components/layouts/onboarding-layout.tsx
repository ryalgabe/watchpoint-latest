import { OnboardingForm } from '@/components/widgets/onboarding-form'
import Image from 'next/image'

export function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-[#060614] flex">
      <div className="flex-1 m-auto px-8 py-12">
        <div className="max-w-xl mx-auto">
          <OnboardingForm />
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-[#0B0B1A]">
        <div className="relative w-full aspect-[4/3] h-full rounded-2xl overflow-hidden bg-[#15151E] border border-[#2A2A37]">
          <Image
            src="/banner.jpg"
            alt="App Preview"
            className="w-full h-full object-cover"
            height={640}
            width={480}
          />
        </div>
      </div>
    </div>
  )
}
