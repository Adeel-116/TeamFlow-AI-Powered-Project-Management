'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Image from 'next/image'
import {
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react'
import TeamflowLogo from '../../../public/teamflow.png'
import { navigation } from '../../data/Data'

interface SidebarProps {
  isOpen: boolean
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggleSidebar }) => {
  const router = useRouter()
  const [activePage, setActivePage] = useState('dashboard')
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleMenu = (sectionId: string) => {

    const section = navigation.find(nav => nav.id === sectionId)
    if (section && section.items.length > 0) {
      setExpandedSections(prev =>
        prev.includes(sectionId)
          ? prev.filter(id => id !== sectionId)
          : [...prev, sectionId]
      )
    } else {
      setActivePage(sectionId)
    }
  }

  const handleItemClick = (itemId: string, path?: string) => {
  setActivePage(itemId)
  if (path) {
    router.push(path) 
  }
}

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 h-full bg-white border-r border-gray-200 flex flex-col transform transition-all duration-300
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}
        `}
      >
        {/* Header / Logo */}
        <div className="px-5 py-5.5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={TeamflowLogo}
              alt="TeamFlow AI Logo"
              width={35}
              height={35}
              priority
            />
            <h1
              className={`font-bold text-lg text-gray-900 transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0 md:hidden'
              }`}
            >
              Teamflow AI
            </h1>
          </div>

          {/* Close button (mobile only) */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-0.5">
            {navigation.map(section => (
              <div key={section.id} className="mb-2">
                <button
                  onClick={() => toggleMenu(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activePage === section.id && section.items.length === 0
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="w-5 h-5" />
                    {isOpen && <span>{section.label}</span>}
                  </div>

                  {isOpen && section.items.length > 0 && (
                    expandedSections.includes(section.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  )}
                </button>

                {expandedSections.includes(section.id) &&
                  section.items.length > 0 &&
                  isOpen && (
                    <div className="ml-8 mt-1 space-y-0.5">
                      {section.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id, item.path)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            activePage === item.id
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 p-1 space-y-0.5">
          <button
            onClick={onToggleSidebar}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Settings className="w-5 h-5" />
            {isOpen && <span>Settings</span>}
          </button>
          <button
            onClick={onToggleSidebar}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            {isOpen && <span>Help / Support</span>}
          </button>
          <button
            onClick={onToggleSidebar}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
