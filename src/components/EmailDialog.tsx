"use client";

import { useEffect, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailForm } from "./EmailForm";
import { EmailPreview } from "./EmailPreview";
import { toast } from "sonner";

interface EmailDialogProps {
  children: ReactNode;
  defaultRecipients?: string;
  defaultFields?: {
    displayName?: string;
    title?: string;
    content?: string;
  };
}

export const EmailDialog = ({
  children,
  defaultRecipients = "",
  defaultFields,
}: EmailDialogProps) => {
  const [recipients, setRecipients] = useState(defaultRecipients);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);

  // Loading
  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState({
    displayName: defaultFields?.displayName || "",
    title: defaultFields?.title || "",
    content: defaultFields?.content || "",
  });

  const resetForm = () => {
    setRecipients(defaultRecipients);
    setSubject("");
    setFields({
      displayName: defaultFields?.displayName || "",
      title: defaultFields?.title || "",
      content: defaultFields?.content || "",
    });
  };

  const filledTemplate = body
    .replace(/{{displayName}}/g, fields.displayName || "")
    .replace(/{{title}}/g, fields.title || "")
    .replace(/{{content}}/g, fields.content || "");

  // Load email template on mount
  useEffect(() => {
    fetch("/email/emailTemplate.html")
      .then((res) => res.text())
      .then((html) => setBody(html))
      .catch((err) => console.error("Failed to load email template:", err));
  }, []);

  const handleSend = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients,
          subject,
          body: filledTemplate,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Send email failed:", err);
        toast.error("Có lỗi xảy ra trong lúc gửi email tới người dùng");
        return;
      }

      toast.success("Đã gửi email tới người dùng");
      setOpen(false);
    } catch (error) {
      console.error("Send email error:", error);
      toast.error("Có lỗi xảy ra trong lúc gửi email tới người dùng");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Reset the form upon close.
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="!w-[100vw] !max-w-[1500px] !h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Gửi Email</DialogTitle>
          <DialogDescription>
            Nhập thông tin và xem trước email trước khi gửi.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden min-h-0">
          {/* Left */}
          <div className="border rounded-lg p-4 flex flex-col h-full min-h-0">
            <ScrollArea className="flex-1 min-h-0 pr-2">
              <EmailForm
                recipients={recipients}
                subject={subject}
                fields={fields}
                loading={loading}
                onChange={({ recipients, subject, fields }) => {
                  if (recipients !== undefined) setRecipients(recipients);
                  if (subject !== undefined) setSubject(subject);
                  if (fields !== undefined) setFields(fields);
                }}
                onSend={handleSend}
              />
            </ScrollArea>
          </div>

          {/* Right */}
          <div className="border rounded-lg p-4 flex flex-col h-full min-h-0">
            <EmailPreview
              recipients={recipients}
              subject={subject}
              body={filledTemplate}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
