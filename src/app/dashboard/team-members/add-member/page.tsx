"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UserPlus, Loader2, Sparkles, Check } from "lucide-react"

export default function AddMemberPage() {
    const roles = ["admin", "manager", "member"]
    const levels = ["senior", "mid", "junior", "intern"]
    const departments = ["Development", "Design", "Marketing", "HR", "Sales"]
    const statuses = ["active", "inactive"]

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        designation: "",
        level: "",
        department: "",
        status: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                console.log('User added successfully:', data);
                setShowSuccess(true)
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "",
                    designation: "",
                    level: "",
                    department: "",
                    status: "",
                })
                setIsSubmitting(false)
            } else {
                console.error('Error:', data.message);
                setShowSuccess(false)
                setIsSubmitting(false)
            }
        } catch (error) {
            console.error('Failed to add member:', error);
            setShowSuccess(false)
            setIsSubmitting(false)
        }
    };

    const handleCancel = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "",
            designation: "",
            level: "",
            department: "",
            status: "",
        })
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">


            <div className="w-full max-w-4xl relative z-10">
                {/* Success Popup */}
                {showSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center animate-in zoom-in duration-300 relative">
                            {/* Success Icon */}
                            <div className="bg-green-100 rounded-full p-4 mx-auto mb-4 w-fit">
                                <Check className="h-12 w-12 text-green-600" />
                            </div>

                            {/* Title & Message */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Member Added Successfully!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Your new team member has been added successfully.
                            </p>

                            {/* Buttons */}
                            <div className="flex justify-center gap-4">
                                <Button
                                    onClick={() => setShowSuccess(false)}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6"
                                >
                                    OK
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowSuccess(false)}
                                    className="px-6 hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transition-all duration-300 hover:shadow-3xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                                <UserPlus className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Add New Member
                                </h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    Fill in the details below to add a new team member
                                </p>
                            </div>
                        </div>
                        <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Min. 6 characters"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Designation */}
                        <div className="space-y-2">
                            <Label htmlFor="designation">Designation</Label>
                            <Input
                                id="designation"
                                placeholder="e.g. Frontend Developer"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            />
                        </div>

                        {/* Level */}
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

                        {/* Department */}
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

                        {/* Status */}
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
                                    {statuses.map((status) => (
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
                            onClick={handleCancel}
                            className="px-6 py-2 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding Member...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add Member
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
