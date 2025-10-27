'use client'

import { useRouter, usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  X,
} from 'lucide-react'
import TeamflowLogo from '../../../public/teamflow.png'
import { navigation } from '../../data/Data'
import { useAuthStore } from '@/lib/useAuthStore'

interface SidebarProps {
  isOpen: boolean
  onToggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggleSidebar }) => {
  const { user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [activePage, setActivePage] = useState('dashboard')
  const [expandedSections, setExpandedSections] = useState<string[]>([])

 
  const role = user?.role as 'team_member' | 'manager' | undefined
  const nav = navigation
    .filter(section => (role ? (section.roles?.includes(role) ?? false) : false))
    .map(section => ({
      ...section,
      items: section.items.filter(item => (role ? (item.roles?.includes(role) ?? false) : false))
    }))

  
  useEffect(() => {
    const findActiveSection = () => {
      for (const section of nav) { // use filtered nav
        if (section.path && pathname === section.path) {
          setActivePage(section.id)
          return
        }

        for (const item of section.items) {
          if (item.path && pathname === item.path) {
            setActivePage(item.id)
            if (!expandedSections.includes(section.id)) {
              setExpandedSections(prev => [...prev, section.id])
            }
            return
          }
        }
      }
    }

    findActiveSection()
  }, [pathname, nav, expandedSections])

  const toggleMenu = (sectionId: string) => {
    const section = nav.find(nav => nav.id === sectionId) 
    if (!section) return

    if (!isOpen) {
      onToggleSidebar()
      if (section.items.length > 0) {
        setTimeout(() => {
          setExpandedSections(prev => [...prev, sectionId])
        }, 100)
      } else if (section.path) {
        setActivePage(sectionId)
        router.push(section.path)
      }
      return
    }

    if (section.items.length > 0) {
      setExpandedSections(prev =>
        prev.includes(sectionId)
          ? prev.filter(id => id !== sectionId)
          : [...prev, sectionId]
      )
    } else if (section.path) {
      setActivePage(sectionId)
      router.push(section.path)
      if (window.innerWidth < 768) onToggleSidebar()
    }
  }

  const handleItemClick = (itemId: string, path?: string) => {
    setActivePage(itemId)
    if (path) {
      router.push(path)
      if (window.innerWidth < 768) onToggleSidebar()
    }
  }

  const handleLogout = () => {
    console.log('Logging out...')
    router.push('/login')
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onToggleSidebar}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 z-50 h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col shadow-xl md:shadow-none transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}`}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Image
                src={TeamflowLogo}
                alt="TeamFlow AI Logo"
                width={35}
                height={35}
                priority
                className="rounded-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <h1 className={`font-bold text-lg text-gray-900 transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 md:hidden'}`}>
              Teamflow AI
            </h1>
          </div>

          <button onClick={onToggleSidebar} className="md:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <nav className="space-y-1">
            {nav.map(section => {
              const isExpanded = expandedSections.includes(section.id)
              const isActive = activePage === section.id && section.items.length === 0
              const hasActiveChild = section.items.some(item => item.id === activePage)

              return (
                <div key={section.id} className="mb-1">
                  <button
                    onClick={() => toggleMenu(section.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive || hasActiveChild ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className={`w-5 h-5 transition-transform duration-200 ${isActive || hasActiveChild ? '' : 'group-hover:scale-110'}`} />
                      {isOpen && <span className="transition-all duration-300">{section.label}</span>}
                    </div>
                    {isOpen && section.items.length > 0 && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />}
                  </button>

                  {/* Submenu */}
                  {section.items.length > 0 && isOpen && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                      <div className="ml-8 space-y-0.5 border-l-2 border-gray-200 pl-2">
                        {section.items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item.id, item.path)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 ${activePage === item.id ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 -ml-0.5' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600 hover:translate-x-1'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 bg-white p-3 space-y-1">
          <button
            onClick={() => { if (!isOpen) { onToggleSidebar() } else { router.push('/dashboard/settings') } }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-all duration-200 group"
          >
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            {isOpen && <span>Settings</span>}
          </button>
          <button
            onClick={() => { if (!isOpen) { onToggleSidebar() } else { router.push('/help') } }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-all duration-200 group"
          >
            <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            {isOpen && <span>Help & Support</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
