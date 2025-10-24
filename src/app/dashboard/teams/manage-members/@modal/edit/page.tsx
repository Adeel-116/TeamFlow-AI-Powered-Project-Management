"use client"

import React, { useState, useEffect } from "react"
import {
  Loader2,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { userMemberStore } from "@/lib/memberStore"
import { SuccessDialog } from "@/components/dashboard-components/SuccessDialog"
import { useRouter } from "next/navigation"

const levels = ["senior", "mid", "junior", "intern"]
const departments = ["Development", "Design"]
const designation = ["Frontend Developer", "Backend Developer", "Mobile App Developer", "UI/UX Designer", "Graphic Designer"]
const status = ["active", "inactive"]

export default function EditMemberModal() {
    const router = useRouter()
  const { selectedMember, setRefresh } = userMemberStore()

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    designation: "",
    level: "",
    department: "",
    status: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  
  useEffect(() => {
    if (selectedMember) {
      setFormData({
        id: selectedMember.id,
        name: selectedMember.name,
        email: selectedMember.email,
        designation: selectedMember.designation,
        level: selectedMember.level,
        department: selectedMember.department,
        status: selectedMember.status,
      })
    }
  }, [selectedMember])

  const updateRecord = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (res.ok) {
        setShowSuccess(true)
        setTimeout(() => {
        setShowSuccess(false)
        router.back()
        }, 1500)
        setRefresh()
      } else {
        alert(data.message || "Failed to update member.")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to update member.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedMember) {
    return (
      <div className="p-6 text-center text-gray-600">
        No member selected — please go back to the list.
      </div>
    )
  }

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 relative">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
            <UserPlus className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Edit Member
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Update the member details below
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>


              <div className="space-y-2">
            <Label htmlFor="level">Designation</Label>
            <Select
              value={formData.designation}
              onValueChange={(value) => setFormData({ ...formData, designation: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {designation.map((designation) => (
                  <SelectItem key={designation} value={designation}>
                    {designation.charAt(0).toUpperCase() + designation.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> 

          
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => setFormData({ ...formData, level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dep) => (
                  <SelectItem key={dep} value={dep}>
                    {dep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {status.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={()=>router.back()}
            className="px-6 py-2 hover:bg-gray-100 transition-all duration-300"
          >
            Cancel
          </Button>
          <Button
            onClick={updateRecord}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Member"
            )}
          </Button>
        </div>
      </div>
    </div>


    <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Member updated successfully!"
        description="Your changes have been saved to the database."
        buttonText="Okay, Got it"
        onButtonClick={() => console.log("User closed popup")}
      />
    </>
  )
}
