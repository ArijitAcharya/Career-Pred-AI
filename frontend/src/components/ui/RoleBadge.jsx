import React from 'react'
import { getRoleCategory, ROLE_CATEGORIES } from '../../constants/roles'

export function RoleBadge({ role, size = "md", showCategory = false, className = "" }) {
  const category = getRoleCategory(role)
  const categoryInfo = ROLE_CATEGORIES[category]
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm", 
    lg: "px-4 py-2 text-base"
  }
  
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-full ${categoryInfo.bgColor} ${categoryInfo.darkBgColor} ${sizeClasses[size]} ${className}`}>
      <span className="text-lg">{categoryInfo.icon}</span>
      <span className={`font-medium ${categoryInfo.textColor} ${categoryInfo.darkTextColor}`}>
        {role}
      </span>
      {showCategory && (
        <span className={`text-xs ${categoryInfo.textColor} ${categoryInfo.darkTextColor} opacity-75`}>
          {categoryInfo.label}
        </span>
      )}
    </div>
  )
}

export function RoleCategoryBadge({ category, size = "sm", className = "" }) {
  const categoryInfo = ROLE_CATEGORIES[category]
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm", 
    lg: "px-4 py-2 text-base"
  }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full ${categoryInfo.bgColor} ${categoryInfo.darkBgColor} ${sizeClasses[size]} ${className}`}>
      <span className="text-sm">{categoryInfo.icon}</span>
      <span className={`font-medium ${categoryInfo.textColor} ${categoryInfo.darkTextColor}`}>
        {categoryInfo.label}
      </span>
    </div>
  )
}
