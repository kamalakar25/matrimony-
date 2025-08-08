import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  CalendarDays,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'meetup' | 'webinar' | 'workshop' | 'conference';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxAttendees: number;
  currentAttendees: number;
  isOnline: boolean;
  price: number;
  organizer: string;
  createdDate: string;
}

const Events = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Form state for adding/editing events
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'meetup',
    maxAttendees: 100,
    isOnline: false,
    price: 0
  });

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Annual Matrimony Meet 2024',
      description: 'Grand annual meeting for all members to meet and network.',
      date: '2024-02-15',
      time: '18:00',
      location: 'Mumbai Convention Center',
      type: 'conference',
      status: 'upcoming',
      maxAttendees: 500,
      currentAttendees: 324,
      isOnline: false,
      price: 1500,
      organizer: 'Admin Team',
      createdDate: '2024-01-10'
    },
    {
      id: 2,
      title: 'Online Relationship Workshop',
      description: 'Learn about building healthy relationships and communication skills.',
      date: '2024-01-25',
      time: '19:00',
      location: 'Zoom Meeting',
      type: 'workshop',
      status: 'upcoming',
      maxAttendees: 100,
      currentAttendees: 67,
      isOnline: true,
      price: 0,
      organizer: 'Dr. Priya Sharma',
      createdDate: '2024-01-08'
    },
    {
      id: 3,
      title: 'Community Meetup - Delhi',
      description: 'Local meetup for Delhi members to connect in person.',
      date: '2024-01-30',
      time: '16:00',
      location: 'India Gate, Delhi',
      type: 'meetup',
      status: 'upcoming',
      maxAttendees: 50,
      currentAttendees: 32,
      isOnline: false,
      price: 0,
      organizer: 'Rahul Kumar',
      createdDate: '2024-01-12'
    },
    {
      id: 4,
      title: 'Success Stories Webinar',
      description: 'Hear inspiring success stories from couples who found love through our platform.',
      date: '2024-01-20',
      time: '20:00',
      location: 'Google Meet',
      type: 'webinar',
      status: 'completed',
      maxAttendees: 200,
      currentAttendees: 189,
      isOnline: true,
      price: 0,
      organizer: 'Marketing Team',
      createdDate: '2024-01-05'
    },
    {
      id: 5,
      title: 'Photography Workshop',
      description: 'Learn how to take better profile photos for your matrimony profile.',
      date: '2024-02-05',
      time: '14:00',
      location: 'Bangalore Studio',
      type: 'workshop',
      status: 'upcoming',
      maxAttendees: 25,
      currentAttendees: 18,
      isOnline: false,
      price: 800,
      organizer: 'Amit Photography',
      createdDate: '2024-01-15'
    },
  ]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
    toast({
      title: "Event Details",
      description: `Viewing details for ${event.title}`,
    });
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      maxAttendees: event.maxAttendees,
      isOnline: event.isOnline,
      price: event.price
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "Event has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleAddEvent = () => {
    const newEvent: Event = {
      id: Date.now(),
      ...formData,
      type: formData.type as Event['type'],
      status: 'upcoming',
      currentAttendees: 0,
      organizer: 'Admin',
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setEvents([...events, newEvent]);
    setIsAddDialogOpen(false);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'meetup',
      maxAttendees: 100,
      isOnline: false,
      price: 0
    });
    
    toast({
      title: "Event Created",
      description: "New event has been successfully created.",
    });
  };

  const handleUpdateEvent = () => {
    if (selectedEvent) {
      setEvents(events.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...formData, type: formData.type as Event['type'] }
          : event
      ));
      setIsEditDialogOpen(false);
      toast({
        title: "Event Updated",
        description: "Event has been successfully updated.",
      });
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'upcoming': return 'default';
      case 'ongoing': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'conference': return 'destructive';
      case 'workshop': return 'default';
      case 'webinar': return 'secondary';
      case 'meetup': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="admin-button-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="addTitle">Event Title</Label>
                  <Input 
                    id="addTitle" 
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="addType">Event Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meetup">Meetup</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="addDescription">Description</Label>
                <Textarea 
                  id="addDescription" 
                  placeholder="Enter event description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="addDate">Date</Label>
                  <Input 
                    id="addDate" 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="addTime">Time</Label>
                  <Input 
                    id="addTime" 
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="addLocation">Location</Label>
                <Input 
                  id="addLocation" 
                  placeholder="Enter location or online meeting link"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="addMaxAttendees">Max Attendees</Label>
                  <Input 
                    id="addMaxAttendees" 
                    type="number"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({...formData, maxAttendees: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="addPrice">Price (₹)</Label>
                  <Input 
                    id="addPrice" 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input 
                    type="checkbox" 
                    id="addIsOnline"
                    checked={formData.isOnline}
                    onChange={(e) => setFormData({...formData, isOnline: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="addIsOnline">Online Event</Label>
                </div>
              </div>

              <Button 
                className="w-full admin-button-primary"
                onClick={handleAddEvent}
              >
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="meetup">Meetup</SelectItem>
                <SelectItem value="webinar">Webinar</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="admin-button-secondary">
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Events ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getTypeBadgeVariant(event.type)}>
                            {event.type}
                          </Badge>
                          {event.isOnline && (
                            <Badge variant="outline" className="text-xs">
                              <Globe className="h-3 w-3 mr-1" />
                              Online
                            </Badge>
                          )}
                          {event.price > 0 && (
                            <Badge variant="outline" className="text-xs">
                              ₹{event.price}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          by {event.organizer}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-32">{event.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {event.currentAttendees}/{event.maxAttendees}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-primary h-1.5 rounded-full" 
                          style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                        ></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewEvent(event)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Event Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant={getTypeBadgeVariant(selectedEvent.type)}>
                    {selectedEvent.type}
                  </Badge>
                  <Badge variant={getBadgeVariant(selectedEvent.status)}>
                    {selectedEvent.status}
                  </Badge>
                  {selectedEvent.isOnline && (
                    <Badge variant="outline">
                      <Globe className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date & Time</Label>
                  <div className="flex items-center space-x-1 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                    <span>{selectedEvent.time}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <div className="flex items-center space-x-1 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Organizer</Label>
                  <p className="text-sm">{selectedEvent.organizer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Price</Label>
                  <p className="text-sm">{selectedEvent.price > 0 ? `₹${selectedEvent.price}` : 'Free'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Attendance</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedEvent.currentAttendees} / {selectedEvent.maxAttendees} attendees
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(selectedEvent.currentAttendees / selectedEvent.maxAttendees) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editTitle">Event Title</Label>
                <Input 
                  id="editTitle" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editType">Event Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meetup">Meetup</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea 
                id="editDescription" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editDate">Date</Label>
                <Input 
                  id="editDate" 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editTime">Time</Label>
                <Input 
                  id="editTime" 
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="editLocation">Location</Label>
              <Input 
                id="editLocation" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="editMaxAttendees">Max Attendees</Label>
                <Input 
                  id="editMaxAttendees" 
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({...formData, maxAttendees: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="editPrice">Price (₹)</Label>
                <Input 
                  id="editPrice" 
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input 
                  type="checkbox" 
                  id="editIsOnline"
                  checked={formData.isOnline}
                  onChange={(e) => setFormData({...formData, isOnline: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="editIsOnline">Online Event</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                className="flex-1 admin-button-primary"
                onClick={handleUpdateEvent}
              >
                Update Event
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;