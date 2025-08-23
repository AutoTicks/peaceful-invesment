import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import step components
import PersonalInformation from "@/components/create-account/PersonalInformation";
import ContactInformation from "@/components/create-account/ContactInformation";
import EmploymentInformation from "@/components/create-account/EmploymentInformation";
import FinancialStatus from "@/components/create-account/FinancialStatus";
import SecuritySetup from "@/components/create-account/SecuritySetup";
import DocumentUpload from "@/components/create-account/DocumentUpload";
import InvestmentExperience from "@/components/create-account/InvestmentExperience";
import ReviewSubmit from "@/components/create-account/ReviewSubmit";

export interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  socialSecurityNumber: string;
  
  // Contact Information
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Employment Information
  employmentStatus: string;
  employer: string;
  occupation: string;
  
  // Financial Status
  annualIncome: number;
  netWorth: number;
  liquidNetWorth: number;
  
  // Security Setup
  securityQuestions: Array<{ question: string; answer: string }>;
  
  // Document Upload
  documents: File[];
  
  // Investment Experience
  investmentExperience: string;
  riskTolerance: string;
  investmentGoals: string[];
  investmentTimeHorizon: string;
}

const TOTAL_STEPS = 8;

const CreateAccount = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    socialSecurityNumber: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    employmentStatus: "",
    employer: "",
    occupation: "",
    annualIncome: 0,
    netWorth: 0,
    liquidNetWorth: 0,
    securityQuestions: [
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
    documents: [],
    investmentExperience: "",
    riskTolerance: "",
    investmentGoals: [],
    investmentTimeHorizon: "",
  });
  
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profileLoading && profile?.has_completed_profile) {
      navigate("/dashboard");
    }
  }, [profile, profileLoading, navigate]);

  const updateFormData = (stepData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const validateCurrentStep = (): boolean => {
    const errors: string[] = [];
    
    switch (currentStep) {
      case 1:
        if (!formData.firstName.trim()) errors.push("First name is required");
        if (!formData.lastName.trim()) errors.push("Last name is required");
        if (!formData.dateOfBirth) errors.push("Date of birth is required");
        if (!formData.socialSecurityNumber.trim()) errors.push("Social Security Number is required");
        break;
      case 2:
        if (!formData.phone.trim()) errors.push("Phone number is required");
        if (!formData.address.trim()) errors.push("Address is required");
        if (!formData.city.trim()) errors.push("City is required");
        if (!formData.state.trim()) errors.push("State is required");
        if (!formData.zipCode.trim()) errors.push("ZIP code is required");
        break;
      case 3:
        if (!formData.employmentStatus) errors.push("Employment status is required");
        if (formData.employmentStatus === "employed" && !formData.employer.trim()) {
          errors.push("Employer is required");
        }
        break;
      case 4:
        if (!formData.annualIncome || formData.annualIncome <= 0) errors.push("Annual income is required");
        break;
      case 5:
        if (formData.securityQuestions.some(q => !q.question || !q.answer.trim())) {
          errors.push("All security questions and answers are required");
        }
        break;
      case 6:
        if (formData.documents.length === 0) errors.push("At least one document is required");
        break;
      case 7:
        if (!formData.investmentExperience) errors.push("Investment experience is required");
        if (!formData.riskTolerance) errors.push("Risk tolerance is required");
        if (formData.investmentGoals.length === 0) errors.push("At least one investment goal is required");
        break;
    }

    setStepErrors(prev => ({ ...prev, [currentStep]: errors }));
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    try {
      const profileUpdates = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        employment_status: formData.employmentStatus,
        employer: formData.employer,
        annual_income: formData.annualIncome,
        investment_experience: formData.investmentExperience,
        risk_tolerance: formData.riskTolerance,
        investment_goals: formData.investmentGoals,
        documents_uploaded: formData.documents.length > 0,
        has_completed_profile: true,
      };

      const { error } = await updateProfile(profileUpdates);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Profile Complete!",
        description: "Welcome to Peaceful Investment. Your account is now set up.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      errors: stepErrors[currentStep] || [],
    };

    switch (currentStep) {
      case 1:
        return <PersonalInformation {...stepProps} />;
      case 2:
        return <ContactInformation {...stepProps} />;
      case 3:
        return <EmploymentInformation {...stepProps} />;
      case 4:
        return <FinancialStatus {...stepProps} />;
      case 5:
        return <SecuritySetup {...stepProps} />;
      case 6:
        return <DocumentUpload {...stepProps} />;
      case 7:
        return <InvestmentExperience {...stepProps} />;
      case 8:
        return <ReviewSubmit {...stepProps} />;
      default:
        return null;
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-background pt-16 pb-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Complete Your Account Setup
          </h1>
          <p className="text-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS} - Please provide the required information to activate your investment account.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Progress: {Math.round(progress)}%</span>
            <span>{currentStep} / {TOTAL_STEPS} steps completed</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Contact Information"}
              {currentStep === 3 && "Employment Information"}
              {currentStep === 4 && "Financial Status"}
              {currentStep === 5 && "Security Setup"}
              {currentStep === 6 && "Document Upload"}
              {currentStep === 7 && "Investment Experience"}
              {currentStep === 8 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "How can we reach you?"}
              {currentStep === 3 && "Your employment details"}
              {currentStep === 4 && "Your financial information"}
              {currentStep === 5 && "Secure your account"}
              {currentStep === 6 && "Upload required documents"}
              {currentStep === 7 && "Your investment preferences"}
              {currentStep === 8 && "Review your information before submitting"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90"
                >
                  Complete Account Setup
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAccount;