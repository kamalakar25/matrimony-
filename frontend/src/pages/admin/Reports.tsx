import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  AlertTriangle,
  Clock,
  User,
  Flag,
  MessageSquare,
  Image,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: number;
  reporterName: string;
  reporterEmail: string;
  reportedUserName: string;
  reportedUserId: number;
  type: 'harassment' | 'fake_profile' | 'inappropriate_content' | 'spam' | 'other';
  category: 'profile' | 'message' | 'photo' | 'behavior';
  description: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  evidence?: string[];
  reportDate: string;
  assignedTo?: string;
  resolutionNotes?: string;
  actionTaken?: string;
}

const Reports = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');

  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      reporterName: 'Priya Sharma',
      reporterEmail: 'priya@email.com',
      reportedUserName: 'Suspicious User',
      reportedUserId: 123,
      type: 'fake_profile',
      category: 'profile',
      description: 'This user is using fake photos and providing false information about their profession and education.',
      status: 'pending',
      priority: 'high',
      evidence: ['photo1.jpg', 'screenshot1.png'],
      reportDate: '2024-01-20',
      assignedTo: 'Moderator Team'
    },
    {
      id: 2,
      reporterName: 'Rahul Kumar',
      reporterEmail: 'rahul@email.com',
      reportedUserName: 'Harasser Name',
      reportedUserId: 456,
      type: 'harassment',
      category: 'message',
      description: 'This user is sending inappropriate messages and making me uncomfortable. They are not respecting my boundaries.',
      status: 'under_review',
      priority: 'critical',
      evidence: ['chat_screenshot.png'],
      reportDate: '2024-01-19',
      assignedTo: 'Senior Moderator'
    },
    {
      id: 3,
      reporterName: 'Sneha Patel',
      reporterEmail: 'sneha@email.com',
      reportedUserName: 'Spam Account',
      reportedUserId: 789,
      type: 'spam',
      category: 'behavior',
      description: 'This user is sending the same message to multiple people and promoting external services.',
      status: 'resolved',
      priority: 'medium',
      reportDate: '2024-01-18',
      assignedTo: 'Auto Moderator',
      resolutionNotes: 'Account suspended for 30 days. User warned about spam behavior.',
      actionTaken: 'Account suspended'
    },
    {
      id: 4,
      reporterName: 'Amit Singh',
      reporterEmail: 'amit@email.com',
      reportedUserName: 'Inappropriate User',
      reportedUserId: 321,
      type: 'inappropriate_content',
      category: 'photo',
      description: 'User has uploaded inappropriate photos that violate community guidelines.',
      status: 'resolved',
      priority: 'high',
      reportDate: '2024-01-17',
      assignedTo: 'Content Moderator',
      resolutionNotes: 'Photos removed. User notified about community guidelines.',
      actionTaken: 'Content removed'
    },
    {
      id: 5,
      reporterName: 'Kavya Reddy',
      reporterEmail: 'kavya@email.com',
      reportedUserName: 'Scammer Profile',
      reportedUserId: 654,
      type: 'other',
      category: 'behavior',
      description: 'This user is asking for money and trying to scam people through emotional manipulation.',
      status: 'dismissed',
      priority: 'high',
      reportDate: '2024-01-16',
      assignedTo: 'Senior Moderator',
      resolutionNotes: 'Investigation completed. No evidence of scamming behavior found.',
      actionTaken: 'No action required'
    },
  ]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setResolutionNotes(report.resolutionNotes || '');
    setActionTaken(report.actionTaken || '');
    setIsViewDialogOpen(true);
    toast({
      title: "Report Details",
      description: `Viewing report #${report.id}`,
    });
  };

  const handleUpdateStatus = (reportId: number, newStatus: 'pending' | 'under_review' | 'resolved' | 'dismissed') => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    ));
    toast({
      title: "Status Updated",
      description: `Report status changed to ${newStatus.replace('_', ' ')}`,
    });
  };

  const handleResolveReport = () => {
    if (selectedReport) {
      setReports(reports.map(report => 
        report.id === selectedReport.id 
          ? { 
              ...report, 
              status: 'resolved' as const, 
              resolutionNotes,
              actionTaken 
            }
          : report
      ));
      setIsViewDialogOpen(false);
      toast({
        title: "Report Resolved",
        description: "Report has been marked as resolved.",
      });
    }
  };

  const handleAssignReport = (reportId: number, assignee: string) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, assignedTo: assignee } : report
    ));
    toast({
      title: "Report Assigned",
      description: `Report assigned to ${assignee}`,
    });
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'under_review': return 'default';
      case 'resolved': return 'default';
      case 'dismissed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'under_review': return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'dismissed': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'profile': return <User className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'photo': return <Image className="h-4 w-4" />;
      case 'behavior': return <Flag className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Reports & Moderation</h1>
        </div>
        
        <Button className="admin-button-primary">
          <Download className="h-4 w-4 mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="admin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="admin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reports.filter(r => r.status === 'under_review').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {reports.filter(r => r.priority === 'critical').length}
                </p>
              </div>
              <Flag className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="profile">Profile</SelectItem>
                <SelectItem value="message">Message</SelectItem>
                <SelectItem value="photo">Photo</SelectItem>
                <SelectItem value="behavior">Behavior</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="admin-button-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Reports ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Details</TableHead>
                  <TableHead>Reported User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Report #{report.id}</span>
                          <Badge variant="outline">{report.type.replace('_', ' ')}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reporter: {report.reporterName}
                        </div>
                        <div className="text-sm">
                          Date: {new Date(report.reportDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{report.reportedUserName}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {report.reportedUserId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(report.category)}
                        <Badge variant="outline">
                          {report.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(report.priority)}>
                        {report.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(report.status)}
                        <Badge variant={getBadgeVariant(report.status)}>
                          {report.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {report.assignedTo || 'Unassigned'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewReport(report)}
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
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(report.id, 'under_review')}
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Mark Under Review
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(report.id, 'resolved')}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Dismiss
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAssignReport(report.id, 'Senior Moderator')}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Assign to Senior Moderator
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

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details - #{selectedReport?.id}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              {/* Report Overview */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Report Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Report Type:</span>
                      <Badge variant="outline">{selectedReport.type.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(selectedReport.category)}
                        <span>{selectedReport.category}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge variant={getPriorityBadgeVariant(selectedReport.priority)}>
                        {selectedReport.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={getBadgeVariant(selectedReport.status)}>
                        {selectedReport.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(selectedReport.reportDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigned To:</span>
                      <span>{selectedReport.assignedTo || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">People Involved</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">Reporter:</span>
                      <div className="mt-1">
                        <div className="font-medium">{selectedReport.reporterName}</div>
                        <div className="text-sm text-muted-foreground">{selectedReport.reporterEmail}</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reported User:</span>
                      <div className="mt-1">
                        <div className="font-medium">{selectedReport.reportedUserName}</div>
                        <div className="text-sm text-muted-foreground">ID: {selectedReport.reportedUserId}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Description */}
              <div>
                <h4 className="font-semibold text-lg mb-2">Report Description</h4>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm">{selectedReport.description}</p>
                </div>
              </div>

              {/* Evidence */}
              {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">Evidence</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.evidence.map((evidence, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer">
                        <Image className="h-3 w-3 mr-1" />
                        {evidence}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution Section */}
              {selectedReport.status === 'resolved' || selectedReport.status === 'dismissed' ? (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Resolution</h4>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Action Taken:</Label>
                      <p className="text-sm">{selectedReport.actionTaken}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Resolution Notes:</Label>
                      <p className="text-sm">{selectedReport.resolutionNotes}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Resolution</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="actionTaken">Action Taken</Label>
                      <Input
                        id="actionTaken"
                        placeholder="Enter action taken..."
                        value={actionTaken}
                        onChange={(e) => setActionTaken(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="resolutionNotes">Resolution Notes</Label>
                      <Textarea
                        id="resolutionNotes"
                        placeholder="Enter resolution notes..."
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="admin-button-primary"
                      onClick={handleResolveReport}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;