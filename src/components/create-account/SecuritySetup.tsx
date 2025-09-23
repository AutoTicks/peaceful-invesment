import { FormData } from "@/pages/CreateAccount";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

interface SecuritySetupProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: string[];
}

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "In what city were you born?",
  "What was your childhood nickname?",
  "What is the name of your favorite childhood friend?",
  "What street did you live on in third grade?",
  "What was the make of your first car?",
  "What was the name of the school you attended in sixth grade?",
  "In what town was your first job?",
  "What was your favorite food as a child?",
  "What was the last name of your third grade teacher?",
];

const SecuritySetup = ({ formData, updateFormData, errors }: SecuritySetupProps) => {
  const updateSecurityQuestion = (index: number, field: 'question' | 'answer', value: string) => {
    const newQuestions = [...formData.securityQuestions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    updateFormData({ securityQuestions: newQuestions });
  };

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

      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Security Questions</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Security questions help protect your account and can be used to verify your identity if you need to reset your password.
      </p>

      {formData.securityQuestions.map((qa, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <h4 className="font-medium">Security Question {index + 1}</h4>
          
          <div className="space-y-2">
            <Label htmlFor={`question-${index}`}>Question *</Label>
            <Select 
              value={qa.question} 
              onValueChange={(value) => updateSecurityQuestion(index, 'question', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a security question" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                {SECURITY_QUESTIONS.filter(q => 
                  q === qa.question || !formData.securityQuestions.some(existing => existing.question === q)
                ).map((question) => (
                  <SelectItem key={question} value={question}>
                    {question}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`answer-${index}`}>Answer *</Label>
            <Input
              id={`answer-${index}`}
              value={qa.answer}
              onChange={(e) => updateSecurityQuestion(index, 'answer', e.target.value)}
              placeholder="Enter your answer"
              type="text"
            />
            <p className="text-xs text-muted-foreground">
              Keep your answer simple and memorable. Avoid special characters.
            </p>
          </div>
        </div>
      ))}

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Make sure to remember your answers exactly as you type them. 
          These questions are case-sensitive and will be used for account recovery.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SecuritySetup;