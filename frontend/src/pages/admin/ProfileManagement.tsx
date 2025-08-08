import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  UserCheck,
  Search,
  Filter,
  Eye,
  Flag,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Heart,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  profession: string;
  community: string;
  education: string;
  maritalStatus: 'never_married' | 'divorced' | 'widowed';
  profileStatus: 'active' | 'inactive' | 'flagged' | 'under_review';
  verified: boolean;
  premium: boolean;
  photos: number;
  profileComplete: number;
  lastActive: string;
  joinDate: string;
  flagReasons: string[];
}

const ProfileManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [communityFilter, setCommunityFilter] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: 1,
      name: 'Priya Sharma',
      age: 28,
      gender: 'female',
      location: 'Mumbai, Maharashtra',
      profession: 'Software Engineer',
      community: 'Brahmin',
      education: 'B.Tech Computer Science',
      maritalStatus: 'never_married',
      profileStatus: 'active',
      verified: true,
      premium: true,
      photos: 5,
      profileComplete: 95,
      lastActive: '2024-01-20',
      joinDate: '2024-01-15',
      flagReasons: []
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      age: 30,
      gender: 'male',
      location: 'Delhi, Delhi',
      profession: 'Business Analyst',
      community: 'Kayastha',
      education: 'MBA Finance',
      maritalStatus: 'never_married',
      profileStatus: 'flagged',
      verified: false,
      premium: false,
      photos: 3,
      profileComplete: 75,
      lastActive: '2024-01-19',
      joinDate: '2024-01-14',
      flagReasons: ['Inappropriate photos', 'Fake information']
    },
    {
      id: 3,
      name: 'Sneha Patel',
      age: 26,
      gender: 'female',
      location: 'Ahmedabad, Gujarat',
      profession: 'Doctor',
      community: 'Patel',
      education: 'MBBS',
      maritalStatus: 'never_married',
      profileStatus: 'under_review',
      verified: true,
      premium: true,
      photos: 4,
      profileComplete: 88,
      lastActive: '2024-01-18',
      joinDate: '2024-01-13',
      flagReasons: ['Reported by multiple users']
    },
    {
      id: 4,
      name: 'Amit Singh',
      age: 32,
      gender: 'male',
      location: 'Bangalore, Karnataka',
      profession: 'Consultant',
      community: 'Rajput',
      education: 'B.Tech Mechanical',
      maritalStatus: 'divorced',
      profileStatus: 'inactive',
      verified: true,
      premium: false,
      photos: 2,
      profileComplete: 60,
      lastActive: '2024-01-10',
      joinDate: '2024-01-12',
      flagReasons: []
    },
    {
      id: 5,
      name: 'Kavya Reddy',
      age: 29,
      gender: 'female',
      location: 'Hyderabad, Telangana',
      profession: 'Marketing Manager',
      community: 'Reddy',
      education: 'MBA Marketing',
      maritalStatus: 'never_married',
      profileStatus: 'active',
      verified: false,
      premium: true,
      photos: 6,
      profileComplete: 92,
      lastActive: '2024-01-20',
      joinDate: '2024-01-11',
      flagReasons: []
    },
  ]);

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || profile.profileStatus === statusFilter;
    const matchesCommunity = communityFilter === 'all' || profile.community === communityFilter;
    
    return matchesSearch && matchesStatus && matchesCommunity;
  });

  const handleViewProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsViewDialogOpen(true);
    toast({
      title: "Profile Details",
      description: `Viewing profile for ${profile.name}`,
    });
  };

  const handleFlagProfile = (profileId: number) => {
    setProfiles(profiles.map(profile => 
      profile.id === profileId 
        ? { ...profile, profileStatus: 'flagged' as const, flagReasons: [...profile.flagReasons, 'Flagged by admin'] }
        : profile
    ));
    toast({
      title: "Profile Flagged",
      description: "Profile has been flagged for review.",
      variant: "destructive",
    });
  };

  const handleUnflagProfile = (profileId: number) => {
    setProfiles(profiles.map(profile => 
      profile.id === profileId 
        ? { ...profile, profileStatus: 'active' as const, flagReasons: [] }
        : profile
    ));
    toast({
      title: "Profile Unflagged",
      description: "Profile has been restored to active status.",
    });
  };

  const handleVerifyProfile = (profileId: number) => {
    setProfiles(profiles.map(profile => 
      profile.id === profileId ? { ...profile, verified: true } : profile
    ));
    toast({
      title: "Profile Verified",
      description: "Profile has been verified successfully.",
    });
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'flagged': return 'destructive';
      case 'under_review': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'flagged': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'under_review': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const communities = ['Brahmin', 'Kayastha', 'Patel', 'Rajput', 'Reddy', 'Agarwal', 'Baniya', 'Jat', 'Other'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <UserCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Profile Management</h1>
        </div>
        
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
                placeholder="Search profiles..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
              </SelectContent>
            </Select>

            <Select value={communityFilter} onValueChange={setCommunityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by community" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Communities</SelectItem>
                {communities.map(community => (
                  <SelectItem key={community} value={community}>
                    {community}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Profiles Table */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Profiles ({filteredProfiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {profile.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{profile.name}</span>
                            {profile.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {profile.premium && (
                              <Badge variant="default" className="text-xs">Premium</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {profile.age} years • {profile.gender}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          {profile.location}
                        </div>
                        <div className="flex items-center text-sm">
                          <Briefcase className="h-3 w-3 mr-1 text-muted-foreground" />
                          {profile.profession}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {profile.community} • {profile.education}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(profile.profileStatus)}
                          <Badge variant={getBadgeVariant(profile.profileStatus)}>
                            {profile.profileStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                        {profile.flagReasons.length > 0 && (
                          <div className="text-xs text-red-500">
                            {profile.flagReasons.length} flag(s)
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${profile.profileComplete}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {profile.profileComplete}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {profile.photos} photos
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(profile.lastActive).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProfile(profile)}
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
                            {profile.profileStatus === 'flagged' ? (
                              <DropdownMenuItem onClick={() => handleUnflagProfile(profile.id)}>
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Unflag Profile
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleFlagProfile(profile.id)}>
                                <Flag className="h-4 w-4 mr-2 text-red-500" />
                                Flag Profile
                              </DropdownMenuItem>
                            )}
                            {!profile.verified && (
                              <DropdownMenuItem onClick={() => handleVerifyProfile(profile.id)}>
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Verify Profile
                              </DropdownMenuItem>
                            )}
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

      {/* View Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
          </DialogHeader>
          {selectedProfile && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg">
                    {selectedProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-2xl font-bold">{selectedProfile.name}</h3>
                    {selectedProfile.verified && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {selectedProfile.premium && (
                      <Badge variant="default">Premium</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {selectedProfile.age} years old
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {selectedProfile.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      {selectedProfile.profession}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Community:</span> {selectedProfile.community}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Personal Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="capitalize">{selectedProfile.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Marital Status:</span>
                      <span className="capitalize">{selectedProfile.maritalStatus.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Education:</span>
                      <span>{selectedProfile.education}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Photos:</span>
                      <span>{selectedProfile.photos} uploaded</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Account Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={getBadgeVariant(selectedProfile.profileStatus)}>
                        {selectedProfile.profileStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verified:</span>
                      <span>{selectedProfile.verified ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Premium:</span>
                      <span>{selectedProfile.premium ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Join Date:</span>
                      <span>{new Date(selectedProfile.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Active:</span>
                      <span>{new Date(selectedProfile.lastActive).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Profile Completion</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-secondary rounded-full h-4">
                    <div 
                      className="bg-primary h-4 rounded-full" 
                      style={{ width: `${selectedProfile.profileComplete}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {selectedProfile.profileComplete}%
                  </span>
                </div>
              </div>

              {selectedProfile.flagReasons.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-red-600">Flag Reasons</h4>
                  <div className="space-y-1">
                    {selectedProfile.flagReasons.map((reason, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-4 border-t">
                {selectedProfile.profileStatus === 'flagged' ? (
                  <Button 
                    className="admin-button-primary"
                    onClick={() => {
                      handleUnflagProfile(selectedProfile.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Unflag Profile
                  </Button>
                ) : (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleFlagProfile(selectedProfile.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Flag Profile
                  </Button>
                )}
                
                {!selectedProfile.verified && (
                  <Button 
                    className="admin-button-secondary"
                    onClick={() => {
                      handleVerifyProfile(selectedProfile.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Profile
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileManagement;