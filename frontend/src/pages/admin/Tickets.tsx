import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { AlertTriangle, CheckCircle, Clock, Search } from "lucide-react"

interface SupportTicket {
  id: number
  title: string
  description: string
  userEmail: string
  category?: string
  priority?: string
  assignedTo?: string
  status: "open" | "in_progress" | "resolved" | "closed"
}

const mockModerators = ["moderator", "seniormoderator", "contentmoderator", "autommoderator"]

const Tickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 1,
      title: "App crash on login",
      description: "User reports app crashing after login.",
      userEmail: "user1@example.com",
      status: "open",
    },
    {
      id: 2,
      title: "Harassment report",
      description: "Report on user behavior.",
      userEmail: "user2@example.com",
      status: "open",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTickets, setFilteredTickets] = useState(tickets)

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const search = searchTerm.trim().toLowerCase()
      const filtered = tickets.filter((t) =>
        t.userEmail.toLowerCase().includes(search)
      )
      setFilteredTickets(filtered)
    }
  }

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [assignData, setAssignData] = useState({
    ticketId: 0,
    priority: "",
    category: "",
    assignee: "",
  })

  const openAssignDialog = (ticketId: number) => {
    setAssignData({ ticketId, priority: "", category: "", assignee: "" })
    setIsAssignDialogOpen(true)
  }

  const handleAssignSubmit = () => {
    const updated = tickets.map((t) =>
      t.id === assignData.ticketId
        ? {
            ...t,
            priority: assignData.priority,
            category: assignData.category,
            assignedTo: assignData.assignee,
            status: "in_progress",
          }
        : t
    )
    setTickets(updated)
    setFilteredTickets(updated)
    setIsAssignDialogOpen(false)
    toast({
      title: "Ticket Assigned",
      description: `Assigned to ${assignData.assignee}`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in_progress":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "closed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Support Tickets</CardTitle>
        <div className="relative w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user email"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(filteredTickets.length ? filteredTickets : tickets).map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.userEmail}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {getStatusIcon(ticket.status)} {ticket.status}
                </TableCell>
                <TableCell>{ticket.assignedTo || "-"}</TableCell>
                <TableCell>
                  <Button onClick={() => openAssignDialog(ticket.id)}>Assign</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm">Priority</label>
              <Select
                onValueChange={(val) =>
                  setAssignData({ ...assignData, priority: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm">Category</label>
              <Select
                onValueChange={(val) =>
                  setAssignData({ ...assignData, category: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Harassment">Harassment</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm">Assign to Moderator</label>
              <Select
                onValueChange={(val) =>
                  setAssignData({ ...assignData, assignee: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Moderator" />
                </SelectTrigger>
                <SelectContent>
                  {mockModerators.map((email) => (
                    <SelectItem key={email} value={email}>
                      {email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <Button onClick={handleAssignSubmit}>Assign</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default Tickets
