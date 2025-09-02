// EmailPreview.tsx
"use client";

import React from "react";

interface EmailPreviewProps {
  recipients: string;
  subject: string;
  body: string; // raw HTML email content
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  recipients,
  subject,
  body,
}) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <p className="text-sm text-gray-500">Người nhận:</p>
        <p className="text-sm">{recipients || "..."}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Chủ đề:</p>
        <p className="text-sm font-medium">{subject || "..."}</p>
      </div>

      {/* Content */}
      <div className="flex-1 rounded-lg border overflow-hidden bg-white shadow">
        <iframe
          title="Email Preview"
          srcDoc={body}
          className="w-full h-full border-none"
          sandbox=""
        />
      </div>
    </div>
  );
};
