"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
}

export function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  buttonText = "Done",
  onButtonClick,
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent
            className={cn(
              "sm:max-w-[400px] p-6 text-center border-none shadow-lg rounded-2xl",
              "bg-white dark:bg-gray-900"
            )}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <DialogHeader>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="flex justify-center mb-2"
                >
                  <CheckCircle2 className="w-14 h-14 text-green-500" />
                </motion.div>
                <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="text-gray-500 dark:text-gray-400 mt-1">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <Button
                  onClick={() => {
                    onOpenChange(false)
                    onButtonClick?.()
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6"
                >
                  {buttonText}
                </Button>
              </motion.div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
