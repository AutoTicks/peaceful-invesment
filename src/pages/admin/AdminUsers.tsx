import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  UserPlus,
  Download,
  Mail,
  Calendar,
  Shield,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Settings,
  RefreshCw,
  FileText,
  Phone,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Ban,
  Unlock,
  File,
  Check,
  X,
  MessageSquare,
  FileImage,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, exportToPDF, formatDataForExport } from "@/utils/exportUtils";

interface User {
  id: string;
  user_id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  employment_status?: string | null;
  employer?: string | null;
  annual_income?: number | null;
  investment_experience?: string | null;
  risk_tolerance?: string | null;
  investment_goals?: string[] | null;
  documents_uploaded?: boolean | null;
  status: string;
  has_completed_profile: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string | null;
  role?: string;
  is_verified?: boolean;
  avatar_url?: string | null;
}

interface AdminAction {
  type: 'approve' | 'reject' | 'suspend' | 'activate' | 'change_role' | 'verify';
  userId: string;
  data?: Record<string, unknown>;
  note?: string;
}

interface VerificationRequest {
  id: string;
  user_id: string;
  documents: Record<string, unknown>;
  status: string;
  reason?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<AdminAction | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [newRole, setNewRole] = useState("");
  const [processing, setProcessing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    employment_status: "",
    employer: "",
    annual_income: 0,
    investment_experience: "",
    risk_tolerance: "",
    investment_goals: [] as string[],
    status: ""
  });

  // Verification documents state
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
  const [selectedUserForDocs, setSelectedUserForDocs] = useState<User | null>(null);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [verificationAction, setVerificationAction] = useState<'approve' | 'reject' | 'request_more_info' | null>(null);
  const [verificationNote, setVerificationNote] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles and user_roles separately since there's no direct relationship
      const [profilesResponse, userRolesResponse] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('*')
      ]);

      if (profilesResponse.error) throw profilesResponse.error;
      if (userRolesResponse.error) throw userRolesResponse.error;

      const profiles = profilesResponse.data || [];
      const userRoles = userRolesResponse.data || [];

      // Combine the data
      const usersWithRoles = profiles.map(profile => {
        const userRole = userRoles.find(ur => ur.user_id === profile.user_id);
        
        return {
          ...profile,
          email: profile.user_id, // We'll use user_id as email since we can't access auth.users
          last_sign_in_at: null, // We can't access this without admin privileges
          role: userRole?.role || 'user',
          is_verified: profile.status === 'verified' // Use profile status as verification indicator
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleAdminAction = async (action: AdminAction) => {
    try {
      setProcessing(true);
      
      switch (action.type) {
        case 'approve':
          await updateUserStatus(action.userId, 'verified');
          break;
        case 'reject':
          await updateUserStatus(action.userId, 'rejected');
          break;
        case 'suspend':
          await updateUserStatus(action.userId, 'blocked');
          break;
        case 'activate':
          await updateUserStatus(action.userId, 'verified');
          break;
        case 'change_role':
          if (action.data?.role && typeof action.data.role === 'string') {
            await updateUserRole(action.userId, action.data.role as 'admin' | 'moderator' | 'user');
          }
          break;
        case 'verify':
          await updateUserStatus(action.userId, 'verified');
          break;
      }

      // Log admin action
      await logAdminAction(action);

      toast({
        title: "Success",
        description: `User ${action.type} successful`,
      });

      // Refresh users
      await fetchUsers();
      
    } catch (error) {
      console.error('Error performing admin action:', error);
      toast({
        title: "Error",
        description: `Failed to ${action.type} user`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setActionDialogOpen(false);
      setCurrentAction(null);
      setActionNote("");
      setNewRole("");
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('user_id', userId);

    if (error) throw error;
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    const { error } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role });

    if (error) throw error;
  };

  const logAdminAction = async (action: AdminAction) => {
    const { error } = await supabase
      .from('admin_actions')
      .insert({
        admin_id: user?.id,
        user_id: action.userId,
        action: action.type,
        note: action.note
      });

    if (error) console.error('Error logging admin action:', error);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      zip_code: user.zip_code || "",
      employment_status: user.employment_status || "",
      employer: user.employer || "",
      annual_income: user.annual_income || 0,
      investment_experience: user.investment_experience || "",
      risk_tolerance: user.risk_tolerance || "",
      investment_goals: user.investment_goals || [],
      status: user.status || ""
    });
    setEditDialogOpen(true);
  };

  const handleViewDocuments = async (user: User) => {
    setSelectedUserForDocs(user);
    setLoadingDocuments(true);
    setDocumentsDialogOpen(true);

    try {
      const { data: requests, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVerificationRequests((requests || []) as VerificationRequest[]);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch verification documents",
        variant: "destructive",
      });
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleVerificationAction = async (action: 'approve' | 'reject' | 'request_more_info', requestId: string) => {
    if (!selectedUserForDocs) return;

    try {
      setProcessing(true);

      const { error } = await supabase
        .from('verification_requests')
        .update({
          status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'requested_more_info',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          reason: verificationNote || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // Log admin action
      await logAdminAction({
        type: action === 'approve' ? 'approve' : action === 'reject' ? 'reject' : 'verify',
        userId: selectedUserForDocs.user_id,
        note: `Verification ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'requested more info'}: ${verificationNote}`
      });

      toast({
        title: "Success",
        description: `Verification ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'requested more info'} successfully`,
      });

      // Refresh verification requests
      const { data: requests, error: refreshError } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', selectedUserForDocs.user_id)
        .order('created_at', { ascending: false });

      if (!refreshError) {
        setVerificationRequests((requests || []) as VerificationRequest[]);
      }

      setVerificationAction(null);
      setVerificationNote("");
      
    } catch (error) {
      console.error('Error updating verification request:', error);
      toast({
        title: "Error",
        description: "Failed to update verification request",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setProcessing(true);

      const updateData = {
        full_name: editForm.full_name,
        phone: editForm.phone,
        address: editForm.address,
        city: editForm.city,
        state: editForm.state,
        zip_code: editForm.zip_code,
        employment_status: editForm.employment_status,
        employer: editForm.employer,
        annual_income: editForm.annual_income,
        investment_experience: editForm.investment_experience,
        risk_tolerance: editForm.risk_tolerance,
        investment_goals: editForm.investment_goals,
        status: editForm.status,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', editingUser.user_id)
        .select();

      if (error) throw error;

      // Log admin action
      await logAdminAction({
        type: 'approve', // Using 'approve' for profile updates
        userId: editingUser.user_id,
        note: `User profile updated by admin`
      });

      toast({
        title: "Success",
        description: "User profile updated successfully",
      });

      // Refresh users
      await fetchUsers();
      
      // Close dialog
      setEditDialogOpen(false);
      setEditingUser(null);
      
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user profile",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'suspend' | 'change_role') => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Warning",
        description: "Please select users first",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessing(true);

      for (const userId of selectedUsers) {
        const adminAction: AdminAction = {
          type: action,
          userId,
          data: action === 'change_role' ? { role: newRole } : undefined
        };
        await handleAdminAction(adminAction);
      }

      setSelectedUsers([]);
      toast({
        title: "Success",
        description: `Bulk ${action} completed for ${selectedUsers.length} users`,
      });

    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Admin</Badge>;
      case 'moderator':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Moderator</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending_verification':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'blocked':
        return <Badge variant="destructive" className="bg-gray-100 text-gray-800">Blocked</Badge>;
      default:
        return <Badge variant="outline">Unverified</Badge>;
    }
  };

  const handleExport = async (type: 'excel' | 'pdf') => {
    try {
      const formattedData = formatDataForExport(users, 'users');
      
      if (type === 'excel') {
        const result = exportToExcel(formattedData, 'users_report', 'Users');
        if (result.success) {
          toast({
            title: "Success",
            description: "Users exported to Excel successfully",
          });
        }
      } else {
        const result = await exportToPDF(formattedData, 'users_report', 'Users Report');
        if (result.success) {
          toast({
            title: "Success",
            description: "Users exported to PDF successfully",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export users",
        variant: "destructive",
      });
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(user => user.user_id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Users</h2>
          <p className="text-muted-foreground">Fetching user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts, roles, and verification status
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
            disabled={processing}
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Excel</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf')}
            disabled={processing}
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={processing}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>
            Search and filter users by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending_verification">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center justify-center sm:justify-start">
              <Badge variant="outline">
                {filteredUsers.length} users
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

                {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <Card className="glass-card border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {selectedUsers.length} user(s) selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={newRole} onValueChange={setNewRole}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={() => handleBulkAction('approve')}
                      disabled={processing}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Approve</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('reject')}
                      disabled={processing}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Reject</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('suspend')}
                      disabled={processing}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Suspend</span>
                    </Button>
                    {newRole && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleBulkAction('change_role')}
                        disabled={processing}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Change Role</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

      {/* Users List */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                All registered users in the system
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllUsers}
              >
                Select All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-muted/20 rounded-lg gap-4">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedUsers.includes(user.user_id)}
                      onCheckedChange={() => toggleUserSelection(user.user_id)}
                    />
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-medium truncate">{user.full_name || 'No name'}</p>
                        {getRoleBadge(user.role || 'user')}
                        {getStatusBadge(user.status)}
                        {user.is_verified && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1 truncate">
                        ID: {user.user_id}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>Joined: {formatDate(user.created_at)}</span>
                        {user.phone && (
                          <span>Phone: {user.phone}</span>
                        )}
                        {user.has_completed_profile && (
                          <Badge variant="outline" className="text-xs">
                            Profile Complete
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select
                      value={user.role || 'user'}
                      onValueChange={(value) => {
                        setCurrentAction({
                          type: 'change_role',
                          userId: user.user_id,
                          data: { role: value }
                        });
                        setActionDialogOpen(true);
                      }}
                    >
                      <SelectTrigger className="w-24 sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setUserDetailsOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCurrentAction({
                          type: user.status === 'verified' ? 'suspend' : 'approve',
                          userId: user.user_id
                        });
                        setActionDialogOpen(true);
                      }}
                    >
                      {user.status === 'verified' ? (
                        <Ban className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about the selected user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedUser.full_name || 'No name provided'}</p>
                  <p className="text-sm text-muted-foreground">ID: {selectedUser.user_id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">User ID: {selectedUser.user_id}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedUser.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Joined: {formatDate(selectedUser.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Role: {selectedUser.role || 'user'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedUser.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedUser.address}</span>
                    </div>
                  )}
                  {selectedUser.annual_income && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Income: ${selectedUser.annual_income.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedUser.employment_status && (
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Employment: {selectedUser.employment_status}</span>
                    </div>
                  )}
                  {selectedUser.investment_experience && (
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Experience: {selectedUser.investment_experience}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      handleEditUser(selectedUser);
                      setUserDetailsOpen(false);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      handleViewDocuments(selectedUser);
                      setUserDetailsOpen(false);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Documents
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setCurrentAction({
                        type: 'suspend',
                        userId: selectedUser.user_id
                      });
                      setActionDialogOpen(true);
                      setUserDetailsOpen(false);
                    }}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setCurrentAction({
                        type: 'approve',
                        userId: selectedUser.user_id
                      });
                      setActionDialogOpen(true);
                      setUserDetailsOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAction?.type === 'approve' && 'Approve User'}
              {currentAction?.type === 'reject' && 'Reject User'}
              {currentAction?.type === 'suspend' && 'Suspend User'}
              {currentAction?.type === 'activate' && 'Activate User'}
              {currentAction?.type === 'change_role' && 'Change User Role'}
              {currentAction?.type === 'verify' && 'Verify User'}
            </DialogTitle>
            <DialogDescription>
              Confirm the action you want to perform on this user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {currentAction?.type === 'approve' && 'This will approve the user and grant them access to the platform.'}
                {currentAction?.type === 'reject' && 'This will reject the user and prevent them from accessing the platform.'}
                {currentAction?.type === 'suspend' && 'This will suspend the user temporarily.'}
                {currentAction?.type === 'activate' && 'This will reactivate the user account.'}
                {currentAction?.type === 'change_role' && 'This will change the user role and permissions.'}
                {currentAction?.type === 'verify' && 'This will verify the user account.'}
              </p>
            </div>
            
            {currentAction?.type === 'change_role' && (
              <div>
                <label className="text-sm font-medium">New Role</label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Note (Optional)</label>
              <Textarea
                placeholder="Add a note about this action..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialogOpen(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (currentAction) {
                  const actionWithNote = {
                    ...currentAction,
                    note: actionNote
                  };
                  handleAdminAction(actionWithNote);
                }
              }}
              disabled={processing || (currentAction?.type === 'change_role' && !newRole)}
            >
              {processing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Modify user information and account settings
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Editing: {editingUser.full_name || 'No name provided'}</p>
                  <p className="text-sm text-muted-foreground">ID: {editingUser.user_id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                  
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={editForm.full_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      value={editForm.address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">City</label>
                      <Input
                        value={editForm.city}
                        onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">State</label>
                      <Input
                        value={editForm.state}
                        onChange={(e) => setEditForm(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">ZIP Code</label>
                    <Input
                      value={editForm.zip_code}
                      onChange={(e) => setEditForm(prev => ({ ...prev, zip_code: e.target.value }))}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>

                {/* Employment & Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Employment & Financial</h3>
                  
                  <div>
                    <label className="text-sm font-medium">Employment Status</label>
                    <Select 
                      value={editForm.employment_status} 
                      onValueChange={(value) => setEditForm(prev => ({ ...prev, employment_status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="self-employed">Self-Employed</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Employer</label>
                    <Input
                      value={editForm.employer}
                      onChange={(e) => setEditForm(prev => ({ ...prev, employer: e.target.value }))}
                      placeholder="Enter employer name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Annual Income</label>
                    <Input
                      type="number"
                      value={editForm.annual_income}
                      onChange={(e) => setEditForm(prev => ({ ...prev, annual_income: parseInt(e.target.value) || 0 }))}
                      placeholder="Enter annual income"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Investment Experience</label>
                    <Select 
                      value={editForm.investment_experience} 
                      onValueChange={(value) => setEditForm(prev => ({ ...prev, investment_experience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="some">Some Experience</SelectItem>
                        <SelectItem value="experienced">Experienced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Risk Tolerance</label>
                    <Select 
                      value={editForm.risk_tolerance} 
                      onValueChange={(value) => setEditForm(prev => ({ ...prev, risk_tolerance: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk tolerance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Investment Goals */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Investment Goals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'Retirement Planning',
                    'Income Generation',
                    'Capital Growth',
                    'Tax Benefits',
                    'Diversification',
                    'Wealth Preservation',
                    'Education Funding',
                    'Real Estate Investment'
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        checked={editForm.investment_goals.includes(goal)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditForm(prev => ({
                              ...prev,
                              investment_goals: [...prev.investment_goals, goal]
                            }));
                          } else {
                            setEditForm(prev => ({
                              ...prev,
                              investment_goals: prev.investment_goals.filter(g => g !== goal)
                            }));
                          }
                        }}
                      />
                      <label className="text-sm">{goal}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Account Status</h3>
                <div>
                  <label className="text-sm font-medium">Account Status</label>
                  <Select 
                    value={editForm.status} 
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unverified">Unverified</SelectItem>
                      <SelectItem value="pending_verification">Pending Verification</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setEditingUser(null);
                  }}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveUser}
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog open={documentsDialogOpen} onOpenChange={setDocumentsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verification Documents</DialogTitle>
            <DialogDescription>
              View and manage verification documents for {selectedUserForDocs?.full_name || selectedUserForDocs?.email}
            </DialogDescription>
          </DialogHeader>

          {loadingDocuments ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading documents...</span>
            </div>
          ) : verificationRequests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No verification documents found for this user.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {verificationRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Verification Request</h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {new Date(request.submitted_at).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={
                            request.status === 'approved' ? 'default' :
                            request.status === 'rejected' ? 'destructive' :
                            request.status === 'requested_more_info' ? 'secondary' : 'outline'
                          }
                        >
                          {request.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {request.reason && (
                          <span className="text-sm text-muted-foreground">
                            Reason: {request.reason}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setVerificationAction('request_more_info')}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Request More Info
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setVerificationAction('reject')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setVerificationAction('approve')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Documents Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(request.documents || {}).map(([docType, doc]: [string, Record<string, unknown>]) => (
                      <div key={docType} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm capitalize">
                            {docType.replace('_', ' ')}
                          </h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <File className="h-4 w-4" />
                            <span className="truncate">{doc.filename}</span>
                          </div>
                          
                          {doc.type && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileImage className="h-4 w-4" />
                              <span>{doc.type}</span>
                            </div>
                          )}
                          
                          {doc.size && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Verification Action Dialog */}
          {verificationAction && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-3">
                {verificationAction === 'approve' && 'Approve Verification'}
                {verificationAction === 'reject' && 'Reject Verification'}
                {verificationAction === 'request_more_info' && 'Request More Information'}
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Note (Optional)</label>
                  <Textarea
                    placeholder="Add a note about this action..."
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setVerificationAction(null);
                      setVerificationNote("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      verificationAction === 'approve' ? 'default' :
                      verificationAction === 'reject' ? 'destructive' : 'secondary'
                    }
                    onClick={() => {
                      const requestId = verificationRequests[0]?.id;
                      if (requestId) {
                        handleVerificationAction(verificationAction, requestId);
                      }
                    }}
                    disabled={processing}
                  >
                    {processing ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      verificationAction === 'approve' ? <Check className="h-4 w-4 mr-1" /> :
                      verificationAction === 'reject' ? <X className="h-4 w-4 mr-1" /> :
                      <MessageSquare className="h-4 w-4 mr-1" />
                    )}
                    {verificationAction === 'approve' && 'Approve'}
                    {verificationAction === 'reject' && 'Reject'}
                    {verificationAction === 'request_more_info' && 'Request More Info'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
