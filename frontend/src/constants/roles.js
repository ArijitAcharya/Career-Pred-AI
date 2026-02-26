/**
 * Frontend constants for roles and categories
 * Matches backend constants for consistency
 */

// All supported roles
export const ALL_ROLES = [
  // Technical Roles
  "Data Scientist",
  "Frontend Developer",
  "Backend Developer", 
  "Web Developer",
  "Software Engineer",
  "UI/UX Designer",
  "ML Engineer",
  "DevOps Engineer",
  
  // Non-Technical Roles
  "Product Manager",
  "Business Analyst", 
  "Project Manager",
  "Marketing Analyst",
  "HR Manager",
  "Operations Manager",
  "Sales Executive",
  "Content Strategist",
  "Customer Success Manager",
]

// Role categories
export const TECHNICAL_ROLES = [
  "Data Scientist",
  "Frontend Developer",
  "Backend Developer", 
  "Web Developer",
  "Software Engineer",
  "UI/UX Designer",
  "ML Engineer",
  "DevOps Engineer",
]

export const NON_TECHNICAL_ROLES = [
  "Product Manager",
  "Business Analyst", 
  "Project Manager",
  "Marketing Analyst",
  "HR Manager",
  "Operations Manager",
  "Sales Executive",
  "Content Strategist",
  "Customer Success Manager",
]

// Role descriptions for tooltips
export const ROLE_DESCRIPTIONS = {
  "Data Scientist": "Analyzes complex data to help organizations make better decisions using statistical methods and machine learning.",
  "Frontend Developer": "Builds user interfaces and client-side applications using modern web technologies.",
  "Backend Developer": "Develops server-side applications, APIs, and database systems.",
  "Web Developer": "Builds and maintains websites and web applications using various programming languages and frameworks.",
  "Software Engineer": "Designs, develops, and maintains software systems and applications.",
  "ML Engineer": "Designs, builds, and deploys machine learning models and systems at scale.",
  "DevOps Engineer": "Bridges development and operations to automate and streamline the software delivery process.",
  
  "Product Manager": "Defines product vision, strategy, and roadmap to deliver value to customers and business.",
  "Business Analyst": "Analyzes business processes and requirements to help organizations improve efficiency and effectiveness.",
  "Project Manager": "Plans, executes, and closes projects while managing teams, resources, and stakeholders.",
  "Marketing Analyst": "Analyzes market data and campaign performance to optimize marketing strategies and ROI.",
  "HR Manager": "Manages human resources functions including recruitment, employee relations, and organizational development.",
  "Operations Manager": "Oversees daily business operations to ensure efficiency, quality, and continuous improvement.",
  "Sales Executive": "Drives revenue growth by identifying prospects, building relationships, and closing sales deals.",
  "UI/UX Designer": "Creates intuitive and visually appealing user interfaces and experiences for digital products.",
  "Content Strategist": "Plans, creates, and manages content to engage audiences and achieve business goals.",
  "Customer Success Manager": "Ensures customer satisfaction and retention by providing ongoing support and value.",
}

// Role categories with metadata
export const ROLE_CATEGORIES = {
  technical: {
    label: "Technical Roles",
    description: "Technology-focused positions requiring programming and technical expertise",
    roles: TECHNICAL_ROLES,
    color: "#3B82F6", // Blue
    icon: "💻",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    darkBgColor: "dark:bg-blue-900/30",
    darkTextColor: "dark:text-blue-400"
  },
  non_technical: {
    label: "Non-Technical Roles", 
    description: "Business and creative positions focusing on strategy, management, and communication",
    roles: NON_TECHNICAL_ROLES,
    color: "#10B981", // Green
    icon: "📊",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    darkBgColor: "dark:bg-green-900/30",
    darkTextColor: "dark:text-green-400"
  }
}

// Helper functions
export const getRoleCategory = (role) => {
  return TECHNICAL_ROLES.includes(role) ? "technical" : "non_technical"
}

export const getRoleDescription = (role) => {
  return ROLE_DESCRIPTIONS[role] || "Professional role in the organization."
}

export const getRolesByCategory = (category) => {
  if (category === "technical") return TECHNICAL_ROLES
  if (category === "non_technical") return NON_TECHNICAL_ROLES
  return ALL_ROLES
}

export const isValidRole = (role) => {
  return ALL_ROLES.includes(role)
}

// Grouped roles for dropdown
export const GROUPED_ROLES = [
  {
    label: "Technical Roles",
    options: TECHNICAL_ROLES
  },
  {
    label: "Non-Technical Roles", 
    options: NON_TECHNICAL_ROLES
  }
]
