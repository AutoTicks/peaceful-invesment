import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface CompanyRequest {
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
  created_at: string;
  updated_at: string;
}

export interface CompanyInfo {
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
}

export interface RequestFormData {
  companyNames: string[];
  jurisdiction: string;
  businessType: string;
  businessDescription?: string;
  contactEmail: string;
}

export const useOverseasCompany = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CompanyRequest[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch company requests
  const fetchRequests = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('overseas_company_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  // Fetch company information
  const fetchCompanyInfo = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('overseas_companies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanyInfo(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company info');
    }
  };

  // Submit new request
  const submitRequest = async (formData: RequestFormData) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('overseas_company_requests')
        .insert({
          user_id: user.id,
          company_names: formData.companyNames,
          jurisdiction: formData.jurisdiction,
          business_type: formData.businessType,
          business_description: formData.businessDescription,
          contact_email: formData.contactEmail,
          status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh requests
      await fetchRequests();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  // Upload documents
  const uploadDocuments = async (requestId: string, files: FileList) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      setLoading(true);
      const uploadedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${requestId}/${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('overseas-company-documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        uploadedFiles.push({
          name: file.name,
          path: uploadData.path,
          size: file.size,
          type: file.type
        });
      }

      // Update request with uploaded documents
      const { error: updateError } = await supabase
        .from('overseas_company_requests')
        .update({
          uploaded_documents: uploadedFiles,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await fetchRequests();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to upload documents');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and user change
  useEffect(() => {
    if (user?.id) {
      fetchRequests();
      fetchCompanyInfo();
    }
  }, [user?.id]);

  return {
    requests,
    companyInfo,
    loading,
    error,
    submitRequest,
    uploadDocuments,
    refetch: () => {
      fetchRequests();
      fetchCompanyInfo();
    }
  };
};