"use client";

import { SubscriptionPackage } from "@/app/types/subscription";
import { MostPopularPkg } from "@/components/MostPopularPkg";
import { RecentSubscribersList } from "@/components/RecentSubscribersList";
import { SubGroupChart } from "@/components/SubGroupChart";
import { SubscriptionDialog } from "@/components/SubscriptionDialog";
import { SubscriptionMetrics } from "@/components/SubscriptionMetrics";
import { useEffect, useState } from "react";

const recentBuyers = [
  { name: "Alice Tran", plan: "Premium", date: "2025-06-28" },
  { name: "Minh Pham", plan: "Basic", date: "2025-06-28" },
  { name: "Linh Nguyen", plan: "Pro", date: "2025-06-27" },
  { name: "John Do", plan: "Basic", date: "2025-06-26" },
  { name: "David Le", plan: "Premium", date: "2025-06-26" },
  { name: "Hannah Vu", plan: "Pro", date: "2025-06-25" },
  { name: "Tommy Bui", plan: "Basic", date: "2025-06-25" },
  { name: "Emily Nguyen", plan: "Premium", date: "2025-06-24" },
  { name: "Nathan Tran", plan: "Pro", date: "2025-06-24" },
  { name: "Sophie Ha", plan: "Basic", date: "2025-06-23" },
  { name: "Daniel Pham", plan: "Premium", date: "2025-06-22" },
  { name: "Olivia Mai", plan: "Pro", date: "2025-06-22" },
  { name: "Chris Nguyen", plan: "Basic", date: "2025-06-21" },
  { name: "Kelly Dang", plan: "Premium", date: "2025-06-21" },
];

export default function Subscription() {
  const [subscriptionPackages, setSubscriptionPackages] = useState<
    SubscriptionPackage[]
  >([]);

  const [dashboardData, setDashboardData] = useState({
    subscriptionRevenue: 0,
    subscriptionRevenueFluct: 0,
    subscriber: 0,
    subscriberFluct: 0,
    newSubscriber: 0,
    newSubscriberFluct: 0,
    quittedSubscriber: 0,
    quittedSubscriberFluct: 0,
    recentSubscribers: [] as { name: string; plan: string; date: string }[],
    mostPopularTier: {
      percentage: 0,
      subscriptionName: "",
      numberOfSubscriber: 0,
    },
  });

  const fetchSubscriptions = () => {
    fetch("/api/subscription")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.data)) {
          setSubscriptionPackages(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch subscriptions:", err));
  };

  // For user subscription bought that week idk
  useEffect(() => {
    fetch("/api/subscription/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDashboardData(data.data);
      });
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="flex gap-6 mt-4 h-[90vh]">
      {/* LEFT */}
      <div className="flex flex-col gap-4 w-3/4">
        <SubscriptionMetrics data={dashboardData} />
        <RecentSubscribersList buyers={recentBuyers} />
      </div>

      {/* RIGHT */}
      <div className="w-1/4 bg-card p-4 rounded-lg">
        <SubscriptionDialog
          subscriptionPackages={subscriptionPackages}
          fetchSubscriptions={fetchSubscriptions}
        />
        <SubGroupChart />
        <MostPopularPkg
          subscriptionName={dashboardData.mostPopularTier.subscriptionName}
          numberOfSubscriber={dashboardData.mostPopularTier.numberOfSubscriber}
          percentage={dashboardData.mostPopularTier.percentage}
        />
      </div>
    </div>
  );
}
