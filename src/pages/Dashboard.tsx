import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Activity, DollarSign, BarChart3, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

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

        {/* Trading Platform Access */}
        <Card className="mb-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl">Professional Trading Platform</CardTitle>
                  <CardDescription className="text-base">
                    Access advanced charts, real-time data, and professional trading tools
                  </CardDescription>
                </div>
              </div>
              <Link to="/trading">
                <Button size="lg" className="gap-2">
                  Launch Trading Platform
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Real-time Charts</p>
                  <p className="text-sm text-muted-foreground">Advanced technical analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Live Trading</p>
                  <p className="text-sm text-muted-foreground">Execute trades instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Portfolio Management</p>
                  <p className="text-sm text-muted-foreground">Track your investments</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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