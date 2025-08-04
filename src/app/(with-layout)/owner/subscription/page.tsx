"use client";

import { DashboardData, SubscriptionPackage } from "@/app/types/subscription";
import { MostPopularPkg } from "@/components/MostPopularPkg";
import { RecentSubscribersList } from "@/components/RecentSubscribersList";
import { SubGroupChart } from "@/components/SubGroupChart";
import { SubscriptionDialog } from "@/components/SubscriptionDialog";
import { SubscriptionMetrics } from "@/components/SubscriptionMetrics";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Subscription() {
  const [subscriptionPackages, setSubscriptionPackages] = useState<
    SubscriptionPackage[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    subscriptionRevenue: 0,
    subscriptionRevenueFluct: null,
    subscriber: 0,
    subscriberFluct: null,
    newSubscriber: 0,
    newSubscriberFluct: null,
    quittedSubscriber: 0,
    quittedSubscriberFluct: null,
    recentSubscribers: [],
    subscriberBySubscriptions: [],
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

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/subscription/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDashboardData(data.data);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <Loader2 className="h-15 w-15 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 mt-4 h-[90vh]">
      {/* LEFT */}
      <div className="flex flex-col gap-4 w-3/4">
        <SubscriptionMetrics data={dashboardData} />
        <RecentSubscribersList
          recentSubscribers={dashboardData.recentSubscribers}
        />
      </div>

      {/* RIGHT */}
      <div className="w-1/4 bg-card p-4 rounded-lg space-y-4">
        <SubscriptionDialog
          subscriptionPackages={subscriptionPackages}
          fetchSubscriptions={fetchSubscriptions}
        />
        <SubGroupChart data={dashboardData.subscriberBySubscriptions} />
        <MostPopularPkg
          subscriptionName={dashboardData.mostPopularTier.subscriptionName}
          numberOfSubscriber={dashboardData.mostPopularTier.numberOfSubscriber}
          percentage={dashboardData.mostPopularTier.percentage}
        />
      </div>
    </div>
  );
}
