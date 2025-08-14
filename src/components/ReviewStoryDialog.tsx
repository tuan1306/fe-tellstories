import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ReviewStoryDialog({
  open,
  onOpenChange,
  title,
  confirmDesc,
  confirmLabel,
  confirmColor = "green",
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  title: string;
  confirmDesc?: string;
  confirmLabel: string;
  confirmColor?: "green" | "red";
  onConfirm: (notes: string, points?: number) => void;
}) {
  const [notes, setNotes] = useState("");
  const [showPointsInput, setShowPointsInput] = useState(false);
  const [points, setPoints] = useState<number | "">("");
  const [isConfirmStep, setIsConfirmStep] = useState(false);

  const handleMainConfirmClick = () => {
    setIsConfirmStep(true);
  };

  const handleFinalConfirm = () => {
    onConfirm(notes, points || undefined);
    setIsConfirmStep(false);
    // close after confirming
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        // reset when closed
        if (!val) setIsConfirmStep(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isConfirmStep ? "Xác nhận hành động" : title}
          </DialogTitle>
          <DialogDescription>
            {isConfirmStep
              ? "Vui lòng kiểm tra lại thông tin trước khi xác nhận."
              : confirmDesc}
          </DialogDescription>
        </DialogHeader>

        {!isConfirmStep ? (
          <>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghí chú ở đây..."
            />
          </>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Ghi chú:</strong> {notes || "Không có"}
            </p>
            <p>
              <strong>Điểm thưởng:</strong> {points || 0}
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          {isConfirmStep ? (
            <>
              <Button variant="outline" onClick={() => setIsConfirmStep(false)}>
                Quay lại
              </Button>
              <Button
                className={`font-semibold text-white ${
                  confirmColor === "red"
                    ? "bg-red-700 hover:bg-red-900"
                    : "bg-green-700 hover:bg-green-900"
                }`}
                onClick={handleFinalConfirm}
              >
                Xác nhận
              </Button>
            </>
          ) : (
            <>
              {confirmColor !== "red" && (
                <>
                  {showPointsInput && (
                    <Input
                      type="number"
                      min={0}
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      placeholder="Điểm"
                      className="w-24"
                    />
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setShowPointsInput((prev) => !prev)}
                  >
                    {showPointsInput ? "Bỏ thưởng" : "Thưởng"}
                  </Button>
                </>
              )}
              <Button
                className={`cursor-pointer font-semibold text-white ${
                  confirmColor === "red"
                    ? "bg-red-700 hover:bg-red-900"
                    : "bg-green-700 hover:bg-green-900"
                }`}
                onClick={handleMainConfirmClick}
              >
                {confirmLabel}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
