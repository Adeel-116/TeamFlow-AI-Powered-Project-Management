"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, CalendarDays, Clock, Users, MapPin } from "lucide-react"

type EventType = "Task" | "Meeting" | "Deadline"

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  type: EventType
  description?: string
  location?: string
  participants?: string[]
}

const DUMMY_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Project Kickoff Meeting",
    start: "2025-10-16T10:00:00",
    end: "2025-10-16T11:30:00",
    type: "Meeting",
    description: "Initial project planning and team alignment",
    location: "Conference Room A",
    participants: ["John Doe", "Sarah Smith", "Mike Johnson"]
  },
  {
    id: "2",
    title: "Design System Implementation",
    start: "2025-10-18T09:00:00",
    end: "2025-10-18T17:00:00",
    type: "Task",
    description: "Complete the design system setup for the new project"
  },
  {
    id: "3",
    title: "Q4 Report Submission",
    start: "2025-10-20T23:59:00",
    end: "2025-10-20T23:59:00",
    type: "Deadline",
    description: "Submit quarterly performance report to stakeholders"
  },
  {
    id: "4",
    title: "Client Presentation",
    start: "2025-10-22T14:00:00",
    end: "2025-10-22T15:30:00",
    type: "Meeting",
    description: "Present project progress to client stakeholders",
    location: "Zoom Meeting",
    participants: ["Client Team", "Project Manager", "Lead Designer"]
  },
  {
    id: "5",
    title: "Code Review Session",
    start: "2025-10-17T15:00:00",
    end: "2025-10-17T16:00:00",
    type: "Task",
    description: "Review pull requests and provide feedback"
  },
  {
    id: "6",
    title: "Sprint Planning",
    start: "2025-10-21T09:00:00",
    end: "2025-10-21T11:00:00",
    type: "Meeting",
    description: "Plan tasks for the upcoming sprint",
    location: "Team Room",
    participants: ["Dev Team", "Scrum Master", "Product Owner"]
  },
  {
    id: "7",
    title: "Beta Launch",
    start: "2025-10-25T00:00:00",
    end: "2025-10-25T23:59:00",
    type: "Deadline",
    description: "Official beta release to select users"
  },
  {
    id: "8",
    title: "API Integration",
    start: "2025-10-19T10:00:00",
    end: "2025-10-19T18:00:00",
    type: "Task",
    description: "Integrate third-party APIs for payment and analytics"
  }
]

const eventTypeColors: Record<EventType, { bg: string; border: string; text: string }> = {
  Task: { bg: "#3b82f6", border: "#2563eb", text: "#1e40af" },
  Meeting: { bg: "#10b981", border: "#059669", text: "#047857" },
  Deadline: { bg: "#ef4444", border: "#dc2626", text: "#b91c1c" }
}

export default function CalendarPage() {
  const [view, setView] = useState<"dayGridMonth" | "timeGridWeek" | "timeGridDay">("dayGridMonth")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false)
  const [calendarApi, setCalendarApi] = useState<any>(null)
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    type: "Task" as EventType,
    description: "",
    location: "",
    participants: ""
  })

  const handleEventClick = (info: any) => {
    const event = DUMMY_EVENTS.find(e => e.id === info.event.id)
    if (event) {
      setSelectedEvent(event)
      setDetailsDialogOpen(true)
    }
  }

  const handlePrevMonth = () => {
    if (calendarApi) {
      calendarApi.prev()
    }
  }

  const handleNextMonth = () => {
    if (calendarApi) {
      calendarApi.next()
    }
  }

  const handleToday = () => {
    if (calendarApi) {
      calendarApi.today()
    }
  }

  const handleAddEvent = () => {
    console.log("Adding event:", newEvent)
    setAddEventDialogOpen(false)
    setNewEvent({
      title: "",
      start: "",
      end: "",
      type: "Task",
      description: "",
      location: "",
      participants: ""
    })
  }

  const calendarEvents = DUMMY_EVENTS.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    backgroundColor: eventTypeColors[event.type].bg,
    borderColor: eventTypeColors[event.type].border
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-1">Manage your tasks, meetings, and deadlines</p>
          </div>
          <Button onClick={() => setAddEventDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={view === "dayGridMonth" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("dayGridMonth")}
                >
                  Month
                </Button>
                <Button
                  variant={view === "timeGridWeek" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("timeGridWeek")}
                >
                  Week
                </Button>
                <Button
                  variant={view === "timeGridDay" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("timeGridDay")}
                >
                  Day
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Task</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Meeting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600">Deadline</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={view}
              headerToolbar={false}
              events={calendarEvents}
              eventClick={handleEventClick}
              height="auto"
              ref={(ref:any) => {
                if (ref) {
                  setCalendarApi(ref.getApi())
                }
              }}
              views={{
                dayGridMonth: { type: 'dayGridMonth' },
                timeGridWeek: { type: 'timeGridWeek' },
                timeGridDay: { type: 'timeGridDay' }
              }}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              allDaySlot={true}
            />
          </CardContent>
        </Card>

        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedEvent?.title}
              </DialogTitle>
              <DialogDescription>Event Details</DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 py-4"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    style={{
                      backgroundColor: `${eventTypeColors[selectedEvent.type].bg}20`,
                      color: eventTypeColors[selectedEvent.type].text,
                      borderColor: eventTypeColors[selectedEvent.type].border
                    }}
                  >
                    {selectedEvent.type}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date & Time</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedEvent.start).toLocaleString()}
                      </p>
                      {selectedEvent.end && selectedEvent.start !== selectedEvent.end && (
                        <p className="text-sm text-gray-600">
                          to {new Date(selectedEvent.end).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Participants</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedEvent.participants.map((participant, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedEvent.description && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                      <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                Close
              </Button>
              <Button>Edit Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={addEventDialogOpen} onOpenChange={setAddEventDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>Create a new task, meeting, or deadline</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newEvent.type} onValueChange={(value: EventType) => setNewEvent({ ...newEvent, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Task">Task</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Start Date</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">End Date</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  />
                </div>
              </div>

              {newEvent.type === "Meeting" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Meeting location or link"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participants">Participants</Label>
                    <Input
                      id="participants"
                      placeholder="Comma-separated names"
                      value={newEvent.participants}
                      onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Event description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddEventDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}