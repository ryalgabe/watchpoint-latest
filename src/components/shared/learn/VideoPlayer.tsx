import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react'
import Image from 'next/image'
interface VideoPlayerProps {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  isMuted: boolean
  setIsMuted: (muted: boolean) => void
  progress: number
}

export function VideoPlayer({
  isPlaying,
  setIsPlaying,
  isMuted,
  setIsMuted,
  progress,
}: VideoPlayerProps) {
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#2A2A37]/50 shadow-2xl">
      <Image
        src="/placeholder.svg?height=600&width=1200"
        alt="Video Thumbnail"
        className="w-full h-full object-cover"
        width={1200}
        height={600}
      />

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <Button
          size="icon"
          className="w-20 h-20 rounded-full bg-[#2E62E8] hover:bg-[#2E62E8]/90 hover:scale-105 transition-all duration-200 shadow-lg"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="w-10 h-10" />
          ) : (
            <Play className="w-10 h-10 ml-1" />
          )}
        </Button>
      </div>

      <VideoControls
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        progress={progress}
      />
    </div>
  )
}

function VideoControls({
  isPlaying,
  setIsPlaying,
  isMuted,
  setIsMuted,
  progress,
}: VideoPlayerProps) {
  return (
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
      <Progress value={progress} className="h-1.5 mb-4 bg-white/20" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/20 transition-colors rounded-lg"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-1" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/20 transition-colors rounded-lg"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
          <span className="text-sm font-medium">3:06</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/20 transition-colors rounded-lg"
        >
          <Maximize2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
