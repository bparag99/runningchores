import { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Users,
  DollarSign,
  FileCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
  Target,
  ListChecks,
  Briefcase,
  Bell,
  Activity,
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { CircularProgress } from './CircularProgress';
import { DashboardCard } from './DashboardCard';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';
import { MiniChart } from './MiniChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

// Sample data for charts
const budgetData = [
  { category: 'Catering', allocated: 12500, spent: 8500 },
  { category: 'Decor', allocated: 8000, spent: 6200 },
  { category: 'Photography', allocated: 5000, spent: 5000 },
  { category: 'Venue', allocated: 15000, spent: 15000 },
  { category: 'Entertainment', allocated: 4500, spent: 2500 },
];

const taskStatusData = [
  { name: 'Completed', value: 42, color: '#10B981' },
  { name: 'In Progress', value: 18, color: '#3B82F6' },
  { name: 'Pending', value: 12, color: '#F59E0B' },
  { name: 'Blocked', value: 3, color: '#EF4444' },
];

const vendorPerformanceData = [
  { vendor: 'Catering Co.', rating: 98, onTime: 95, budget: 92 },
  { vendor: 'Decor Plus', rating: 85, onTime: 90, budget: 88 },
  { vendor: 'DJ Services', rating: 72, onTime: 70, budget: 95 },
  { vendor: 'Photo Pro', rating: 95, onTime: 98, budget: 100 },
  { vendor: 'Venue Mgmt', rating: 90, onTime: 92, budget: 98 },
];

const weeklyProgressData = [
  { week: 'W1', completion: 15 },
  { week: 'W2', completion: 28 },
  { week: 'W3', completion: 45 },
  { week: 'W4', completion: 62 },
  { week: 'W5', completion: 78 },
];

export function CRMDashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-semibold flex items-center gap-2">
                <Activity size={32} className="text-brand-primary" />
                Event Operations Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time overview of Priya & Raj's Wedding Events
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeframe('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeframe === 'week'
                    ? 'bg-brand-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeframe('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeframe === 'month'
                    ? 'bg-brand-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeframe('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeframe === 'all'
                    ? 'bg-brand-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Top KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Overall Event Readiness"
            value={78}
            percentage={100}
            icon={<Target size={24} />}
            status="info"
            trend="up"
            trendValue="+12%"
            subtitle="On track for completion"
          />
          <MetricCard
            title="Tasks Completed"
            value={42}
            percentage={75}
            icon={<ListChecks size={24} />}
            status="success"
            trend="up"
            trendValue="+8 this week"
            subtitle="33 remaining"
          />
          <MetricCard
            title="Budget Utilization"
            value="$37.2K"
            subtitle="of $45K allocated"
            icon={<DollarSign size={24} />}
            status="warning"
            percentage={83}
            trend="up"
            trendValue="+$5.2K"
          />
          <MetricCard
            title="Vendor Confirmations"
            value={18}
            percentage={90}
            icon={<Briefcase size={24} />}
            status="success"
            trend="up"
            trendValue="+3 confirmed"
            subtitle="2 pending response"
          />
        </div>

        {/* Event Readiness & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Readiness */}
          <DashboardCard
            title="Overall Readiness"
            badge={<StatusBadge variant="info">In Progress</StatusBadge>}
          >
            <div className="flex justify-center py-4">
              <CircularProgress percentage={78} size={160} label="Event Ready" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-status-success-light rounded-lg">
                <p className="text-2xl font-semibold text-status-success">4</p>
                <p className="text-xs text-muted-foreground">Events Complete</p>
              </div>
              <div className="text-center p-3 bg-status-info-light rounded-lg">
                <p className="text-2xl font-semibold text-status-info">2</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </DashboardCard>

          {/* Weekly Progress */}
          <DashboardCard title="Progress Trend" badge={<StatusBadge variant="success">+15% This Week</StatusBadge>}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completion"
                  stroke="var(--color-brand-primary)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-brand-primary)', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>

          {/* Quick Stats */}
          <DashboardCard title="Quick Stats">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Days Until Event</span>
                  <span className="text-lg font-semibold">6 days</span>
                </div>
                <ProgressBar percentage={85} showLabel={false} size="compact" />
              </div>

              <div className="pt-3 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-status-success" />
                    <span className="text-sm">Approvals</span>
                  </div>
                  <span className="text-sm font-semibold">15/18</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-status-warning" />
                    <span className="text-sm">Pending Items</span>
                  </div>
                  <span className="text-sm font-semibold">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-status-error" />
                    <span className="text-sm">Critical Alerts</span>
                  </div>
                  <span className="text-sm font-semibold">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-status-info" />
                    <span className="text-sm">Active Team</span>
                  </div>
                  <span className="text-sm font-semibold">12</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Budget & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Breakdown */}
          <DashboardCard
            title="Budget Allocation & Spending"
            badge={<StatusBadge variant="success">83% Utilized</StatusBadge>}
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="category" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="allocated" fill="var(--color-status-info)" name="Allocated" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" fill="var(--color-status-success)" name="Spent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Total Budget</p>
                <p className="text-lg font-semibold">$45,000</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className="text-lg font-semibold text-status-success">$37,200</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="text-lg font-semibold text-status-warning">$7,800</p>
              </div>
            </div>
          </DashboardCard>

          {/* Task Distribution */}
          <DashboardCard
            title="Task Distribution"
            badge={<StatusBadge variant="info">75 Total Tasks</StatusBadge>}
          >
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {taskStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                    <p className="text-sm font-semibold">{item.value} tasks</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Individual Event Progress */}
        <DashboardCard title="Individual Event Progress">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Mehndi Night</h4>
                  <StatusBadge variant="success">Complete</StatusBadge>
                </div>
                <ProgressBar percentage={100} showLabel={false} size="compact" />
                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                  <div>
                    <p className="text-muted-foreground">Tasks</p>
                    <p className="font-semibold">12/12</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-semibold">95%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vendors</p>
                    <p className="font-semibold">8/8</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Sangeet</h4>
                  <StatusBadge variant="success">Complete</StatusBadge>
                </div>
                <ProgressBar percentage={100} showLabel={false} size="compact" />
                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                  <div>
                    <p className="text-muted-foreground">Tasks</p>
                    <p className="font-semibold">15/15</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-semibold">88%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vendors</p>
                    <p className="font-semibold">6/6</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Haldi Ceremony</h4>
                  <StatusBadge variant="info">In Progress</StatusBadge>
                </div>
                <ProgressBar percentage={85} showLabel={false} size="compact" />
                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                  <div>
                    <p className="text-muted-foreground">Tasks</p>
                    <p className="font-semibold">9/11</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-semibold">78%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vendors</p>
                    <p className="font-semibold">4/5</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Wedding Ceremony</h4>
                  <StatusBadge variant="warning">Planning</StatusBadge>
                </div>
                <ProgressBar percentage={62} showLabel={false} size="compact" />
                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                  <div>
                    <p className="text-muted-foreground">Tasks</p>
                    <p className="font-semibold">14/20</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-semibold">65%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vendors</p>
                    <p className="font-semibold">7/10</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Reception</h4>
                  <StatusBadge variant="warning">Planning</StatusBadge>
                </div>
                <ProgressBar percentage={58} showLabel={false} size="compact" />
                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                  <div>
                    <p className="text-muted-foreground">Tasks</p>
                    <p className="font-semibold">11/18</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-semibold">72%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vendors</p>
                    <p className="font-semibold">5/8</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Cocktail Party</h4>
                  <StatusBadge variant="pending">Not Started</StatusBadge>
                </div>
                <ProgressBar percentage={25} showLabel={false} size="compact" />
                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                  <div>
                    <p className="text-muted-foreground">Tasks</p>
                    <p className="font-semibold">3/12</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-semibold">30%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vendors</p>
                    <p className="font-semibold">2/6</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Vendor Performance & Critical Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vendor Performance */}
          <div className="lg:col-span-2">
            <DashboardCard title="Vendor Performance Metrics">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vendorPerformanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                  <YAxis dataKey="vendor" type="category" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="rating" fill="var(--color-brand-primary)" name="Quality Rating" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="onTime" fill="var(--color-status-success)" name="On-Time %" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="budget" fill="var(--color-brand-accent)" name="Budget %" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </DashboardCard>
          </div>

          {/* Critical Items */}
          <DashboardCard
            title="Critical Items"
            badge={<StatusBadge variant="error">2 Urgent</StatusBadge>}
          >
            <div className="space-y-3">
              <div className="p-3 bg-status-error-light border border-status-error rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle size={16} className="text-status-error mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">DJ Confirmation Overdue</p>
                    <p className="text-xs text-muted-foreground">Due 2 days ago</p>
                  </div>
                </div>
                <button className="text-xs text-status-error font-medium hover:underline">
                  Follow up now →
                </button>
              </div>

              <div className="p-3 bg-status-error-light border border-status-error rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle size={16} className="text-status-error mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Catering Final Count</p>
                    <p className="text-xs text-muted-foreground">Due in 1 day</p>
                  </div>
                </div>
                <button className="text-xs text-status-error font-medium hover:underline">
                  Update count →
                </button>
              </div>

              <div className="p-3 bg-status-warning-light border border-status-warning rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <Clock size={16} className="text-status-warning mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Decor Approval Pending</p>
                    <p className="text-xs text-muted-foreground">Waiting 3 days</p>
                  </div>
                </div>
                <button className="text-xs text-status-warning font-medium hover:underline">
                  Review now →
                </button>
              </div>

              <div className="p-3 bg-status-warning-light border border-status-warning rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <FileCheck size={16} className="text-status-warning mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Venue Contract Review</p>
                    <p className="text-xs text-muted-foreground">Due in 2 days</p>
                  </div>
                </div>
                <button className="text-xs text-status-warning font-medium hover:underline">
                  Review contract →
                </button>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Team Activity & Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Activity */}
          <DashboardCard title="Team Activity">
            <div className="space-y-3">
              {[
                { name: 'Sarah Chen', action: 'Completed venue walkthrough', time: '2 hours ago', avatar: 'SC' },
                { name: 'Michael Rodriguez', action: 'Updated catering menu', time: '4 hours ago', avatar: 'MR' },
                { name: 'Priya Sharma', action: 'Approved decor mockups', time: '5 hours ago', avatar: 'PS' },
                { name: 'James Wilson', action: 'Confirmed DJ availability', time: '1 day ago', avatar: 'JW' },
                { name: 'Aisha Patel', action: 'Uploaded ceremony photos', time: '1 day ago', avatar: 'AP' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-md transition-colors">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 border-2 border-brand-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-brand-primary">{activity.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Pending Approvals */}
          <DashboardCard
            title="Pending Approvals"
            badge={<StatusBadge variant="warning">5 Awaiting</StatusBadge>}
          >
            <div className="space-y-3">
              {[
                { item: 'Catering Menu - Reception', amount: '$12,500', urgency: 'high' },
                { item: 'Floral Arrangements - Ceremony', amount: '$3,200', urgency: 'medium' },
                { item: 'Photography Package Upgrade', amount: '$1,500', urgency: 'low' },
                { item: 'Entertainment Contract - DJ', amount: '$4,500', urgency: 'high' },
                { item: 'Transportation Schedule', amount: '$2,800', urgency: 'medium' },
              ].map((approval, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-brand-primary transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{approval.item}</p>
                    <p className="text-xs text-muted-foreground">{approval.amount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {approval.urgency === 'high' && (
                      <span className="w-2 h-2 rounded-full bg-status-error" title="High priority" />
                    )}
                    {approval.urgency === 'medium' && (
                      <span className="w-2 h-2 rounded-full bg-status-warning" title="Medium priority" />
                    )}
                    <button className="px-3 py-1 bg-brand-primary text-white text-xs rounded-md hover:bg-brand-primary/90">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
