"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { userMemberStore } from "@/lib/memberStore";

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

export default function ManageMembersPage() {
  const { setSelectedMember, refresh } = userMemberStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setTeam(data.getData.rows);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);



  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const filteredMembers = team.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">
            Manage your team members and their details
          </p>
        </div>

        {/* Search + Add Button */}
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

              <Link href="/dashboard/teams/manage-members/add">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Add Member
                </Button>
              </Link>
            </div>
          </CardHeader>

          {/* Table */}
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {[
                      "ID",
                      "Name",
                      "Email",
                      "Designation",
                      "Level",
                      "Department",
                      "Status",
                      "Created At",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">

                  {loading ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="text-center py-6 text-gray-500"
                      >
                        Loading members...
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="text-center py-6 text-gray-400 italic"
                      >
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>{member.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              member.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={cn(
                              "capitalize",
                              member.status === "active" &&
                              "bg-green-100 text-green-800 hover:bg-green-100"
                            )}
                          >
                            {member.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(member.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                          <Link
                            href={`/dashboard/teams/manage-members/edit?id=${member.id}`}
                            onClick={() => setSelectedMember(member)}
                          >
                            <Button size="icon" variant="ghost">
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                          </Link>

                          <Link
                            href={`/dashboard/teams/manage-members/delete?id=${member.id}`}
                          >
                            <Button size="icon" variant="ghost">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
