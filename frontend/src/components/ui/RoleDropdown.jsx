import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Briefcase, Code } from 'lucide-react'
import { GROUPED_ROLES, ROLE_DESCRIPTIONS, getRoleCategory, ROLE_CATEGORIES } from '../../constants/roles'

export function RoleDropdown({ value, onChange, placeholder = "Select a role...", className = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredGroups = GROUPED_ROLES.map(group => ({
    ...group,
    options: group.options.filter(role => 
      role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.options.length > 0)

  const selectedRole = value
  const category = getRoleCategory(selectedRole)
  const categoryInfo = ROLE_CATEGORIES[category]

  const handleSelect = (role) => {
    onChange(role)
    setIsOpen(false)
    setSearchTerm("")
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-left flex items-center justify-between transition-all duration-200 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      >
        <div className="flex items-center gap-3">
          {selectedRole && (
            <div className={`w-8 h-8 rounded-lg ${categoryInfo.bgColor} ${categoryInfo.darkBgColor} flex items-center justify-center`}>
              {category === 'technical' ? (
                <Code className={`w-4 h-4 ${categoryInfo.textColor} ${categoryInfo.darkTextColor}`} />
              ) : (
                <Briefcase className={`w-4 h-4 ${categoryInfo.textColor} ${categoryInfo.darkTextColor}`} />
              )}
            </div>
          )}
          <div>
            <div className={`font-medium ${selectedRole ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {selectedRole || placeholder}
            </div>
            {selectedRole && (
              <div className={`text-xs ${categoryInfo.textColor} ${categoryInfo.darkTextColor} font-medium`}>
                {categoryInfo.label}
              </div>
            )}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-2xl max-h-80 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Role Options */}
          <div className="max-h-60 overflow-y-auto">
            {filteredGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{group.label === 'Technical Roles' ? '💻' : '📊'}</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {group.label}
                    </span>
                  </div>
                </div>
                {group.options.map((role) => {
                  const roleCategory = getRoleCategory(role)
                  const roleCategoryInfo = ROLE_CATEGORIES[roleCategory]
                  const isSelected = role === selectedRole
                  
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleSelect(role)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                        isSelected 
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${roleCategoryInfo.bgColor} ${roleCategoryInfo.darkBgColor} flex items-center justify-center flex-shrink-0`}>
                        {roleCategory === 'technical' ? (
                          <Code className={`w-4 h-4 ${roleCategoryInfo.textColor} ${roleCategoryInfo.darkTextColor}`} />
                        ) : (
                          <Briefcase className={`w-4 h-4 ${roleCategoryInfo.textColor} ${roleCategoryInfo.darkTextColor}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                          {role}
                        </div>
                        <div className={`text-xs ${roleCategoryInfo.textColor} ${roleCategoryInfo.darkTextColor}`}>
                          {roleCategoryInfo.label}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-500 dark:text-gray-400">No roles found matching "{searchTerm}"</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
