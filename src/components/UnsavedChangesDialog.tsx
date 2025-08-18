"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UnsavedChangesDialogProps {
  hasUnsavedChanges: boolean;
  children: React.ReactNode;
}

export default function UnsavedChangesDialog({
  hasUnsavedChanges,
  children,
}: UnsavedChangesDialogProps) {
  const router = useRouter();

  const [nextPath, setNextPath] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Redirecting to another page, only prevent <a> attr atm, not Link
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href]");
      if (!target) return;

      const href = (target as HTMLAnchorElement).getAttribute("href");
      if (!href || href.startsWith("http")) return;

      if (hasUnsavedChanges) {
        e.preventDefault();
        setNextPath(href);
        setShowDialog(true);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [hasUnsavedChanges]);

  const handleConfirmLeave = () => {
    setShowDialog(false);
    if (nextPath) {
      router.push(nextPath);
    }
  };

  // Close/refresh the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <>
      {children}

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có thay đổi chưa lưu</AlertDialogTitle>
            <AlertDialogDescription>
              Nếu rời khỏi trang, thay đổi của bạn sẽ bị mất. Bạn có chắc chắn
              muốn tiếp tục?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              onClick={() => setShowDialog(false)}
            >
              Ở lại
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={handleConfirmLeave}
            >
              Rời đi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
