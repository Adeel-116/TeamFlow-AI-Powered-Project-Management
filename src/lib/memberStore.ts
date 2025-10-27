import { create } from 'zustand'

type Member = {
  id: string
  name: string
  email: string
  designation: string
  level: string
  department: string
  status: string
}

type MemberStore = {
    selectedMember: Member | null,
    setSelectedMember: (member: Member | null) => void,
    refresh: boolean, 
    setRefresh: ()=> void
}

export const userMemberStore = create<MemberStore>((set)=>(
    {
        selectedMember: null,
        setSelectedMember: (member) => set({ selectedMember: member }),
        refresh: false,
        setRefresh: ()=>set((state)=>({refresh: !state.refresh}))
    }
))