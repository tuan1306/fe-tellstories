"use client";

import { SubscriptionPackage } from "@/app/types/subscription";
import { SubGroupChart } from "@/components/SubGroupChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Loader2, TrendingDown, TrendingUp, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Subscription() {
  const [isDelete, setIsDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [subscriptionPackages, setSubscriptionPackages] = useState<
    SubscriptionPackage[]
  >([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedPackage, setSelectedPackage] =
    useState<SubscriptionPackage | null>(null);

  const [stats, setStats] = useState({
    newAccounts: 0,
    newAccountFluct: 0,
    activeAccounts: 0,
    publishedStories: 0,
    publishedStoriesFluct: 0,
    storyViews: 0,
  });

  useEffect(() => {
    if (selectedPackage) {
      form.reset({
        name: selectedPackage.name,
        price: selectedPackage.price,
        type: selectedPackage.type,
        durationDays: selectedPackage.durationDays,
        billingCycle: selectedPackage.billingCycle,
        maxStories: selectedPackage.maxStories,
        maxAIRequest: selectedPackage.maxAIRequest,
        maxTTSRequest: selectedPackage.maxTTSRequest,
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
      billingCycle: 0,
      maxStories: 0,
      maxAIRequest: 0,
      maxTTSRequest: 0,
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
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        const d = data?.data;
        setStats({
          newAccounts: d?.newAccount ?? 0,
          newAccountFluct: d?.newAccountFluct ?? 0,
          activeAccounts: d?.activeAccount ?? 0,
          publishedStories: d?.publishedStories ?? 0,
          publishedStoriesFluct: d?.publishedStoriesFluct ?? 0,
          storyViews: d?.storiesViews ?? 0,
        });
      });
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const onSubmit = async (values: z.infer<typeof subscriptionSchema>) => {
    try {
      setIsSubmitting(true);
      const method = selectedPackage ? "PUT" : "POST";
      const url = selectedPackage ? `/api/subscription` : "/api/subscription";

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
              <CardAction>{fluctBadge(stats.newAccountFluct)}</CardAction>
            </CardHeader>
            <CardContent className="text-4xl">
              <p>{stats.newAccounts.toLocaleString()}</p>
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
                <CardAction>{fluctBadge(stats.newAccountFluct)}</CardAction>
              </CardHeader>
              <CardContent className="text-4xl">
                <p>{stats.newAccounts.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="text-4xl col-span-1 text-[16px] gap-4">
              <CardHeader>
                <CardTitle className="flex gap-2 text-[16px]">
                  <UserPlus />
                  New Subscriber
                </CardTitle>
                <CardDescription>
                  User bought subscription this week
                </CardDescription>
                <CardAction>{fluctBadge(stats.newAccountFluct)}</CardAction>
              </CardHeader>
              <CardContent className="text-4xl">
                <p>{stats.newAccounts.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="text-4xl col-span-1 text-[16px] gap-4">
              <CardHeader>
                <CardTitle className="flex gap-2 text-[16px]">
                  <UserPlus />
                  Something here
                </CardTitle>
                <CardDescription>
                  User bought subscription this week
                </CardDescription>
                <CardAction>{fluctBadge(stats.newAccountFluct)}</CardAction>
              </CardHeader>
              <CardContent className="text-4xl">
                <p>{stats.newAccounts.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg h-full">
          Recent sub buyer here
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-1/4 bg-card p-4 rounded-lg">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4 w-full px-4 py-2 cursor-pointer">
              Pricing Plans
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
                  className="w-full mt-4"
                  onClick={() => setShowForm(true)}
                >
                  + Create New Subscription
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
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Input {...field} />
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

                    <FormField
                      control={form.control}
                      name="billingCycle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Cycle (months)</FormLabel>
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
                      name="maxStories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Stories</FormLabel>
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
                      name="maxAIRequest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max AI Requests</FormLabel>
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
                      name="maxTTSRequest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max TTS Requests</FormLabel>
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
                <Accordion type="single" collapsible className="w-full my-4">
                  {subscriptionPackages.map((pkg, i) => (
                    <AccordionItem key={pkg.id} value={`${pkg.name}-${i}`}>
                      <AccordionTrigger className="cursor-pointer">
                        {pkg.name} Plan
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            <strong>Price:</strong> ${pkg.price}
                          </p>
                          <p>
                            <strong>Type:</strong> {pkg.type}
                          </p>
                          <p>
                            <strong>Duration:</strong> {pkg.durationDays} days
                          </p>
                          <p>
                            <strong>Billing Cycle:</strong> every{" "}
                            {pkg.billingCycle} month(s)
                          </p>
                          <p>
                            <strong>Max Stories:</strong> {pkg.maxStories}
                          </p>
                          <p>
                            <strong>Max AI Requests:</strong> {pkg.maxAIRequest}
                          </p>
                          <p>
                            <strong>Max TTS Requests:</strong>{" "}
                            {pkg.maxTTSRequest}
                          </p>
                          <p>
                            <strong>Active:</strong>{" "}
                            {pkg.isActive ? "Yes" : "No"}
                          </p>
                          <p>
                            <strong>Default:</strong>{" "}
                            {pkg.isDefault ? "Yes" : "No"}
                          </p>

                          <Button
                            variant="link"
                            className="px-0 text-sm cursor-pointer text-chart-1"
                            onClick={() => setSelectedPackage(pkg)}
                          >
                            Edit subscription
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
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
            <p className="font-semibold text-primary">Premium</p>
            <p className="text-muted-foreground text-sm">54 users (42%)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
