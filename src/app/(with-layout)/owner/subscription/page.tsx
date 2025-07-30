"use client";

import { SubscriptionPackage } from "@/app/types/subscription";
import { SubGroupChart } from "@/components/SubGroupChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { subscriptionSchema } from "@/utils/validators/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Plus,
  TrendingDown,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const [isDelete, setIsDelete] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [subscriptionPackages, setSubscriptionPackages] = useState<
    SubscriptionPackage[]
  >([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedPackage, setSelectedPackage] =
    useState<SubscriptionPackage | null>(null);

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

  useEffect(() => {
    if (selectedPackage) {
      form.reset({
        name: selectedPackage.name,
        price: selectedPackage.price,
        type: selectedPackage.type,
        durationDays: selectedPackage.durationDays,
        isActive: selectedPackage.isActive,
        isDefault: selectedPackage.isDefault,
      });
      setShowForm(true);
    }
  }, [selectedPackage]);

  const form = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      price: 0,
      type: "",
      durationDays: 0,
      isActive: false,
      isDefault: false,
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

  const onSubmit = async (values: z.infer<typeof subscriptionSchema>) => {
    try {
      // Check if we're activating and already have 3 active
      const activeCount = subscriptionPackages.filter((p) => p.isActive).length;
      const isActivating =
        values.isActive && (!selectedPackage || !selectedPackage.isActive);

      if (isActivating && activeCount >= 3) {
        setFormError("Only 3 active packages are allowed.");
        return;
      } else {
        setFormError("");
      }

      setIsSubmitting(true);
      const method = selectedPackage ? "PUT" : "POST";
      const url = "/api/subscription";

      const payload = selectedPackage
        ? { ...values, id: selectedPackage.id }
        : values;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save subscription package");

      setShowForm(false);
      setSelectedPackage(null);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPackage) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    try {
      setIsDelete(true);
      const res = await fetch(`/api/subscription/${selectedPackage.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete subscription");

      setShowForm(false);
      setSelectedPackage(null);
      fetchSubscriptions();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setConfirmDelete(false);
      setIsDelete(false);
    }
  };

  const fluctBadge = (value: number) => {
    const isUp = value >= 0;
    const Icon = isUp ? TrendingUp : TrendingDown;
    const color = isUp ? "text-green-400" : "text-red-400";
    return (
      <Badge variant="outline" className={color}>
        <Icon />
        {value >= 0 ? "+" : ""}
        {value}%
      </Badge>
    );
  };

  const SubscriptionDetails = ({ pkg }: { pkg: SubscriptionPackage }) => (
    <div className="text-sm text-muted-foreground space-y-1">
      <p>
        <strong>Price:</strong>{" "}
        {new Intl.NumberFormat("vi-VN").format(pkg.price * 1000)} VND
      </p>
      <p>
        <strong>Duration:</strong> {pkg.durationDays} days
      </p>
      <p>
        <strong>Active:</strong> {pkg.isActive ? "Yes" : "No"}
      </p>
      <p>
        <strong>Default:</strong> {pkg.isDefault ? "Yes" : "No"}
      </p>
      <Button
        variant="link"
        className="px-0 text-sm cursor-pointer text-chart-1"
        onClick={() => setSelectedPackage(pkg)}
      >
        Edit subscription
      </Button>
    </div>
  );

  return (
    <div className="flex gap-6 mt-4 h-[90vh]">
      {/* LEFT */}
      <div className="flex flex-col gap-4 w-3/4">
        <div className="bg-card p-4 rounded-lg h-fit">
          <Card className="text-4xl col-span-1 text-[16px] gap-4 mb-4">
            <CardHeader>
              <CardTitle className="flex gap-2 text-[16px]">
                <UserPlus />
                Total amount
              </CardTitle>
              <CardDescription>
                Total amount of money accumulated this month
              </CardDescription>
              <CardAction>
                {fluctBadge(dashboardData.subscriptionRevenueFluct)}
              </CardAction>
            </CardHeader>
            <CardContent className="text-4xl">
              <p>{dashboardData.subscriptionRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>

          {/* Triple cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="text-4xl col-span-1 text-[16px] gap-4">
              <CardHeader>
                <CardTitle className="flex gap-2 text-[16px]">
                  <UserPlus />
                  Total Subscriber
                </CardTitle>
                <CardDescription>
                  User bought subscription this week
                </CardDescription>
                <CardAction>
                  {fluctBadge(dashboardData.subscriberFluct)}
                </CardAction>
              </CardHeader>
              <CardContent className="text-4xl">
                <p>{dashboardData.subscriber.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="text-4xl col-span-1 text-[16px] gap-4">
              <CardHeader>
                <CardTitle className="flex gap-2 text-[16px]">
                  <UserPlus />
                  New Subscriber
                </CardTitle>
                <CardDescription>
                  Newly joined subscribers this month
                </CardDescription>
                <CardAction>
                  {fluctBadge(dashboardData.newSubscriberFluct)}
                </CardAction>
              </CardHeader>
              <CardContent className="text-4xl">
                <p>{dashboardData.newSubscriber.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="text-4xl col-span-1 text-[16px] gap-4">
              <CardHeader>
                <CardTitle className="flex gap-2 text-[16px]">
                  <UserPlus />
                  Lost Subscription
                </CardTitle>
                <CardDescription>
                  Users who stopped subscribing this month
                </CardDescription>
                <CardAction>
                  {fluctBadge(dashboardData.quittedSubscriberFluct)}
                </CardAction>
              </CardHeader>
              <CardContent className="text-4xl">
                <p>{dashboardData.quittedSubscriber.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg h-full">
          <h3 className="text-lg font-semibold">Recent Subscribers</h3>
          <p className="text-sm text-muted-foreground mb-4">
            A list of users who recently started a subscription.
          </p>

          {/* <ul className="text-sm text-muted-foreground space-y-2">
            {dashboardData.recentSubscribers.map((buyer, i) => (
              <li key={i} className="flex justify-between">
                <span>{buyer.name}</span>
                <span>
                  {buyer.plan} • {buyer.date}
                </span>
              </li>
            ))}
          </ul> */}
          <ScrollArea className="h-40 pr-6">
            <ul className="text-sm text-muted-foreground space-y-2">
              {recentBuyers.map((buyer, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between px-4 py-2 rounded-md shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTENEYf8j4k89kg7aVflbvyPX9yOBhnXXT2w&s" />
                      <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                        {buyer.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{buyer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {buyer.plan} Plan
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {buyer.date}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-1/4 bg-card p-4 rounded-lg">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4 w-full px-4 py-2 cursor-pointer">
              Subscription Packages
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[700px] max-w-full max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Subscription Package Management</DialogTitle>
              <DialogDescription>
                {showForm
                  ? "Fill in the details to create a new subscription package."
                  : "View or manage existing subscription packages below."}
              </DialogDescription>
              {!showForm && (
                <Button
                  className="w-full mt-4 cursor-pointer"
                  onClick={() => setShowForm(true)}
                >
                  <Plus />
                  Create New Subscription
                </Button>
              )}
            </DialogHeader>

            <ScrollArea className="h-[60vh] pr-4">
              {showForm ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3 mt-4 text-sm p-3"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="durationDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {formError && (
                      <p className="text-red-500 text-sm mb-2">{formError}</p>
                    )}

                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Active
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isDefault"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Default
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      {selectedPackage && (
                        <Button
                          type="button"
                          disabled={isDelete}
                          variant={confirmDelete ? "destructive" : "secondary"}
                          onClick={handleDelete}
                          className={cn(
                            "transition-all duration-200 ease-in-out min-w-[100px] cursor-pointer flex items-center justify-center gap-1",
                            confirmDelete ? "bg-red-600 text-white" : ""
                          )}
                        >
                          {isDelete ? (
                            <>
                              <Loader2 className="animate-spin w-4 h-4" />
                              <span>Deleting...</span>
                            </>
                          ) : (
                            <>{confirmDelete ? "Confirm" : "Delete"}</>
                          )}
                        </Button>
                      )}
                      <div className="ml-auto flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => {
                            setShowForm(false);
                            setSelectedPackage(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          {isSubmitting && (
                            <Loader2 className="animate-spin w-4 h-4" />
                          )}
                          {selectedPackage ? "Save" : "Create"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              ) : subscriptionPackages.length === 0 ? (
                <p className="text-muted-foreground text-sm mt-4 text-center">
                  There’s no package here :(
                </p>
              ) : (
                <div className="space-y-6 my-4">
                  {/* Active Packages */}
                  <div>
                    <h3 className="text-lg font-bold text-green-500">
                      Active Packages
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      {subscriptionPackages
                        .filter((pkg) => pkg.isActive)
                        .map((pkg, i) => (
                          <AccordionItem
                            key={pkg.id}
                            value={`active-${pkg.name}-${i}`}
                          >
                            <AccordionTrigger className="cursor-pointer">
                              {pkg.name} Plan
                            </AccordionTrigger>
                            <AccordionContent>
                              <SubscriptionDetails pkg={pkg} />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  </div>

                  {/* Inactive Packages */}
                  <div>
                    <h3 className="text-lg font-bold text-red-500">
                      Inactive Packages
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      {subscriptionPackages
                        .filter((pkg) => !pkg.isActive)
                        .map((pkg, i) => (
                          <AccordionItem
                            key={pkg.id}
                            value={`inactive-${pkg.name}-${i}`}
                          >
                            <AccordionTrigger className="cursor-pointer">
                              {pkg.name} Plan
                            </AccordionTrigger>
                            <AccordionContent>
                              <SubscriptionDetails pkg={pkg} />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  </div>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <SubGroupChart />

        <Card className="text-[16px] gap-4 my-4 ">
          <CardHeader>
            <CardTitle className="flex gap-2 text-[16px]">
              <UserPlus />
              Most Popular Tier
            </CardTitle>
            <CardDescription>Based on active subscriptions</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl">
            <p className="font-semibold text-primary">
              {dashboardData.mostPopularTier.subscriptionName || "None"}
            </p>
            <p className="text-muted-foreground text-sm">
              {dashboardData.mostPopularTier.numberOfSubscriber} users (
              {dashboardData.mostPopularTier.percentage}%)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
