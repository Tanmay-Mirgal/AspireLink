import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ConnectionsTab({ assignedMentors }) {
  return (
    <>
      <NetworkOverviewCards mentorsCount={assignedMentors.length} />
      <ConnectionRequestsCard />
    </>
  )
}

function NetworkOverviewCards({ mentorsCount }) {
  // Sample data for peers and industry professionals
  const peersCount = 12
  const professionalsCount = 5

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Network</CardTitle>
        <CardDescription>Connect with mentors, peers, and industry professionals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <NetworkCard 
            title="Mentors" 
            description="Your assigned mentors" 
            count={mentorsCount} 
            buttonText="View Mentors" 
          />
          <NetworkCard 
            title="Peers" 
            description="Fellow students" 
            count={peersCount} 
            buttonText="View Peers" 
          />
          <NetworkCard 
            title="Industry" 
            description="Professional connections" 
            count={professionalsCount} 
            buttonText="View Professionals" 
          />
        </div>
      </CardContent>
    </Card>
  )
}

function NetworkCard({ title, description, count, buttonText }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count}</div>
        <p className="text-sm text-muted-foreground">Active connections</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

function ConnectionRequestsCard() {
  // Sample connection requests data
  const connectionRequests = [
    {
      id: 1,
      name: "Jane Smith",
      role: "UX Designer at TechCorp",
      initials: "JS"
    },
    {
      id: 2,
      name: "Robert Lee",
      role: "Senior Developer at WebSolutions",
      initials: "RL"
    },
    {
      id: 3,
      name: "Sophia Chen",
      role: "Frontend Developer at StartupX",
      initials: "SC"
    }
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Connection Requests</CardTitle>
          <CardDescription>Pending connection requests</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Find Connections
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connectionRequests.map((request, index) => (
            <div 
              key={request.id} 
              className={`flex items-center justify-between ${
                index < connectionRequests.length - 1 ? "border-b pb-4" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={request.name} />
                  <AvatarFallback>{request.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{request.name}</h3>
                  <p className="text-sm text-muted-foreground">{request.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Ignore
                </Button>
                <Button size="sm">Accept</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}