import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, CheckCircle, Clock, Ban } from 'lucide-react';

const AdminReports = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const reports = [
    { id: 1, reporter: 'Sarah J.', reported: 'Michael C.', reason: 'Inappropriate messages', date: '2024-03-15', status: 'pending', severity: 'high' },
    { id: 2, reporter: 'Emma D.', reported: 'John S.', reason: 'Fake profile', date: '2024-03-14', status: 'resolved', severity: 'medium' },
    { id: 3, reporter: 'Lisa M.', reported: 'David W.', reason: 'Harassment', date: '2024-03-13', status: 'investigating', severity: 'high' },
    { id: 4, reporter: 'Tom R.', reported: 'Alice B.', reason: 'Spam messages', date: '2024-03-12', status: 'resolved', severity: 'low' },
    { id: 5, reporter: 'Jane K.', reported: 'Bob M.', reason: 'Inappropriate photos', date: '2024-03-11', status: 'pending', severity: 'high' },
  ];

  const filteredReports = reports.filter(report => 
    report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reported.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'investigating': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Ban className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Reports Management</h1>
          <p className="text-muted-foreground">Review and manage user reports and violations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold text-foreground">{reports.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{reports.filter(r => r.status === 'pending').length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Investigating</p>
                  <p className="text-2xl font-bold text-foreground">{reports.filter(r => r.status === 'investigating').length}</p>
                </div>
                <Ban className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-foreground">{reports.filter(r => r.status === 'resolved').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
            <CardDescription>Manage and review user reports</CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(report.status)}
                    <div>
                      <h3 className="font-semibold text-foreground">{report.reason}</h3>
                      <p className="text-sm text-muted-foreground">
                        {report.reporter} reported {report.reported}
                      </p>
                      <p className="text-xs text-muted-foreground">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={getSeverityVariant(report.severity)}>
                      {report.severity}
                    </Badge>
                    <Badge variant={report.status === 'resolved' ? 'default' : report.status === 'investigating' ? 'secondary' : 'destructive'}>
                      {report.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Review</Button>
                      <Button size="sm" variant="default">Take Action</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;