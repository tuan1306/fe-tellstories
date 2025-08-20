"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Search, Loader2, BadgeInfo } from "lucide-react";
import { toast } from "sonner";

interface ConfigItem {
  id: string;
  key: string;
  value: string;
  createdDate: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export default function ConfigManager() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ConfigItem | null>(null);
  const [newValue, setNewValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/system-config")
      .then((res) => res.json())
      .then((data) => setConfigs(data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = configs.filter(
    (c) =>
      c.key.toLowerCase().includes(search.toLowerCase()) ||
      c.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!editing) return;

    setIsSaving(true);
    try {
      await fetch(`/api/system-config/${editing.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing, value: newValue }),
      });

      setConfigs((prev) =>
        prev.map((c) => (c.key === editing.key ? { ...c, value: newValue } : c))
      );

      toast.success("Configuration updated");
      setEditing(null);
      setNewValue("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to update config");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-md mt-4 max-h-[80vh] overflow-hidden flex flex-col">
      <CardHeader>
        <CardTitle>System Configurations</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search by key or value"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className="relative min-h-[460px]">
        {/* Loader overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-accent-foreground" />
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead className="text-center">Value</TableHead>
                <TableHead className="text-center">Updated At</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-mono text-xs">
                    {config.key}
                  </TableCell>
                  <TableCell className="text-center">{config.value}</TableCell>
                  <TableCell className="text-center">
                    {new Date(config.updatedAt).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(config);
                        setNewValue(config.value);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <Search className="h-6 w-6 mb-2" />
            <p>No configurations found.</p>
          </div>
        )}
      </CardContent>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Config</DialogTitle>
            <DialogDescription>
              Update the value for this configuration.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 text-sm text-muted-foreground bg-muted rounded-md">
            <div className="flex items-center gap-2 mb-1 font-semibold">
              <BadgeInfo className="h-4 w-4 text-cyan-500" />
              About this config:
            </div>
            {editing?.key === "Login_DailyReward_Points" &&
              "Defines how many reward points a user receives for logging in daily."}
            {editing?.key === "StoryPublish_MaxPendingRequests_Default" &&
              "Defines the maximum number of pending story publish requests allowed for basic accounts."}
            {editing?.key === "StoryPublish_MaxPendingRequests_Tier1" &&
              "Defines the maximum number of pending story publish requests allowed for premium accounts."}
            {![
              "Login_DailyReward_Points",
              "StoryPublish_MaxPendingRequests_Default",
              "StoryPublish_MaxPendingRequests_Tier1",
            ].includes(editing?.key || "") && (
              <>No description available for this configuration.</>
            )}
          </div>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key" className="text-right">
                Key
              </Label>
              <Input
                id="key"
                value={editing?.key || ""}
                className="col-span-3 cursor-pointer"
                readOnly
                onClick={() => {
                  if (!editing?.key) return;
                  navigator.clipboard.writeText(editing.key);
                  toast.info("Key copied");
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input
                id="value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
