"use client"

import { useState } from "react"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { SuccessDialog } from "@/components/dashboard-components/SuccessDialog"
import { motion, AnimatePresence } from "framer-motion"

export default function DeleteMemberModal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const memberId = searchParams.get("id")

  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleDelete = async () => {
    if (!memberId) {
      alert("No member ID found.")
      return
    }
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/users?id=${memberId}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete member.")
      }
      setShowConfirm(false)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        redirect("/dashboard/teams/manage-members")
      }, 1500)
    } catch (error) {
      console.error("Delete error:", error)
      alert(String(error) || "Something went wrong while deleting.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="sm:max-w-[400px] p-6 text-center rounded-2xl">
          <AlertDialogHeader>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex justify-center mb-4"
            >
              <div className="bg-red-100 p-3 rounded-2xl shadow-inner">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
            </motion.div>

            <AlertDialogTitle className="text-lg font-semibold">
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 mt-2">
              This action cannot be undone. The member with ID{" "}
              <span className="font-semibold text-red-600">{memberId}</span> will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 flex justify-center gap-3">
            <AlertDialogCancel
              onClick={() => router.back()}
              className="px-6 py-2 rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white px-8 py-2 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <SuccessDialog
              open={showSuccess}
              onOpenChange={setShowSuccess}
              title="Member deleted successfully!"
              description="The selected member has been removed from the database."
              buttonText="Okay, Got it"
              onButtonClick={() =>
                router.push("/dashboard/teams/manage-members")
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
