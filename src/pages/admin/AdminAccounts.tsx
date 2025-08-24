import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CreditCard, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Activity,
  Loader2,
  User,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { 
  authenticateAsAdmin, 
  pocketbase,
  type PocketBaseAccount 
} from "@/integrations/pocketbase/client";
import { useToast } from "@/hooks/use-toast";

interface AccountWithUser extends Omit<PocketBaseAccount, 'user'> {
  user: string; // Keep the original user ID
  userInfo?: {
    email: string;
    name?: string;
  };
}

export default function AdminAccounts() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<AccountWithUser[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<AccountWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState<AccountWithUser | null>(null);
  const [accountDetailsOpen, setAccountDetailsOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [accounts, searchTerm, statusFilter]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      
      // Authenticate as admin
      await authenticateAsAdmin();

      // Fetch all accounts from PocketBase
      const accountsResponse = await pocketbase.collection('accounts').getList(1, 1000, {
        sort: '-created',
        expand: 'user'
      });

      // Fetch all users from PocketBase to get email addresses
      const usersResponse = await pocketbase.collection('users').getList(1, 1000);

      // Combine account data with user information
      const accountsWithUsers: AccountWithUser[] = accountsResponse.items.map(account => {
        const user = usersResponse.items.find(user => user.id === account.user);
        return {
          id: account.id,
          name: account.name,
          meta_trader_id: account.meta_trader_id,
          balance: account.balance,
          equity: account.equity,
          margin: account.margin,
          total_pnl: account.total_pnl,
          status: account.status,
          user: account.user,
          created: account.created,
          updated: account.updated,
          expire_date: account.expire_date,
          symbols: account.symbols,
          collaborators: account.collaborators,
          config: account.config,
          userInfo: {
            email: user?.email || 'Unknown',
            name: user?.name || 'Unknown'
          }
        };
      });

      setAccounts(accountsWithUsers);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAccounts = () => {
    let filtered = accounts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(account =>
        account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.userInfo?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.meta_trader_id?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(account => account.status === statusFilter);
    }

    setFilteredAccounts(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
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

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPnlIcon = (pnl: number) => {
    return pnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const calculateTotalValue = () => {
    return accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  };

  const calculateTotalPnl = () => {
    return accounts.reduce((sum, account) => sum + (account.total_pnl || 0), 0);
  };

  const getActiveAccountsCount = () => {
    return accounts.filter(account => account.status === 'ACTIVE').length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Accounts</h2>
          <p className="text-muted-foreground">Fetching trading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trading Accounts</h1>
          <p className="text-muted-foreground mt-2">
            Manage MetaTrader trading accounts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-xs text-muted-foreground">
              {getActiveAccountsCount()} active
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(calculateTotalValue())}</div>
            <p className="text-xs text-muted-foreground">
              Portfolio value
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPnlColor(calculateTotalPnl())}`}>
              {formatCurrency(calculateTotalPnl())}
            </div>
            <p className="text-xs text-muted-foreground">
              Profit/Loss
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(accounts.map(acc => acc.userInfo?.email)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              With accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Search and filter trading accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search accounts..."
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {filteredAccounts.length} accounts
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>
            All MetaTrader trading accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{account.name || `Account ${account.meta_trader_id}`}</p>
                        {getStatusBadge(account.status || 'unknown')}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.userInfo?.email || 'Unknown user'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {account.meta_trader_id} • Created: {formatDate(account.created)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(account.balance || 0)}</p>
                      <div className={`flex items-center space-x-1 text-sm ${getPnlColor(account.total_pnl || 0)}`}>
                        {getPnlIcon(account.total_pnl || 0)}
                        <span>{formatCurrency(account.total_pnl || 0)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAccount(account);
                        setAccountDetailsOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No accounts found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

             {/* Account Details Dialog */}
       <Dialog open={accountDetailsOpen} onOpenChange={setAccountDetailsOpen}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle>Account Details</DialogTitle>
             <DialogDescription>
               View detailed information about this trading account.
             </DialogDescription>
           </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedAccount.name || `Account ${selectedAccount.meta_trader_id}`}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAccount.userInfo?.email || 'Unknown user'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account ID:</span>
                  <span className="text-sm font-medium">{selectedAccount.meta_trader_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(selectedAccount.status || 'unknown')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Balance:</span>
                  <span className="text-sm font-medium">{formatCurrency(selectedAccount.balance || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Equity:</span>
                  <span className="text-sm font-medium">{formatCurrency(selectedAccount.equity || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">P&L:</span>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${getPnlColor(selectedAccount.total_pnl || 0)}`}>
                    {getPnlIcon(selectedAccount.total_pnl || 0)}
                    <span>{formatCurrency(selectedAccount.total_pnl || 0)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Margin:</span>
                  <span className="text-sm font-medium">{formatCurrency(selectedAccount.margin || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="text-sm">{formatDate(selectedAccount.created)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Updated:</span>
                  <span className="text-sm">{formatDate(selectedAccount.updated)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Account
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
