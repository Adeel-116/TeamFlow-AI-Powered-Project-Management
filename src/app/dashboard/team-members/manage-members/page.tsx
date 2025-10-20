'use client'
import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Loader2, UserPlus, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SuccessPopup from '@/components/ui/SuccessPopup';
type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  designation: string;
  level: string;
  department: string;
  status: string;
  created_at: string;
};

const roles = ['admin', 'manager', 'developer', 'designer', 'analyst'];
const levels = ['junior', 'mid', 'senior', 'lead', 'principal'];
const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'];
const statuses = ['active', 'inactive', 'on-leave'];

function EditMemberModal({ 
  show, 
  onClose, 
  member 
}: { 
  show: boolean; 
  onClose: () => void; 
  member: TeamMember | null;
}) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    designation: '',
    level: '',
    department: '',
    status: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        designation: member.designation,
        level: member.level,
        department: member.department,
        status: member.status,
      });
    }
  }, [member]);

  const updateRecord = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowSuccess(true);
      } else {
        alert(data.message || "Failed to update member.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 relative">
  
        {showSuccess && (
             <SuccessPopup
                              show={showSuccess}
                              onClose={() => setShowSuccess(false)}
                              title="Update Data Successfully!"
                              icon={Check}
                          />
        )}

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
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
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

          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
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
            onClick={onClose}
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
  );
}

export default function TeamMembersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setTeam(data.getData.rows);
      } catch (err) {
        console.log('Error occurred:', err);
      }
    };

    fetchData();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = async (email: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
     
    try {
      await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Refresh the team list
      setTeam(team.filter(m => m.email !== email));
    } catch (err) {
      console.error('Error deleting member:', err);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const filteredMembers = team.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <EditMemberModal 
        show={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedMember(null);
        }} 
        member={selectedMember}
      />

    
      
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their roles</p>
          </div>

          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Button className="gap-2" onClick={()=>router.push("/dashboard/team-members/add-member")}>
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMembers.map(member => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{member.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>{member.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.designation}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.level}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={member.status === 'Active' ? 'default' : 'secondary'}
                            className={member.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                          >
                            {member.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(member.created_at).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(member.email)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}