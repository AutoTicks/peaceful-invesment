import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authenticateAsAdmin, getUserByEmail, getAccountsByUserId } from '@/integrations/pocketbase/client';
import { useAuth } from '@/hooks/useAuth';

export default function PocketBaseDebug() {
  const { user } = useAuth();
  const [status, setStatus] = useState<string>('Ready to test');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');

    try {
      // Test 1: Admin Authentication
      setStatus('Testing admin authentication...');
      const authResult = await authenticateAsAdmin();
      console.log('Auth result:', authResult);

      // Test 2: Get user by email
      if (user?.email) {
        setStatus('Testing user lookup...');
        const pocketbaseUser = await getUserByEmail(user.email);
        console.log('PocketBase user:', pocketbaseUser);

        if (pocketbaseUser) {
          // Test 3: Get accounts
          setStatus('Testing accounts fetch...');
          const accounts = await getAccountsByUserId(pocketbaseUser.id);
          console.log('Accounts:', accounts);
          setStatus(`Success! Found ${accounts.length} accounts for user ${pocketbaseUser.name}`);
        } else {
          setStatus('User not found in PocketBase');
        }
      } else {
        setStatus('No user email available');
      }
    } catch (error) {
      console.error('Test failed:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>PocketBase Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Current user: {user?.email || 'Not logged in'}
        </div>
        
        <Button 
          onClick={testConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test PocketBase Connection'}
        </Button>
        
        <div className="text-sm">
          <strong>Status:</strong> {status}
        </div>
      </CardContent>
    </Card>
  );
}
