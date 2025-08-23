import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  FileText, 
  History,
  DollarSign,
  Globe
} from "lucide-react";
import { useOverseasCompany } from "@/hooks/useOverseasCompany";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const JURISDICTIONS = [
  "British Virgin Islands",
  "Cayman Islands", 
  "Delaware (USA)",
  "Hong Kong",
  "Singapore",
  "Seychelles",
  "Marshall Islands",
  "Belize",
  "Cook Islands",
  "Mauritius"
];

const BUSINESS_TYPES = [
  "Trading Company",
  "Investment Company", 
  "Holding Company",
  "Technology Company",
  "Consulting Company",
  "Real Estate Company",
  "Import/Export Company",
  "Financial Services",
  "Other"
];

const OverseasCompany = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    requests, 
    companyInfo, 
    loading, 
    submitRequest, 
    uploadDocuments 
  } = useOverseasCompany();

  const [formData, setFormData] = useState({
    companyName1: "",
    companyName2: "", 
    companyName3: "",
    jurisdiction: "",
    businessType: "",
    businessDescription: "",
    contactEmail: user?.email || "",
  });

  const [files, setFiles] = useState<FileList | null>(null);

  const currentRequest = requests?.[0];
  const hasActiveRequest = currentRequest && currentRequest.status !== 'completed' && currentRequest.status !== 'rejected';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName1 || !formData.jurisdiction || !formData.businessType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const companyNames = [
      formData.companyName1,
      formData.companyName2,
      formData.companyName3
    ].filter(Boolean);

    try {
      await submitRequest({
        companyNames,
        jurisdiction: formData.jurisdiction,
        businessType: formData.businessType,
        businessDescription: formData.businessDescription,
        contactEmail: formData.contactEmail
      });

      toast({
        title: "Request Submitted",
        description: "Your overseas company request has been submitted successfully."
      });

      // Reset form
      setFormData({
        companyName1: "",
        companyName2: "",
        companyName3: "",
        jurisdiction: "",
        businessType: "",
        businessDescription: "",
        contactEmail: user?.email || ""
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async () => {
    if (!files || !currentRequest) return;

    try {
      await uploadDocuments(currentRequest.id, files);
      toast({
        title: "Documents Uploaded",
        description: "Your documents have been uploaded successfully."
      });
      setFiles(null);
    } catch (error) {
      toast({
        title: "Upload Failed", 
        description: "Failed to upload documents. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'completed': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-700 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Overseas Company Registration
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Register your international company with full support from Peaceful Investment. 
            All fees covered with minimum $6,000 balance.
          </p>
        </div>

        {/* Service Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">All Fees Covered</h3>
              <p className="text-sm text-muted-foreground">
                Complete registration with no additional costs
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">6-9 Business Days</h3>
              <p className="text-sm text-muted-foreground">
                Fast processing with dedicated support
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Globe className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Global Jurisdictions</h3>
              <p className="text-sm text-muted-foreground">
                Multiple offshore locations available
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="request" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="request">New Request</TabsTrigger>
            <TabsTrigger value="status">Current Status</TabsTrigger>
            <TabsTrigger value="company">Company Info</TabsTrigger>
          </TabsList>

          {/* New Request Tab */}
          <TabsContent value="request">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Registration Request
                </CardTitle>
                <CardDescription>
                  Submit your company registration details. Provide 3 name choices in order of preference.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasActiveRequest && (
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You have an active request in progress. Please wait for completion before submitting a new request.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="companyName1">
                        First Choice Company Name *
                      </Label>
                      <Input
                        id="companyName1"
                        value={formData.companyName1}
                        onChange={(e) => setFormData({ ...formData, companyName1: e.target.value })}
                        placeholder="Enter your preferred company name"
                        disabled={hasActiveRequest}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="companyName2">
                        Second Choice Company Name
                      </Label>
                      <Input
                        id="companyName2"
                        value={formData.companyName2}
                        onChange={(e) => setFormData({ ...formData, companyName2: e.target.value })}
                        placeholder="Enter alternative company name"
                        disabled={hasActiveRequest}
                      />
                    </div>

                    <div>
                      <Label htmlFor="companyName3">
                        Third Choice Company Name
                      </Label>
                      <Input
                        id="companyName3"
                        value={formData.companyName3}
                        onChange={(e) => setFormData({ ...formData, companyName3: e.target.value })}
                        placeholder="Enter third choice company name"
                        disabled={hasActiveRequest}
                      />
                    </div>

                    <div>
                      <Label htmlFor="jurisdiction">Jurisdiction *</Label>
                      <Select 
                        value={formData.jurisdiction} 
                        onValueChange={(value) => setFormData({ ...formData, jurisdiction: value })}
                        disabled={hasActiveRequest}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select jurisdiction" />
                        </SelectTrigger>
                        <SelectContent>
                          {JURISDICTIONS.map((jurisdiction) => (
                            <SelectItem key={jurisdiction} value={jurisdiction}>
                              {jurisdiction}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select 
                        value={formData.businessType} 
                        onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                        disabled={hasActiveRequest}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="businessDescription">
                        Business Description
                      </Label>
                      <Textarea
                        id="businessDescription"
                        value={formData.businessDescription}
                        onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                        placeholder="Briefly describe your business activities"
                        className="min-h-[100px]"
                        disabled={hasActiveRequest}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="your@email.com"
                        disabled={hasActiveRequest}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full download-btn-primary"
                    disabled={loading || hasActiveRequest}
                  >
                    {loading ? "Submitting..." : "Submit Registration Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Request Status
                </CardTitle>
                <CardDescription>
                  Track your overseas company registration progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentRequest ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {currentRequest.companyNames[0]}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {currentRequest.jurisdiction} • {currentRequest.businessType}
                        </p>
                      </div>
                      <Badge className={getStatusColor(currentRequest.status)}>
                        {getStatusIcon(currentRequest.status)}
                        {currentRequest.status.charAt(0).toUpperCase() + currentRequest.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <Label className="text-sm font-medium">Submitted</Label>
                        <p className="text-sm text-muted-foreground">
                          {new Date(currentRequest.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {currentRequest.estimatedCompletion && (
                        <div>
                          <Label className="text-sm font-medium">Estimated Completion</Label>
                          <p className="text-sm text-muted-foreground">
                            {new Date(currentRequest.estimatedCompletion).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {currentRequest.adminNotes && (
                        <div>
                          <Label className="text-sm font-medium">Admin Notes</Label>
                          <p className="text-sm text-muted-foreground">
                            {currentRequest.adminNotes}
                          </p>
                        </div>
                      )}

                      {currentRequest.documentsRequested && currentRequest.documentsRequested.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Documents Requested</Label>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {currentRequest.documentsRequested.map((doc, index) => (
                              <li key={index}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Document Upload */}
                    {currentRequest.status === 'processing' && (
                      <div className="border-t pt-6">
                        <Label className="text-sm font-medium mb-3 block">
                          Upload Additional Documents
                        </Label>
                        <div className="space-y-3">
                          <Input
                            type="file"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <Button 
                            onClick={handleFileUpload}
                            disabled={!files || loading}
                            className="flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Documents
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">No Active Requests</h3>
                    <p className="text-sm text-muted-foreground">
                      You don't have any active company registration requests.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Info Tab */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Registered Companies
                </CardTitle>
                <CardDescription>
                  View your successfully registered companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                {companyInfo && companyInfo.length > 0 ? (
                  <div className="space-y-4">
                    {companyInfo.map((company) => (
                      <Card key={company.id} className="border-l-4 border-l-primary">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {company.companyName}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Registration: {company.registrationNumber}
                              </p>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label className="font-medium">Incorporation Date</Label>
                                  <p className="text-muted-foreground">
                                    {new Date(company.incorporationDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <Label className="font-medium">Jurisdiction</Label>
                                  <p className="text-muted-foreground">{company.jurisdiction}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Status</Label>
                                  <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                                    {company.status}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="font-medium">Contact</Label>
                                  <p className="text-muted-foreground">{company.contactEmail}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">No Registered Companies</h3>
                    <p className="text-sm text-muted-foreground">
                      You don't have any registered companies yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OverseasCompany;