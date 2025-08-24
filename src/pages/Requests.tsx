import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import RequestForm from "@/components/requests/RequestForm";
import RequestsList from "@/components/requests/RequestsList";
import { useRequests } from "@/hooks/useRequests";

const Requests = () => {
  const [showForm, setShowForm] = useState(false);
  const { requests } = useRequests();

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    completed: requests.filter(r => r.status === 'completed').length,
    totalAmount: requests
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Deposit & Withdrawal Requests</h1>
          <p className="text-muted-foreground mt-2">
            Manage your financial transactions and track request status
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="new">New Request</TabsTrigger>
            </TabsList>
            
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            )}
          </div>

          <TabsContent value="requests" className="space-y-6">
            <RequestsList />
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div className="flex justify-center">
              <RequestForm onSuccess={() => setShowForm(false)} />
            </div>
          </TabsContent>
        </Tabs>

        {showForm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute -top-12 right-0 z-10"
                onClick={() => setShowForm(false)}
              >
                Close
              </Button>
              <RequestForm onSuccess={() => setShowForm(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;