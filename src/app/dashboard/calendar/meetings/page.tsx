"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Video, Calendar, Clock, Users, MapPin, Plus, Edit, Trash2, MoreVertical, Link as LinkIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type MeetingStatus = "Scheduled" | "Completed" | "Cancelled"

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  duration: string
  participants: Array<{ name: string; avatar?: string }>
  status: MeetingStatus
  location: string
  link?: string
  description: string
}

const DUMMY_MEETINGS: Meeting[] = [
  {
    id: "1",
    title: "Project Kickoff",
    date: "2025-10-18",
    time: "10:00 AM",
    duration: "1h 30m",
    participants: [
      { name: "Sarah Johnson" },
      { name: "Mike Chen" },
      { name: "Emily Davis" },
      { name: "Alex Rodriguez" }
    ],
    status: "Scheduled",
    location: "Conference Room A",
    link: "https://meet.company.com/kickoff",
    description: "Initial project planning and team alignment session"
  },
  {
    id: "2",
    title: "Sprint Planning",
    date: "2025-10-21",
    time: "9:00 AM",
    duration: "2h",
    participants: [
      { name: "David Kim" },
      { name: "Lisa Wong" },
      { name: "Tom Wilson" },
      { name: "Rachel Green" }
    ],
    status: "Scheduled",
    location: "Virtual - Zoom",
    link: "https://zoom.us/j/123456789",
    description: "Plan sprint tasks and set team objectives"
  },
  {
    id: "3",
    title: "Client Presentation",
    date: "2025-10-22",
    time: "2:00 PM",
    duration: "1h",
    participants: [
      { name: "Sarah Johnson" },
      { name: "Mike Chen" },
      { name: "Client Team" }
    ],
    status: "Scheduled",
    location: "Virtual - Teams",
    link: "https://teams.microsoft.com/meet",
    description: "Present Q4 progress and upcoming milestones"
  },
  {
    id: "4",
    title: "Weekly Standup",
    date: "2025-10-12",
    time: "9:30 AM",
    duration: "30m",
    participants: [
      { name: "David Kim" },
      { name: "Emily Davis" },
      { name: "Alex Rodriguez" },
      { name: "Lisa Wong" }
    ],
    status: "Completed",
    location: "Conference Room B",
    description: "Team sync-up and blocker discussion"
  },
  {
    id: "5",
    title: "Design Review",
    date: "2025-10-10",
    time: "3:00 PM",
    duration: "45m",
    participants: [
      { name: "Sarah Johnson" },
      { name: "Rachel Green" },
      { name: "Mike Chen" }
    ],
    status: "Completed",
    location: "Design Studio",
    description: "Review and approve new design mockups"
  },
  {
    id: "6",
    title: "Budget Review",
    date: "2025-10-14",
    time: "11:00 AM",
    duration: "1h",
    participants: [
      { name: "Tom Wilson" },
      { name: "Sarah Johnson" }
    ],
    status: "Cancelled",
    location: "Executive Office",
    description: "Quarterly budget review and adjustments"
  },
  {
    id: "7",
    title: "Team Building",
    date: "2025-10-25",
    time: "4:00 PM",
    duration: "2h",
    participants: [
      { name: "Sarah Johnson" },
      { name: "Mike Chen" },
      { name: "Emily Davis" },
      { name: "Alex Rodriguez" },
      { name: "David Kim" },
      { name: "Lisa Wong" }
    ],
    status: "Scheduled",
    location: "Rooftop Lounge",
    description: "Monthly team bonding and celebration"
  },
  {
    id: "8",
    title: "Tech Talk: AI Tools",
    date: "2025-10-19",
    time: "1:00 PM",
    duration: "1h",
    participants: [
      { name: "David Kim" },
      { name: "Mike Chen" },
      { name: "Tom Wilson" }
    ],
    status: "Scheduled",
    location: "Virtual - Google Meet",
    link: "https://meet.google.com/abc-defg-hij",
    description: "Learning session on latest AI development tools"
  }
]

const statusColors: Record<MeetingStatus, string> = {
  Scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-gray-100 text-gray-800 border-gray-200"
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(DUMMY_MEETINGS)
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all")
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    link: "",
    participants: "",
    description: ""
  })

  const filteredMeetings = useMemo(() => {
    const now = new Date()
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date)
      
      if (filter === "upcoming") {
        return meeting.status === "Scheduled" && meetingDate >= now
      }
      if (filter === "completed") {
        return meeting.status === "Completed"
      }
      return true
    })
  }, [meetings, filter])

  const upcomingMeetings = meetings.filter(m => m.status === "Scheduled" && new Date(m.date) >= new Date())
  const completedMeetings = meetings.filter(m => m.status === "Completed")

  const handleScheduleMeeting = () => {
    console.log("Scheduling meeting:", newMeeting)
    setScheduleDialogOpen(false)
    setNewMeeting({
      title: "",
      date: "",
      time: "",
      duration: "",
      location: "",
      link: "",
      participants: "",
      description: ""
    })
  }

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id))
  }

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setScheduleDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
            <p className="text-gray-600 mt-1">Manage and track all team meetings</p>
          </div>
          <Button onClick={() => setScheduleDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Schedule Meeting
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{meetings.length}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{upcomingMeetings.length}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedMeetings.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filter === "upcoming" ? "default" : "outline"}
                onClick={() => setFilter("upcoming")}
                size="sm"
              >
                Upcoming
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                onClick={() => setFilter("completed")}
                size="sm"
              >
                Completed
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMeetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{meeting.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={statusColors[meeting.status]}>
                          {meeting.status}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditMeeting(meeting)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteMeeting(meeting.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(meeting.date).toLocaleDateString()}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{meeting.time} ({meeting.duration})</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{meeting.location}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {meeting.participants.slice(0, 4).map((participant, idx) => (
                        <Avatar key={idx} className="w-8 h-8">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback className="text-xs">
                            {participant.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {meeting.participants.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          +{meeting.participants.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{meeting.description}</p>

                  <div className="flex gap-2 pt-2">
                    {meeting.link && meeting.status === "Scheduled" && (
                      <Button size="sm" className="gap-2 flex-1">
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </Button>
                    )}
                    {meeting.status === "Scheduled" && (
                      <Button variant="outline" size="sm" onClick={() => handleEditMeeting(meeting)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredMeetings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No meetings found</p>
              <Button onClick={() => setScheduleDialogOpen(true)} className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Schedule Your First Meeting
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Meeting</DialogTitle>
              <DialogDescription>Create a new meeting for your team</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Sprint Planning"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 1h 30m"
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Conference Room or Virtual"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Meeting Link (Optional)</Label>
                <Input
                  id="link"
                  placeholder="https://zoom.us/..."
                  value={newMeeting.link}
                  onChange={(e) => setNewMeeting({ ...newMeeting, link: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants">Participants</Label>
                <Input
                  id="participants"
                  placeholder="Comma-separated names"
                  value={newMeeting.participants}
                  onChange={(e) => setNewMeeting({ ...newMeeting, participants: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Meeting agenda and objectives"
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}