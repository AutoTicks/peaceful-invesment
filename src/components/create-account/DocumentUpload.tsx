import { FormData } from "@/pages/CreateAccount";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, X, CheckCircle } from "lucide-react";

interface DocumentUploadProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: string[];
}

const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const DocumentUpload = ({ formData, updateFormData, errors }: DocumentUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...formData.documents, ...acceptedFiles];
    updateFormData({ documents: newFiles });
  }, [formData.documents, updateFormData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const removeFile = (index: number) => {
    const newFiles = formData.documents.filter((_, i) => i !== index);
    updateFormData({ documents: newFiles });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Required Documents</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please upload at least one of the following documents for identity verification:
          </p>
          
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Driver's License (front and back)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Passport (photo page)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              State ID Card (front and back)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Bank Statement (recent, within 90 days)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Utility Bill (recent, within 90 days)
            </li>
          </ul>
        </div>

        {/* Upload Area */}
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-primary">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Accepted formats: JPG, PNG, PDF (max 5MB each)
                  </p>
                  <Button variant="outline">Browse Files</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {formData.documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Uploaded Documents ({formData.documents.length})</h4>
            <div className="space-y-2">
              {formData.documents.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Alert>
          <Upload className="h-4 w-4" />
          <AlertDescription>
            <strong>Privacy Notice:</strong> All uploaded documents are encrypted and stored securely. 
            We use this information only for identity verification and regulatory compliance.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default DocumentUpload;