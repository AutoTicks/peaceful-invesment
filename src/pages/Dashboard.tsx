import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Activity, DollarSign } from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    {
      title: "Total Balance",
      value: "$12,543.90",
      description: "Portfolio value",
      icon: DollarSign,
      trend: "+12.5%"
    },
    {
      title: "Active Bots",
      value: "5",
      description: "Running strategies",
      icon: Activity,
      trend: "+2"
    },
    {
      title: "Monthly Profit",
      value: "$1,234.56",
      description: "This month's return",
      icon: TrendingUp,
      trend: "+8.2%"
    },
    {
      title: "Win Rate",
      value: "73.4%",
      description: "Success percentage",
      icon: Shield,
      trend: "+2.1%"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user.email}
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor your MetaTrader bots and trading performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="text-xs text-primary mt-1">
                  {stat.trend} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bot Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Active Trading Bots</CardTitle>
              <CardDescription>
                Manage your automated trading strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Scalping Bot A", status: "Active", profit: "+$234.50" },
                  { name: "Trend Following", status: "Active", profit: "+$567.30" },
                  { name: "Grid Trading", status: "Paused", profit: "+$123.45" },
                ].map((bot) => (
                  <div key={bot.name} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <p className="font-medium">{bot.name}</p>
                      <p className="text-sm text-muted-foreground">{bot.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">{bot.profit}</p>
                      <p className="text-sm text-muted-foreground">24h</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest trades and bot actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "EURUSD Buy", time: "2 min ago", result: "+$45.30" },
                  { action: "GBPJPY Sell", time: "15 min ago", result: "+$23.10" },
                  { action: "Bot Started", time: "1 hour ago", result: "Scalping Bot A" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">{activity.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;