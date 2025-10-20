"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  okText?: string;
}

export default function SuccessPopup({
  show,
  onClose,
  title = "Action Successful!",
  icon: Icon,
  iconColor = "text-green-600",
  iconBg = "bg-green-100",
  okText = "OK",
}: SuccessModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        {Icon && (
          <div className={`rounded-full p-4 mx-auto mb-4 w-fit ${iconBg}`}>
            <Icon className={`h-12 w-12 ${iconColor}`} />
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <Button
          onClick={onClose}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 mt-2"
        >
          {okText}
        </Button>
      </div>
    </div>
  );
}
