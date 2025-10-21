import { create } from 'zustand'

type Member = {
  id: string
  name: string
  email: string
  role: string
  designation: string
  level: string
  department: string
  status: string
}

type MemberStore = {
    selectedMember: Member | null,
    setSelectedMember: (member: Member | null) => void
}


export const userMemberStore = create<MemberStore>((set)=>(
    {
        selectedMember: null,
        setSelectedMember: (member) => set({ selectedMember: member })
    }
))