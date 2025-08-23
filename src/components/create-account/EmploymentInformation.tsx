import { FormData } from "@/pages/CreateAccount";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmploymentInformationProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: string[];
}

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "employed", label: "Employed Full-Time" },
  { value: "part-time", label: "Employed Part-Time" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "retired", label: "Retired" },
  { value: "student", label: "Student" },
  { value: "homemaker", label: "Homemaker" },
];

const EmploymentInformation = ({ formData, updateFormData, errors }: EmploymentInformationProps) => {
  const showEmployerFields = ["employed", "part-time"].includes(formData.employmentStatus);

  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="employmentStatus">Employment Status *</Label>
        <Select 
          value={formData.employmentStatus} 
          onValueChange={(value) => updateFormData({ employmentStatus: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your employment status" />
          </SelectTrigger>
          <SelectContent>
            {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showEmployerFields && (
        <>
          <div className="space-y-2">
            <Label htmlFor="employer">Employer Name *</Label>
            <Input
              id="employer"
              value={formData.employer}
              onChange={(e) => updateFormData({ employer: e.target.value })}
              placeholder="Enter your employer's name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Job Title/Occupation</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => updateFormData({ occupation: e.target.value })}
              placeholder="Enter your job title or occupation"
            />
          </div>
        </>
      )}

      {formData.employmentStatus === "self-employed" && (
        <div className="space-y-2">
          <Label htmlFor="occupation">Business/Occupation *</Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) => updateFormData({ occupation: e.target.value })}
            placeholder="Describe your business or occupation"
          />
        </div>
      )}

      {["retired", "unemployed"].includes(formData.employmentStatus) && (
        <div className="p-4 bg-muted/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {formData.employmentStatus === "retired" 
              ? "As a retiree, you may have different income sources. We'll ask about your financial details in the next step."
              : "We understand you're currently between jobs. Please provide your financial information in the next step to help us serve you better."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default EmploymentInformation;