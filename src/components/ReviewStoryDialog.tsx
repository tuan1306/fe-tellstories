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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "./ui/input";

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
  const [isConfirmStep, setIsConfirmStep] = useState(false);

  // Display the criteria
  const [showPointsInput, setShowPointsInput] = useState(false);

  // Criteria
  const criteria = [
    { label: "Không có sử dụng AI để tạo nội dung truyện", points: 10 },
    { label: "Không có sử dụng AI để tạo ảnh truyện", points: 10 },
    { label: "Nội dung truyện độc đáo", points: 15 },
    { label: "Ngôn từ rõ ràng, dễ hiểu", points: 5 },
    { label: "Các phân cảnh được sắp xếp hợp lý", points: 5 },
    { label: "Có mở bài, thân bài, kết bài rõ ràng", points: 5 },
    // "Có sự phát triển nhân vật",
  ];

  // Extra points
  const [extraPoints, setExtraPoints] = useState(0);

  // Track the criteria
  const [activeCriteria, setActiveCriteria] = useState<boolean[]>(
    new Array(criteria.length).fill(false)
  );

  // If activeCriteria exist then cal sum + criteria index
  const totalPoints =
    activeCriteria.reduce((sum, active, idx) => {
      return active ? sum + criteria[idx].points : sum;
    }, 0) + extraPoints;

  // The state of points being added, updated upon switching.
  const handleSwitchChange = (idx: number) => {
    const updated = [...activeCriteria];
    updated[idx] = !updated[idx];
    setActiveCriteria(updated);
  };

  const handleMainConfirmClick = () => setIsConfirmStep(true);
  const handleFinalConfirm = () => {
    onConfirm(notes, totalPoints);
    setIsConfirmStep(false);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) setIsConfirmStep(false);
      }}
    >
      <DialogContent
        className={`p-6 rounded-lg transition-all duration-400 ease-in-out
    ${
      isConfirmStep
        ? "sm:max-w-2xl w-[400px] min-h-[120px]"
        : showPointsInput
        ? "sm:max-w-4xl w-[1000px] min-h-[300px]"
        : "sm:max-w-2xl w-[500px] min-h-[200px]"
    }`}
      >
        <div
          className={`transition-all duration-400 ease-in-out ${
            isConfirmStep
              ? "min-h-[120px]"
              : showPointsInput
              ? "min-h-[300px]"
              : "min-h-[200px]"
          }`}
        >
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
            <div className="flex gap-4 items-stretch">
              {/* Notes */}
              <div className={`flex-1 ${showPointsInput ? "h-full" : ""}`}>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú ở đây..."
                  className={`w-full ${
                    showPointsInput ? "h-full min-h-[250px]" : "min-h-[100px]"
                  } my-4`}
                />
              </div>

              {/* Criteria */}
              {confirmColor !== "red" && showPointsInput && (
                <div className="flex-1 space-y-2 border-l pl-4">
                  {criteria.map((crit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <span>
                        {crit.label} ({crit.points})
                      </span>
                      <Switch
                        checked={activeCriteria[idx]}
                        onCheckedChange={() => handleSwitchChange(idx)}
                      />
                    </div>
                  ))}

                  <div className="pt-2">
                    <label className="block font-semibold mb-1">
                      Điểm thêm:
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={extraPoints}
                      onChange={(e) => setExtraPoints(Number(e.target.value))}
                      placeholder="Nhập điểm thêm..."
                    />
                  </div>

                  <div className="pt-2 font-semibold">
                    Tổng điểm: {totalPoints}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 my-4">
              <p>
                <strong>Ghi chú:</strong> {notes || "Không có"}
              </p>
              <p>
                <strong>Tổng điểm:</strong> {totalPoints}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            {isConfirmStep ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmStep(false)}
                >
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
                  <Button
                    variant="outline"
                    onClick={() => setShowPointsInput((prev) => !prev)}
                  >
                    {showPointsInput ? "Bỏ thưởng" : "Thưởng"}
                  </Button>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
