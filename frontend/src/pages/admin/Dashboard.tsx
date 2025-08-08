import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Users,
  Heart,
  AlertTriangle,
  DollarSign,
  Eye,
  TrendingUp,
  TrendingDown,
  Activity,
  X as XIcon,
} from 'lucide-react';

type Stat = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: 'Active' | 'Pending' | 'Inactive';
  verified?: boolean;
  joinDate: string; // YYYY-MM-DD
  lastActive?: string; // YYYY-MM-DD
  role?: string;
  profileCompletion?: number; // 0-100
};

const AdminDashboard: React.FC = () => {
  const [filterRange, setFilterRange] = useState<'all' | 'week' | 'month' | 'year'>('month');

  // Toast used for Generate Report and for "Viewing details"
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef<number | null>(null);

  // Modal for user details
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // sample stats
  const statsInitial: Stat[] = [
    { title: 'Total Users', value: '12,543', change: '+12%', trend: 'up', icon: Users, color: 'text-blue-600' },
    { title: 'Active Matches', value: '3,247', change: '+8%', trend: 'up', icon: Heart, color: 'text-pink-600' },
    { title: 'Revenue', value: '$45,234', change: '+23%', trend: 'up', icon: DollarSign, color: 'text-green-600' },
    { title: 'Pending Reports', value: '89', change: '-5%', trend: 'down', icon: AlertTriangle, color: 'text-yellow-600' },
  ];

  // sample users (you can replace with API data)
  const recentUsersInitial: User[] = [
    { id: 1, name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 9876543210', status: 'Active', verified: true, joinDate: '2024-01-15', lastActive: '2024-01-20', role: 'user', profileCompletion: 85 },
    { id: 2, name: 'Rahul Kumar', email: 'rahul@email.com', phone: '+91 9876543211', status: 'Pending', verified: false, joinDate: '2024-01-14', lastActive: '2024-01-19', role: 'user', profileCompletion: 60 },
    { id: 3, name: 'Sneha Patel', email: 'sneha@email.com', phone: '+91 9876543212', status: 'Active', verified: true, joinDate: '2024-01-13', lastActive: '2024-01-15', role: 'user', profileCompletion: 90 },
    { id: 4, name: 'Amit Singh', email: 'amit@email.com', phone: '+91 9876543213', status: 'Inactive', verified: true, joinDate: '2024-01-12', lastActive: '2024-01-12', role: 'user', profileCompletion: 40 },
    { id: 5, name: 'Kavya Reddy', email: 'kavya@email.com', phone: '+91 9876543214', status: 'Active', verified: false, joinDate: '2024-01-11', lastActive: '2024-01-18', role: 'user', profileCompletion: 70 },
  ];

  const flaggedContent = [
    { id: 1, type: 'Profile', user: 'John Doe', reason: 'Inappropriate photos', severity: 'High' },
    { id: 2, type: 'Message', user: 'Jane Smith', reason: 'Spam content', severity: 'Medium' },
    { id: 3, type: 'Profile', user: 'Mike Johnson', reason: 'Fake information', severity: 'High' },
  ];

  // --- filter helpers ---
  const getCutoffDate = (range: typeof filterRange) => {
    if (range === 'all') return null;
    const now = new Date();
    const cutoff = new Date(now);
    if (range === 'week') cutoff.setDate(now.getDate() - 7);
    else if (range === 'month') cutoff.setMonth(now.getMonth() - 1);
    else if (range === 'year') cutoff.setFullYear(now.getFullYear() - 1);
    cutoff.setHours(0, 0, 0, 0);
    return cutoff;
  };

  const filteredRecentUsers = useMemo(() => {
    const cutoff = getCutoffDate(filterRange);
    if (!cutoff) return recentUsersInitial;
    return recentUsersInitial.filter((u) => {
      const d = new Date(u.joinDate + 'T00:00:00');
      return d >= cutoff;
    });
  }, [filterRange]);

  const friendlyRangeLabel = (r: typeof filterRange) => {
    if (r === 'all') return 'all time';
    if (r === 'week') return 'last week';
    if (r === 'month') return 'last month';
    return 'last year';
  };

  // --- toast logic ---
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message: string, ms = 2000) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastMessage(message);
    setToastVisible(true);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
      toastTimerRef.current = null;
    }, ms);
  };

  const hideToast = () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastVisible(false);
  };

  // --- generate report handler ---
  const handleGenerateReport = async () => {
    // call API if needed, then show toast when done
    showToast('Report generated', 2000);
  };

  // --- modal handlers ---
  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
    showToast(`Viewing details for ${user.name}`, 2000);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  // close modal on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  };

  // small helper to format date
  const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : '-');

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">Dashboard</h1>

        <div className="flex items-center gap-2">
          <select
            id="dashboard-range"
            value={filterRange}
            onChange={(e) => setFilterRange(e.target.value as 'all' | 'week' | 'month' | 'year')}
            className="rounded-md border px-2 py-1 text-sm bg-white"
            aria-label="Filter dashboard range"
          >
            <option value="all">All</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>

          <Button
            className="admin-button-primary flex items-center justify-center px-3 py-1 text-sm"
            onClick={handleGenerateReport}
            aria-label="Generate Report"
          >
            <Activity className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        {statsInitial.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-3 min-h-[100px] flex flex-col justify-between">
              <CardHeader className="p-0 mb-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-muted/10 p-2 inline-flex items-center justify-center">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <CardTitle className="text-sm font-medium text-muted-foreground p-0 m-0">{stat.title}</CardTitle>
                  </div>

                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                    <span className={`${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} text-xs`}>{stat.change}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">{stat.value}</div>

                  <div className="hidden sm:flex flex-col items-end text-right text-xs text-muted-foreground">
                    <span className={`${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} text-xs`}>{stat.change}</span>
                    <span className="text-[10px]">from {friendlyRangeLabel(filterRange)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main grid: table and flagged content (increased box sizes) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent Users - larger box */}
        <Card className="p-0">
          <CardHeader className="px-4 py-3">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-base font-semibold m-0">Recent User Registrations</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Increased max-h so box appears larger */}
            <div className="max-h-[340px] overflow-auto px-4 pb-4">
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecentUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-sm text-muted-foreground">No registrations in the selected range.</TableCell>
                      </TableRow>
                    ) : (
                      filteredRecentUsers.map((user) => (
                        <TableRow key={user.id} className="min-h-[64px]"> {/* taller row */}
                          <TableCell className="py-3">
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <Badge variant={user.status === 'Active' ? 'default' : user.status === 'Pending' ? 'secondary' : 'destructive'}>
                              {user.status.toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground py-3">{user.joinDate}</TableCell>
                          <TableCell className="py-3">
                            <Button variant="ghost" size="sm" aria-label={`View ${user.name}`} onClick={() => openUserModal(user)}>
                              <Eye className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* mobile stacked list - larger items */}
              <div className="sm:hidden space-y-3 px-2">
                {filteredRecentUsers.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-3">No registrations in the selected range.</div>
                ) : (
                  filteredRecentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-border rounded-lg min-h-[70px]">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium truncate">{user.name}</div>
                            <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                          </div>
                          <div className="ml-2 text-sm text-muted-foreground">{user.joinDate}</div>
                        </div>
                        <div className="mt-2">
                          <Badge variant={user.status === 'Active' ? 'default' : user.status === 'Pending' ? 'secondary' : 'destructive'}>
                            {user.status.toLowerCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="ml-3 flex-shrink-0">
                        <Button variant="ghost" size="sm" aria-label={`View ${user.name}`} onClick={() => openUserModal(user)}>
                          <Eye className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flagged Content - larger box + bigger items */}
        <Card className="p-0">
          <CardHeader className="px-4 py-3">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-base font-semibold m-0">Flagged Content</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-[340px] overflow-auto px-4 pb-4 space-y-3">
              {flaggedContent.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg gap-3 min-h-[72px]">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="shrink-0">{item.type}</Badge>
                      <span className="font-medium truncate">{item.user}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 truncate">{item.reason}</p>
                  </div>

                  <div className="flex items-center gap-3 ml-3">
                    <Badge variant={item.severity === 'High' ? 'destructive' : 'secondary'}>
                      {item.severity}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Inspect ${item.type}`}
                      onClick={() => showToast(`Viewing flagged content: ${item.user}`, 2000)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Centered Modal for User Details --- */}
      {modalOpen && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-4 relative max-h-[70vh] overflow-auto">
            <button
              className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full border border-yellow-300 w-8 h-8 bg-white"
              onClick={closeModal}
              aria-label="Close user details"
            >
              <XIcon className="h-4 w-4 text-slate-700" />
            </button>

            <h2 className="text-lg font-semibold mb-3">User Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Left column */}
              <div>
                <div className="mb-2">
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium text-foreground">{selectedUser.name}</div>
                </div>

                <div className="mb-2">
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium text-foreground">{selectedUser.phone ?? '-'}</div>
                </div>

                <div className="mb-2">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge variant={selectedUser.status === 'Active' ? 'default' : selectedUser.status === 'Pending' ? 'secondary' : 'destructive'}>
                    {selectedUser.status.toLowerCase()}
                  </Badge>
                </div>

                <div className="mb-2">
                  <div className="text-sm text-muted-foreground">Join Date</div>
                  <div className="font-medium text-foreground">{fmtDate(selectedUser.joinDate)}</div>
                </div>
              </div>

              {/* Right column */}
              <div>
                <div className="mb-2">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium text-foreground">{selectedUser.email}</div>
                </div>

                <div className="mb-2">
                  <div className="text-sm text-muted-foreground">Role</div>
                  <div><Badge variant="secondary">{selectedUser.role ?? 'user'}</Badge></div>
                </div>

                <div className="mb-2">
                  <div className="text-sm text-muted-foreground">Verified</div>
                  <div className="font-medium text-foreground">{selectedUser.verified ? 'Yes' : 'No'}</div>
                </div>

                <div className="mb-2">
                  <div className="text-sm text-muted-foreground">Last Active</div>
                  <div className="font-medium text-foreground">{fmtDate(selectedUser.lastActive)}</div>
                </div>
              </div>
            </div>

            {/* Profile completion bar */}
            <div className="mt-3">
              <div className="text-sm text-muted-foreground mb-2">Profile Completion</div>
              <div className="w-full bg-muted/30 rounded-full h-3">
                <div
                  className="rounded-full h-3 bg-yellow-500"
                  style={{ width: `${selectedUser.profileCompletion ?? 0}%`, transition: 'width 300ms' }}
                />
              </div>
              <div className="text-sm text-muted-foreground text-right mt-1">{selectedUser.profileCompletion ?? 0}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div aria-live="polite" className="fixed inset-0 z-40 pointer-events-none">
        <div className="absolute right-4 bottom-4 w-full flex items-end justify-end pointer-events-none">
          {toastVisible && (
            <div className="pointer-events-auto bg-white border border-border shadow-lg rounded-md max-w-xs w-full">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Activity className="h-5 w-5 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">Notification</div>
                    <div className="text-xs text-muted-foreground mt-1">{toastMessage}</div>
                  </div>
                </div>

                <div className="ml-4 flex-shrink-0">
                  <button
                    aria-label="Close"
                    onClick={hideToast}
                    className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted/30"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
