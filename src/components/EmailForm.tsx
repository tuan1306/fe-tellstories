"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  recipients: string;
  subject: string;
  fields: {
    displayName: string;
    title: string;
    content: string;
  };
  onChange: (fields: {
    recipients?: string;
    subject?: string;
    fields?: {
      displayName: string;
      title: string;
      content: string;
    };
  }) => void;
  onSend: () => void;
  loading?: boolean;
}

export const EmailForm = ({
  recipients,
  subject,
  fields,
  onChange,
  onSend,
  loading,
}: Props) => {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Người nhận</label>
        <Input
          placeholder="NguyenVanA@email.com"
          value={recipients}
          readOnly
          onChange={(e) => onChange({ recipients: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Chủ đề</label>
        <Input
          type="text"
          placeholder="Nhập chủ đề..."
          value={subject}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => onChange({ subject: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tên hiển thị</label>
        <Input
          placeholder="NguyễnVănA"
          value={fields.displayName}
          readOnly
          onChange={(e) =>
            onChange({ fields: { ...fields, displayName: e.target.value } })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tiêu đề</label>
        <Input
          placeholder="Nhập tiêu đề..."
          value={fields.title}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) =>
            onChange({ fields: { ...fields, title: e.target.value } })
          }
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Nội dung</label>
        <Textarea
          className="h-[200px]"
          placeholder="Viết nội dung email..."
          value={fields.content}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) =>
            onChange({ fields: { ...fields, content: e.target.value } })
          }
        />
      </div>

      <Button onClick={onSend} className="self-end" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang gửi...
          </>
        ) : (
          "Gửi email"
        )}
      </Button>
    </div>
  );
};
