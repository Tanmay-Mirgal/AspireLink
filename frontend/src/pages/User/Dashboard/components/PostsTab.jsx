import { Plus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function PostsTab({ communityPosts }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Community Posts</CardTitle>
          <CardDescription>Discussions and resources shared by the community</CardDescription>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {communityPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PostCard({ post }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={post.author} />
          <AvatarFallback>
            {post.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{post.author}</h3>
          <p className="text-xs text-muted-foreground">{post.date}</p>
        </div>
      </div>
      <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
      <p className="text-sm text-muted-foreground mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      </p>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-4 w-4" />
          <span>{post.likes} likes</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments} comments</span>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto">
          Read More
        </Button>
      </div>
    </div>
  )
}
function ThumbsUp(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    )
  }