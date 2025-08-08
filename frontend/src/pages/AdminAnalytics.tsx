import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Heart, MessageSquare, UserCheck, Activity, Calendar } from 'lucide-react';

const AdminAnalytics = () => {
  const analytics = {
    userGrowth: { value: '+15.2%', change: 'vs last month', trend: 'up' },
    activeUsers: { value: '892', change: '+8.3% from last week', trend: 'up' },
    matchSuccessRate: { value: '73.4%', change: '+2.1% from last week', trend: 'up' },
    messagesSent: { value: '12.5K', change: 'this month', trend: 'neutral' },
    averageSessionTime: { value: '24m', change: '+5m from last month', trend: 'up' },
    conversationRate: { value: '45.8%', change: '-1.2% from last week', trend: 'down' },
  };

  const weeklyStats = [
    { day: 'Mon', users: 120, matches: 45, messages: 890 },
    { day: 'Tue', users: 145, matches: 52, messages: 1020 },
    { day: 'Wed', users: 132, matches: 48, messages: 950 },
    { day: 'Thu', users: 158, matches: 61, messages: 1150 },
    { day: 'Fri', users: 189, matches: 73, messages: 1380 },
    { day: 'Sat', users: 201, matches: 82, messages: 1450 },
    { day: 'Sun', users: 167, matches: 68, messages: 1200 },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform performance and user engagement metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">User Growth</h3>
                </div>
                {getTrendIcon(analytics.userGrowth.trend)}
              </div>
              <p className="text-2xl font-bold text-foreground">{analytics.userGrowth.value}</p>
              <p className="text-sm text-muted-foreground">{analytics.userGrowth.change}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Active Users</h3>
                </div>
                {getTrendIcon(analytics.activeUsers.trend)}
              </div>
              <p className="text-2xl font-bold text-foreground">{analytics.activeUsers.value}</p>
              <p className="text-sm text-muted-foreground">{analytics.activeUsers.change}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold">Match Success Rate</h3>
                </div>
                {getTrendIcon(analytics.matchSuccessRate.trend)}
              </div>
              <p className="text-2xl font-bold text-foreground">{analytics.matchSuccessRate.value}</p>
              <p className="text-sm text-muted-foreground">{analytics.matchSuccessRate.change}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Messages Sent</h3>
                </div>
                {getTrendIcon(analytics.messagesSent.trend)}
              </div>
              <p className="text-2xl font-bold text-foreground">{analytics.messagesSent.value}</p>
              <p className="text-sm text-muted-foreground">{analytics.messagesSent.change}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold">Avg Session Time</h3>
                </div>
                {getTrendIcon(analytics.averageSessionTime.trend)}
              </div>
              <p className="text-2xl font-bold text-foreground">{analytics.averageSessionTime.value}</p>
              <p className="text-sm text-muted-foreground">{analytics.averageSessionTime.change}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold">Conversation Rate</h3>
                </div>
                {getTrendIcon(analytics.conversationRate.trend)}
              </div>
              <p className="text-2xl font-bold text-foreground">{analytics.conversationRate.value}</p>
              <p className="text-sm text-muted-foreground">{analytics.conversationRate.change}</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>Daily breakdown of key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyStats.map((stat) => (
                <div key={stat.day} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{stat.day}</span>
                  </div>
                  <div className="flex space-x-8">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-lg font-semibold">{stat.users}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Matches</p>
                      <p className="text-lg font-semibold">{stat.matches}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Messages</p>
                      <p className="text-lg font-semibold">{stat.messages}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Features</CardTitle>
              <CardDescription>Most engaging platform features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Profile Views</span>
                  <span className="text-green-600 font-semibold">+23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Messaging</span>
                  <span className="text-green-600 font-semibold">+18%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Photo Uploads</span>
                  <span className="text-green-600 font-semibold">+15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Search Filters</span>
                  <span className="text-green-600 font-semibold">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Retention</CardTitle>
              <CardDescription>User engagement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Day 1 Retention</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Day 7 Retention</span>
                  <span className="font-semibold">62%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Day 30 Retention</span>
                  <span className="font-semibold">41%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Day 90 Retention</span>
                  <span className="font-semibold">28%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;