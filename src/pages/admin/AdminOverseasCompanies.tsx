import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  DollarSign,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  RefreshCw,
  FileText,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OverseasCompanyRequest {
  id: string;
  user_id: string;
  company_names: string[];
  jurisdiction: string;
  business_type: string;
  business_description?: string;
  contact_email: string;
  status: 'pending' | 'processing' | 'name_selected' | 'completed' | 'rejected';
  submitted_at: string;
  estimated_completion?: string;
  admin_notes?: string;
  documents_requested?: string[];
  selected_company_name?: string;
  uploaded_documents?: any;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    full_name?: string;
  };
}

interface OverseasCompany {
  id: string;
  user_id: string;
  company_name: string;
  registration_number: string;
  incorporation_date: string;
  jurisdiction: string;
  status: string;
  contact_email: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    full_name?: string;
  };
}

export default function AdminOverseasCompanies() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  
  // State for requests
  const [requests, setRequests] = useState<OverseasCompanyRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<OverseasCompanyRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<OverseasCompanyRequest | null>(null);
  const [requestDetailsOpen, setRequestDetailsOpen] = useState(false);
  
  // State for companies
  const [companies, setCompanies] = useState<OverseasCompany[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<OverseasCompany[]>([]);
  
  // Common state
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"requests" | "companies">("requests");
  
  // Request management state
  const [processingRequest, setProcessingRequest] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [incorporationDate, setIncorporationDate] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // Company details state
  const [selectedCompany, setSelectedCompany] = useState<OverseasCompany | null>(null);
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (activeTab === "requests") {
      filterRequests();
    } else {
      filterCompanies();
    }
  }, [requests, companies, searchTerm, statusFilter, activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Try to fetch with user profile information using the foreign key join
      const { data: requestsData, error } = await supabase
        .from('overseas_company_requests')
        .select(`
          *,
          user:profiles!overseas_company_requests_user_id_fkey(user_id, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        
        // If the join fails, try without the join
        console.log('Join failed, trying simple select...');
        
        const { data: simpleData, error: simpleError } = await supabase
          .from('overseas_company_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (simpleError) {
          console.error('Simple select also failed:', simpleError);
          toast({
            title: "Error",
            description: "Failed to fetch overseas company requests",
            variant: "destructive",
          });
          setRequests([]);
          return;
        }

        const requestsWithUserInfo = simpleData?.map(request => ({
          ...request,
          user: {
            email: request.contact_email || 'Unknown',
            full_name: 'Unknown'
          }
        })) || [];

        setRequests(requestsWithUserInfo);
        return;
      }

      console.log('Fetched requests:', requestsData);

      const requestsWithUserInfo = requestsData?.map(request => ({
        ...request,
        user: {
          email: request.contact_email || 'Unknown',
          full_name: request.user?.full_name || 'Unknown'
        }
      })) || [];

      setRequests(requestsWithUserInfo);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch overseas company requests",
        variant: "destructive",
      });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      // Try to fetch with user profile information using the foreign key join
      const { data: companiesData, error } = await supabase
        .from('overseas_companies')
        .select(`
          *,
          user:profiles!overseas_companies_user_id_fkey(user_id, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
        
        // If the join fails, try without the join
        console.log('Join failed, trying simple select...');
        
        const { data: simpleData, error: simpleError } = await supabase
          .from('overseas_companies')
          .select('*')
          .order('created_at', { ascending: false });

        if (simpleError) {
          console.error('Simple select also failed:', simpleError);
          setCompanies([]);
          return;
        }

        const companiesWithUserInfo = simpleData?.map(company => ({
          ...company,
          user: {
            email: company.contact_email || 'Unknown',
            full_name: 'Unknown'
          }
        })) || [];

        setCompanies(companiesWithUserInfo);
        return;
      }

      const companiesWithUserInfo = companiesData?.map(company => ({
        ...company,
        user: {
          email: company.contact_email || 'Unknown',
          full_name: company.user?.full_name || 'Unknown'
        }
      })) || [];

      setCompanies(companiesWithUserInfo);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch overseas companies",
        variant: "destructive",
      });
      setCompanies([]);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.company_names.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        request.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.business_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const filterCompanies = () => {
    let filtered = companies;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(company => company.status === statusFilter);
    }

    setFilteredCompanies(filtered);
  };

  const handleProcessRequest = async (request: OverseasCompanyRequest, action: 'approve' | 'reject' | 'select_name') => {
    if (!request) return;

    try {
      setProcessingRequest(true);

      if (action === 'select_name') {
        if (!selectedCompanyName) {
          toast({
            title: "Validation Error",
            description: "Please select a company name",
            variant: "destructive",
          });
          return;
        }

        // Update request with selected company name
        const { error } = await supabase
          .from('overseas_company_requests')
          .update({
            selected_company_name: selectedCompanyName,
            status: 'name_selected',
            admin_notes: adminNotes,
            updated_at: new Date().toISOString()
          })
          .eq('id', request.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Company name selected successfully",
        });
      } else if (action === 'approve') {
        if (!registrationNumber || !incorporationDate) {
          toast({
            title: "Validation Error",
            description: "Please provide registration number and incorporation date",
            variant: "destructive",
          });
          return;
        }

        // Create the overseas company
        const { error: companyError } = await supabase
          .from('overseas_companies')
          .insert({
            user_id: request.user_id,
            company_name: request.selected_company_name || request.company_names[0],
            registration_number: registrationNumber,
            incorporation_date: incorporationDate,
            jurisdiction: request.jurisdiction,
            status: 'active',
            contact_email: request.contact_email,
            contact_phone: contactPhone
          });

        if (companyError) throw companyError;

        // Update request status to completed
        const { error: requestError } = await supabase
          .from('overseas_company_requests')
          .update({
            status: 'completed',
            admin_notes: adminNotes,
            updated_at: new Date().toISOString()
          })
          .eq('id', request.id);

        if (requestError) throw requestError;

        toast({
          title: "Success",
          description: "Request approved and company created successfully",
        });
      } else if (action === 'reject') {
        // Update request status to rejected
        const { error } = await supabase
          .from('overseas_company_requests')
          .update({
            status: 'rejected',
            admin_notes: adminNotes,
            updated_at: new Date().toISOString()
          })
          .eq('id', request.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Request rejected successfully",
        });
      }

      // Reset form
      setSelectedCompanyName("");
      setAdminNotes("");
      setRegistrationNumber("");
      setIncorporationDate("");
      setContactPhone("");
      setRequestDetailsOpen(false);

      // Refresh data
      await fetchRequests();
      await fetchCompanies();

    } catch (error) {
      console.error('Error processing request:', error);
      toast({
        title: "Error",
        description: "Failed to process request",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
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

  const getRequestStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'name_selected':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Name Selected</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCompanyStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getBusinessTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'corporation':
        return 'text-blue-600';
      case 'llc':
        return 'text-green-600';
      case 'partnership':
        return 'text-purple-600';
      case 'sole proprietorship':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Companies</h2>
          <p className="text-muted-foreground">Fetching overseas companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Overseas Companies</h1>
          <p className="text-muted-foreground mt-2">
            Manage overseas company requests and registrations
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchRequests();
              fetchCompanies();
            }}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === "requests" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("requests")}
          className="flex-1"
        >
          <FileText className="h-4 w-4 mr-2" />
          Requests ({requests.length})
        </Button>
        <Button
          variant={activeTab === "companies" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("companies")}
          className="flex-1"
        >
          <Building2 className="h-4 w-4 mr-2" />
          Companies ({companies.length})
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">
              Company requests
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered companies
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jurisdictions</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set([...companies.map(c => c.jurisdiction), ...requests.map(r => r.jurisdiction)]).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Different jurisdictions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conditional Content */}
      {activeTab === "requests" ? (
        <>
          {/* Filters */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Search and filter overseas company requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requests..."
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
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="name_selected">Name Selected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-center sm:justify-start">
                  <Badge variant="outline">
                    {filteredRequests.length} requests
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requests List */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Company Requests</CardTitle>
              <CardDescription>
                All overseas company registration requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <div key={request.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-muted/20 rounded-lg gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-medium truncate">
                              {request.selected_company_name || request.company_names[0]}
                            </p>
                            {getRequestStatusBadge(request.status)}
                            <span className={`text-sm ${getBusinessTypeColor(request.business_type)}`}>
                              {request.business_type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1 truncate">
                            {request.user?.email || 'Unknown user'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {request.jurisdiction}
                            </span>
                            <span>Submitted: {formatDate(request.submitted_at)}</span>
                            {request.company_names.length > 1 && (
                              <span>{request.company_names.length} name options</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setRequestDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setRequestDetailsOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No requests found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Filters */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Search and filter overseas companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
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
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-center sm:justify-start">
                  <Badge variant="outline">
                    {filteredCompanies.length} companies
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Companies List */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Companies</CardTitle>
              <CardDescription>
                All overseas company registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <div key={company.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-muted/20 rounded-lg gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-medium truncate">{company.company_name}</p>
                            {getCompanyStatusBadge(company.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1 truncate">
                            {company.user?.email || 'Unknown user'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {company.jurisdiction}
                            </span>
                            <span>Reg: {company.registration_number}</span>
                            <span>Created: {formatDate(company.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(company);
                            setCompanyDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No companies found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Request Details Dialog */}
      <Dialog open={requestDetailsOpen} onOpenChange={setRequestDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Review and process overseas company registration request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {selectedRequest.selected_company_name || selectedRequest.company_names[0]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.user?.email || 'Unknown user'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">Request Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <div className="mt-1">{getRequestStatusBadge(selectedRequest.status)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Business Type:</span>
                      <span className={`text-sm font-medium ${getBusinessTypeColor(selectedRequest.business_type)}`}>
                        {selectedRequest.business_type}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Jurisdiction:</span>
                      <span className="text-sm font-medium">{selectedRequest.jurisdiction}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Contact Email:</span>
                      <span className="text-sm font-medium">{selectedRequest.contact_email}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Submitted:</span>
                      <span className="text-sm font-medium">{formatDate(selectedRequest.submitted_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">Company Names</h3>
                  
                  <div className="space-y-2">
                    {selectedRequest.company_names.map((name, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedRequest.selected_company_name === name 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                        }`} />
                        <span className="text-sm">{name}</span>
                        {selectedRequest.selected_company_name === name && (
                          <Badge variant="outline" className="text-xs">Selected</Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedRequest.business_description && (
                    <div className="mt-4">
                      <span className="text-sm text-muted-foreground">Business Description:</span>
                      <p className="text-sm mt-1">{selectedRequest.business_description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">Process Request</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="selected_company_name">Select Company Name</Label>
                      <Select 
                        value={selectedCompanyName} 
                        onValueChange={setSelectedCompanyName}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a company name" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedRequest.company_names.map((name, index) => (
                            <SelectItem key={index} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="admin_notes">Admin Notes</Label>
                      <Textarea
                        id="admin_notes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add notes about this request..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleProcessRequest(selectedRequest, 'select_name')}
                        disabled={processingRequest || !selectedCompanyName}
                      >
                        {processingRequest ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Select Name
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleProcessRequest(selectedRequest, 'reject')}
                        disabled={processingRequest}
                      >
                        {processingRequest ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject Request
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Approval Form */}
              {selectedRequest.status === 'name_selected' && (
                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">Approve & Create Company</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="registration_number">Registration Number *</Label>
                      <Input
                        id="registration_number"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="Enter registration number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="incorporation_date">Incorporation Date *</Label>
                      <Input
                        id="incorporation_date"
                        type="date"
                        value={incorporationDate}
                        onChange={(e) => setIncorporationDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone">Contact Phone</Label>
                      <Input
                        id="contact_phone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Enter contact phone"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="admin_notes_approval">Admin Notes</Label>
                    <Textarea
                      id="admin_notes_approval"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about the approval..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleProcessRequest(selectedRequest, 'approve')}
                      disabled={processingRequest || !registrationNumber || !incorporationDate}
                    >
                      {processingRequest ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve & Create Company
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleProcessRequest(selectedRequest, 'reject')}
                      disabled={processingRequest}
                    >
                      {processingRequest ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Reject Request
                    </Button>
                  </div>
                </div>
              )}

              {/* Request History */}
              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-2">Request History</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <span className="text-sm font-medium">{formatDate(selectedRequest.created_at)}</span>
                  </div>
                  {selectedRequest.updated_at !== selectedRequest.created_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Updated:</span>
                      <span className="text-sm font-medium">{formatDate(selectedRequest.updated_at)}</span>
                    </div>
                  )}
                  {selectedRequest.admin_notes && (
                    <div>
                      <span className="text-sm text-muted-foreground">Admin Notes:</span>
                      <p className="text-sm mt-1">{selectedRequest.admin_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Company Details Dialog */}
      <Dialog open={companyDetailsOpen} onOpenChange={setCompanyDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
            <DialogDescription>
              View detailed information about the selected company
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedCompany.company_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCompany.user?.email || 'Unknown user'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">Company Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Registration Number:</span>
                      <span className="text-sm font-medium">{selectedCompany.registration_number}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Jurisdiction:</span>
                      <span className="text-sm font-medium">{selectedCompany.jurisdiction}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      {getCompanyStatusBadge(selectedCompany.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Incorporation Date:</span>
                      <span className="text-sm font-medium">{formatDate(selectedCompany.incorporation_date)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">Contact Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="text-sm font-medium">{selectedCompany.contact_email}</span>
                    </div>
                    {selectedCompany.contact_phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="text-sm font-medium">{selectedCompany.contact_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-xs text-muted-foreground">
                  Created: {formatDate(selectedCompany.created_at)}
                  {selectedCompany.updated_at !== selectedCompany.created_at && (
                    <span className="ml-4">Updated: {formatDate(selectedCompany.updated_at)}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
