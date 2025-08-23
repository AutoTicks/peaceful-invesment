import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMetaTraderAccounts } from "@/hooks/useMetaTraderAccounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, DollarSign, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MetaTraderAccounts() {
  const { user } = useAuth();
  const { accounts, loading, error, refetch } = useMetaTraderAccounts();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20';
      case 'inactive':
        return 'bg-red-500/10 text-red-600 hover:bg-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAccountTypeColor = (type: string) => {
    return type === 'live' 
      ? 'bg-primary/10 text-primary hover:bg-primary/20'
      : 'bg-secondary/10 text-secondary-foreground hover:bg-secondary/20';
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Accounts Refreshed",
        description: "Your MetaTrader accounts have been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh account data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground">Please sign in to view your MetaTrader accounts.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Your Accounts</h2>
          <p className="text-muted-foreground">Fetching your MetaTrader account data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Accounts</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">MetaTrader Accounts</h1>
            <p className="text-muted-foreground">
              Monitor and manage your trading accounts in real-time
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            className="glass"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Accounts Grid */}
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <Card className="glass-card max-w-md mx-auto">
              <CardContent className="pt-6">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Accounts Found</h3>
                <p className="text-muted-foreground">
                  You don't have any MetaTrader accounts set up yet. Connect your accounts to start trading.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className="glass-card hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        #{account.login}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{account.server}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(account.status)}>
                        {account.status}
                      </Badge>
                      <Badge className={getAccountTypeColor(account.account_type)}>
                        {account.account_type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Balance Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Balance
                      </p>
                      <p className="text-lg font-semibold text-emerald-600">
                        {formatCurrency(account.balance, account.currency)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Equity
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(account.equity, account.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Margin Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Margin Used
                      </p>
                      <p className="text-sm font-medium text-amber-600">
                        {formatCurrency(account.margin, account.currency)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Free Margin
                      </p>
                      <p className="text-sm font-medium text-emerald-600">
                        {formatCurrency(account.free_margin, account.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-3 border-t border-border/20">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Leverage: 1:{account.leverage}</span>
                      <span>
                        Updated: {new Date(account.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}