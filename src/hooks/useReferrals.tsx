import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface Referral {
  id: string;
  user_id: string;
  referral_code: string;
  referral_link: string;
  is_active: boolean;
  status: 'pending' | 'deposited' | 'earning' | 'completed';
  total_referrals: number;
  total_earnings: number;
  year_to_date_earnings: number;
  initial_deposit?: number;
  deposit_date?: string;
  created_at: string;
  updated_at: string;
}

interface ReferralPayment {
  id: string;
  referral_id: string;
  amount: number;
  payment_date: string;
  notes?: string;
  created_at: string;
}

interface ReferralSignup {
  id: string;
  referral_id: string;
  referred_user_id: string;
  signup_date: string;
  deposit_amount?: number;
  deposit_date?: string;
  created_at: string;
}

export const useReferrals = () => {
  const { user } = useAuth();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [payments, setPayments] = useState<ReferralPayment[]>([]);
  const [signups, setSignups] = useState<ReferralSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's referral data
  const fetchReferralData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get user's referral
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (referralError && referralError.code !== 'PGRST116') {
        throw referralError;
      }

      setReferral(referralData as Referral);

      if (referralData) {
        // Get payments for this referral
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('referral_payments')
          .select('*')
          .eq('referral_id', referralData.id)
          .order('payment_date', { ascending: false });

        if (paymentsError) throw paymentsError;
        setPayments(paymentsData || []);

        // Get signups for this referral
        const { data: signupsData, error: signupsError } = await supabase
          .from('referral_signups')
          .select('*')
          .eq('referral_id', referralData.id)
          .order('signup_date', { ascending: false });

        if (signupsError) throw signupsError;
        setSignups(signupsData || []);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch referral data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate referral link
  const generateReferralLink = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to generate a referral link",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('generate-referral', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      setReferral(data.referral);
      toast({
        title: "Success",
        description: "Referral link generated successfully!",
      });

      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to generate referral link",
        variant: "destructive",
      });
    }
  };

  // Copy referral link to clipboard
  const copyReferralLink = async () => {
    if (!referral) return;

    try {
      await navigator.clipboard.writeText(referral.referral_link);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  // Send invitation email
  const sendInvitation = async (email: string, subject: string, message: string) => {
    if (!referral) {
      toast({
        title: "Error",
        description: "No referral link found. Please generate one first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-referral-invitation', {
        body: {
          referral_code: referral.referral_code,
          to_email: email,
          subject,
          message,
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invitation sent successfully!",
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, [user]);

  return {
    referral,
    payments,
    signups,
    loading,
    error,
    generateReferralLink,
    copyReferralLink,
    sendInvitation,
    refetch: fetchReferralData,
  };
};