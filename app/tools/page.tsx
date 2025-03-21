"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  Calendar,
  Clock,
  Sparkles,
  Palette,
  ImageIcon,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import NoiseTexture from "@/components/noise-texture"
import AppLayout from "@/components/layouts/app-layout"

export default function ToolsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("post-generator")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [postText, setPostText] = useState("")
  const [postPrompt, setPostPrompt] = useState("")
  const [platform, setPlatform] = useState("instagram")
  const [tone, setTone] = useState("professional")
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [postLength, setPostLength] = useState([50])

  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [scheduledPlatforms, setScheduledPlatforms] = useState<string[]>([])

  const [colorPalette, setColorPalette] = useState<string[]>(["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"])

  const handleGeneratePost = async () => {
    if (!postPrompt.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a prompt for your post.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate sample post based on platform
    let generatedPost = ""

    if (platform === "instagram") {
      generatedPost = `✨ ${postPrompt}\n\nThis is a professionally crafted Instagram post about ${postPrompt}. The content is engaging and visually descriptive.${includeHashtags ? "\n\n#instagram #social #media #marketing #content" : ""} ${includeEmojis ? "📸 🔥 💯" : ""}`
    } else if (platform === "twitter") {
      generatedPost = `${postPrompt} - a concise and impactful message for Twitter. ${includeHashtags ? "#twitter #social #trending" : ""} ${includeEmojis ? "🐦 💬" : ""}`
    } else if (platform === "facebook") {
      generatedPost = `${postPrompt}\n\nThis is a thoughtful Facebook post about ${postPrompt} that encourages engagement and discussion. ${includeEmojis ? "👍 💬 ❤️" : ""}`
    } else if (platform === "linkedin") {
      generatedPost = `I'm excited to share some thoughts on ${postPrompt}.\n\nThis is a professional LinkedIn post that demonstrates industry expertise and thought leadership on the topic of ${postPrompt}. ${includeHashtags ? "\n\n#professional #networking #business #growth" : ""}`
    }

    // Adjust length based on slider
    const targetLength = postLength[0]
    if (generatedPost.length > targetLength) {
      generatedPost = generatedPost.substring(0, targetLength) + "..."
    }

    setPostText(generatedPost)
    setIsGenerating(false)

    toast({
      title: "Post generated",
      description: "Your social media post has been created.",
    })
  }

  const handleCopyPost = () => {
    navigator.clipboard.writeText(postText)
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: "Your post has been copied to the clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const handleSchedulePost = () => {
    if (!scheduledDate || !scheduledTime || scheduledPlatforms.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select a date, time, and at least one platform.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Post scheduled",
      description: `Your post has been scheduled for ${scheduledDate} at ${scheduledTime}.`,
    })
  }

  const togglePlatform = (platform: string) => {
    setScheduledPlatforms((prev) => {
      // Create a new array to avoid reference issues
      return prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    })
  }

  const generateColorPalette = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate random colors
    const newPalette = Array(5)
      .fill(0)
      .map(() => {
        return `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
      })

    setColorPalette(newPalette)

    toast({
      title: "Palette generated",
      description: "Your color palette has been created.",
    })
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)

    toast({
      title: "Color copied",
      description: `${color} has been copied to the clipboard.`,
    })
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
        <NoiseTexture opacity={0.03} />

        <div className="container mx-auto px-4 py-8 pb-24">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8"
          >
            Social Media Tools
          </motion.h1>

          <Tabs defaultValue="post-generator" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="post-generator">Post Generator</TabsTrigger>
              <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
              <TabsTrigger value="design-tools">Design Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="post-generator" className="space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Social Media Post Generator</CardTitle>
                  <CardDescription>Create engaging posts for your social media platforms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="instagram">
                          <div className="flex items-center">
                            <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                            Instagram
                          </div>
                        </SelectItem>
                        <SelectItem value="twitter">
                          <div className="flex items-center">
                            <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                            Twitter
                          </div>
                        </SelectItem>
                        <SelectItem value="facebook">
                          <div className="flex items-center">
                            <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                            Facebook
                          </div>
                        </SelectItem>
                        <SelectItem value="linkedin">
                          <div className="flex items-center">
                            <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                            LinkedIn
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt">What's your post about?</Label>
                    <Textarea
                      id="prompt"
                      value={postPrompt}
                      onChange={(e) => setPostPrompt(e.target.value)}
                      placeholder="Enter a topic or prompt for your post..."
                      className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="informative">Informative</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="post-length" className="text-sm">
                        Post Length
                      </Label>
                      <span className="text-xs text-zinc-400">{postLength[0]} characters</span>
                    </div>
                    <Slider
                      id="post-length"
                      value={postLength}
                      onValueChange={setPostLength}
                      max={280}
                      min={10}
                      step={10}
                      className="py-2"
                    />
                  </div>

                  <div className="flex flex-col space-y-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="hashtags" checked={includeHashtags} onCheckedChange={setIncludeHashtags} />
                      <Label htmlFor="hashtags">Include hashtags</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="emojis" checked={includeEmojis} onCheckedChange={setIncludeEmojis} />
                      <Label htmlFor="emojis">Include emojis</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={handleGeneratePost}
                    disabled={isGenerating || !postPrompt.trim()}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Post
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {postText && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Generated Post</CardTitle>
                    <CardDescription>Your social media post is ready to use</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-zinc-800 rounded-md p-4 whitespace-pre-line">{postText}</div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={handleCopyPost}
                      className="border-zinc-700 hover:bg-zinc-800 transition-all duration-200"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="scheduler" className="space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Post Scheduler</CardTitle>
                  <CardDescription>Schedule your posts for optimal engagement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-content">Post Content</Label>
                    <Textarea
                      id="post-content"
                      placeholder="Enter your post content..."
                      className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Platforms</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className={`flex items-center justify-start border-zinc-700 ${scheduledPlatforms.includes("instagram") ? "bg-pink-500/20 border-pink-500/50 text-pink-200" : "hover:bg-zinc-800"}`}
                        onClick={() => togglePlatform("instagram")}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className={`flex items-center justify-start border-zinc-700 ${scheduledPlatforms.includes("twitter") ? "bg-blue-500/20 border-blue-500/50 text-blue-200" : "hover:bg-zinc-800"}`}
                        onClick={() => togglePlatform("twitter")}
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className={`flex items-center justify-start border-zinc-700 ${scheduledPlatforms.includes("facebook") ? "bg-blue-600/20 border-blue-600/50 text-blue-200" : "hover:bg-zinc-800"}`}
                        onClick={() => togglePlatform("facebook")}
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className={`flex items-center justify-start border-zinc-700 ${scheduledPlatforms.includes("linkedin") ? "bg-blue-700/20 border-blue-700/50 text-blue-200" : "hover:bg-zinc-800"}`}
                        onClick={() => togglePlatform("linkedin")}
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-sm text-zinc-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Best times: 9AM, 12PM, 6PM</span>
                  </div>
                  <Button onClick={handleSchedulePost} className="transition-all duration-200 hover:scale-105">
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule Post
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Scheduled Posts</CardTitle>
                  <CardDescription>View and manage your upcoming posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-zinc-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No posts scheduled yet</p>
                    <p className="text-sm mt-2">Schedule your first post above</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design-tools" className="space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Color Palette Generator</CardTitle>
                  <CardDescription>Create harmonious color schemes for your social media</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-5 gap-2 h-20">
                    {colorPalette.map((color, index) => (
                      <div
                        key={index}
                        className="rounded-md cursor-pointer transition-all duration-200 hover:scale-105 relative group"
                        style={{ backgroundColor: color }}
                        onClick={() => copyColor(color)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded-md transition-opacity">
                          <Copy className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={generateColorPalette}
                      className="border-zinc-700 hover:bg-zinc-800 transition-all duration-200"
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      Generate New Palette
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Image Dimensions</CardTitle>
                  <CardDescription>Recommended sizes for social media platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center">
                        <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                        <span>Instagram Post</span>
                      </div>
                      <span className="text-zinc-400">1080 x 1080px</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center">
                        <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                        <span>Instagram Story</span>
                      </div>
                      <span className="text-zinc-400">1080 x 1920px</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center">
                        <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                        <span>Twitter Post</span>
                      </div>
                      <span className="text-zinc-400">1200 x 675px</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center">
                        <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Facebook Post</span>
                      </div>
                      <span className="text-zinc-400">1200 x 630px</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                        <span>LinkedIn Post</span>
                      </div>
                      <span className="text-zinc-400">1200 x 627px</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="text-violet-400 hover:text-violet-300 transition-colors p-0">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Download Templates
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}

