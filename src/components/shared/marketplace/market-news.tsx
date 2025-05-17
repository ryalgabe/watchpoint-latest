import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const newsItems = [
  {
    id: 1,
    title: 'bruh moment in coding',
    excerpt: 'hello world my first program ever wow such amazing very cool',
    time: '69 mins ago',
    category: 'Epic Dev Stuff',
  },
  {
    id: 2,
    title: 'Lorem ipsum dolor sit amet',
    excerpt:
      'consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore',
    time: '420 secs ago',
    category: 'Random Things',
  },
  {
    id: 3,
    title: 'When the code works first try',
    excerpt:
      'impossible challenge (gone wrong) (cops called) no way this happened fr fr',
    time: '1337 ms ago',
    category: 'Dev Moments',
  },
  {
    id: 4,
    title: 'CSS is my passion',
    excerpt: 'div div div div why no center pls help stack overflow',
    time: '42 light years ago',
    category: 'Pain',
  },
]

export function MarketNews() {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="p-4 space-y-4">
        {newsItems.map((item) => (
          <Card
            key={item.id}
            className="bg-[#15151E] border-[#2A2A37] p-4 hover:border-[#2E62E8] transition-all duration-300 cursor-pointer"
          >
            <Badge
              variant="secondary"
              className="mb-2 bg-[#2E62E8]/10 text-[#2E62E8] hover:bg-[#2E62E8]/20"
            >
              {item.category}
            </Badge>
            <h3 className="font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-[#878787] mb-2">{item.excerpt}</p>
            <p className="text-xs text-[#878787]">{item.time}</p>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
