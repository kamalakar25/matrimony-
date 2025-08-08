import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, MessageSquare, Heart, Ban, CheckCircle, XCircle, Settings, BarChart3, Ticket, User, Bell } from 'lucide-react';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const stats = {
    totalUsers: 1248,
    activeUsers: 892,
    totalMatches: 3456,
    dailyMessages: 567,
    reportedProfiles: 12
  };

  const users = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', status: 'active', joinDate: '2024-01-15', reports: 0 },
    { id: 2, name: 'Michael Chen', email: 'michael@email.com', status: 'suspended', joinDate: '2024-02-20', reports: 3 },
    { id: 3, name: 'Emma Davis', email: 'emma@email.com', status: 'active', joinDate: '2024-01-08', reports: 0 },
    { id: 4, name: 'David Wilson', email: 'david@email.com', status: 'pending', joinDate: '2024-03-12', reports: 1 },
  ];

  const reports = [
    { id: 1, reporter: 'Sarah J.', reported: 'Michael C.', reason: 'Inappropriate messages', date: '2024-03-15', status: 'pending' },
    { id: 2, reporter: 'Emma D.', reported: 'John S.', reason: 'Fake profile', date: '2024-03-14', status: 'resolved' },
    { id: 3, reporter: 'Lisa M.', reported: 'David W.', reason: 'Harassment', date: '2024-03-13', status: 'investigating' },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, monitor activity, and oversee platform operations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeUsers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Matches</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalMatches}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Daily Messages</p>
                  <p className="text-2xl font-bold text-foreground">{stats.dailyMessages}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reports</p>
                  <p className="text-2xl font-bold text-foreground">{stats.reportedProfiles}</p>
                </div>
                <Ban className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and monitor user activity</CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Joined: {user.joinDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={user.status === 'active' ? 'default' : user.status === 'suspended' ? 'destructive' : 'secondary'}>
                          {user.status}
                        </Badge>
                        {user.reports > 0 && (
                          <Badge variant="outline" className="text-orange-600">
                            {user.reports} reports
                          </Badge>
                        )}
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Edit</Button>
                          {user.status === 'active' ? (
                            <Button size="sm" variant="destructive">Suspend</Button>
                          ) : (
                            <Button size="sm" variant="default">Activate</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage user support requests and issues</CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, user: 'Sarah J.', subject: 'Cannot upload photos', priority: 'high', status: 'open', created: '2024-03-15' },
                    { id: 2, user: 'Michael C.', subject: 'Account verification issue', priority: 'medium', status: 'in-progress', created: '2024-03-14' },
                    { id: 3, user: 'Emma D.', subject: 'Billing question', priority: 'low', status: 'resolved', created: '2024-03-13' },
                  ].map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Ticket className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">{ticket.subject}</h3>
                          <p className="text-sm text-muted-foreground">From: {ticket.user}</p>
                          <p className="text-xs text-muted-foreground">{ticket.created}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'secondary' : 'outline'}>
                          {ticket.priority}
                        </Badge>
                        <Badge variant={ticket.status === 'resolved' ? 'default' : ticket.status === 'in-progress' ? 'secondary' : 'destructive'}>
                          {ticket.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="default">Respond</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
                <CardDescription>Review and moderate user profiles</CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search profiles..."
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, name: 'Alex Thompson', age: 28, status: 'verified', photos: 5, reports: 0, location: 'New York' },
                    { id: 2, name: 'Jessica Lee', age: 25, status: 'pending', photos: 3, reports: 0, location: 'Los Angeles' },
                    { id: 3, name: 'Marcus Johnson', age: 32, status: 'flagged', photos: 2, reports: 2, location: 'Chicago' },
                  ].map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">{profile.name}, {profile.age}</h3>
                          <p className="text-sm text-muted-foreground">{profile.location} • {profile.photos} photos</p>
                          {profile.reports > 0 && (
                            <p className="text-xs text-orange-600">{profile.reports} reports</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={profile.status === 'verified' ? 'default' : profile.status === 'flagged' ? 'destructive' : 'secondary'}>
                          {profile.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View Profile</Button>
                          <Button size="sm" variant="default">Moderate</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>Send announcements and updates to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Bell className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">Maintenance Update</h3>
                          <p className="text-sm text-muted-foreground">Scheduled maintenance on March 20th</p>
                          <p className="text-xs text-muted-foreground">Sent to all users • 2024-03-15</p>
                        </div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Bell className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">New Feature Launch</h3>
                          <p className="text-sm text-muted-foreground">Video chat feature now available</p>
                          <p className="text-xs text-muted-foreground">Sent to premium users • 2024-03-10</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button>Send New Notification</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>Navigate to detailed management pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" onClick={() => window.location.href = '/admin/reports'}>
                    <Ban className="h-8 w-8" />
                    <span>View All Reports</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" onClick={() => window.location.href = '/admin/analytics'}>
                    <BarChart3 className="h-8 w-8" />
                    <span>Analytics Dashboard</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" onClick={() => window.location.href = '/admin/settings'}>
                    <Settings className="h-8 w-8" />
                    <span>Platform Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Monitor system health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Database Status</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Server Load</span>
                      <Badge variant="secondary">Normal</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Image Storage</span>
                      <Badge variant="default">Optimal</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Email Service</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Last Backup</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Uptime</span>
                      <span className="text-sm text-muted-foreground">99.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Sessions</span>
                      <span className="text-sm text-muted-foreground">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Response Time</span>
                      <span className="text-sm text-muted-foreground">142ms</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;