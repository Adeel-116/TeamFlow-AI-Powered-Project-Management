'use client'

import { useRouter, usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Settings, HelpCircle, ChevronDown, X } from 'lucide-react'
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
    .filter(section => (role ? section.roles?.includes(role) : false))
    .map(section => ({
      ...section,
      items: section.items.filter(item => (role ? item.roles?.includes(role) : false)),
    }))

  useEffect(() => {
    const findActiveSection = () => {
      for (const section of nav) {
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
          : [...prev, sectionId],
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

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm md:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
  className={`fixed md:static top-0 left-0 z-50 h-full flex flex-col text-sidebar-foreground border-r border-sidebar-border shadow-lg md:shadow-none transition-all duration-300 ease-in-out
    bg-white
    ${isOpen ? 'translate-x-0 w-56 sm:w-60' : '-translate-x-full md:translate-x-0 md:w-16 lg:w-20'}
  `}
>

        {/* Header */}
        <div className="px-3 py-5 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Image
                src={TeamflowLogo}
                alt="TeamFlow AI Logo"
                width={28}
                height={28}
                className="rounded-md"
              />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-sidebar" />
            </div>
            <h1
              className={`font-semibold text-sm transition-all duration-300 ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 md:hidden'
              }`}
            >
              Teamflow AI
            </h1>
          </div>

          <button
            onClick={onToggleSidebar}
            className="md:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <nav className="space-y-1">
            {nav.map(section => {
              const isExpanded = expandedSections.includes(section.id)
              const isActive = activePage === section.id && section.items.length === 0
              const hasActiveChild = section.items.some(item => item.id === activePage)

              return (
                <div key={section.id}>
                  <button
                    onClick={() => toggleMenu(section.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-md transition-all duration-200 group ${
                      isActive || hasActiveChild
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <section.icon className="w-4 h-4" />
                      {isOpen && <span className="truncate">{section.label}</span>}
                    </div>
                    {isOpen && section.items.length > 0 && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  {section.items.length > 0 && isOpen && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-72 opacity-100 mt-1' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="ml-6 space-y-0.5 border-l border-sidebar-border pl-2">
                        {section.items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item.id, item.path)}
                            className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-all duration-200 ${
                              activePage === item.id
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold border-l-2 border-sidebar-primary -ml-0.5'
                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1'
                            }`}
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
        <div className="border-t border-sidebar-border bg-sidebar p-2 space-y-1">
          <button
            onClick={() =>
              isOpen ? router.push('/dashboard/settings') : onToggleSidebar()
            }
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-all duration-200 group"
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            {isOpen && <span>Settings</span>}
          </button>
          <button
            onClick={() => (isOpen ? router.push('/help') : onToggleSidebar())}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-all duration-200 group"
          >
            <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            {isOpen && <span>Help & Support</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
