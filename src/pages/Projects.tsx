import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Users,
  Share2,
  Edit,
  Trash2,
  Eye,
  Download,
  Star,
  Brain,
  Target,
  Eye as EyeIcon,
  MessageSquare,
  BarChart3
} from 'lucide-react'
import { useAI, AIProject } from '../context/AIContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Projects: React.FC = () => {
  const { state, dispatch } = useAI()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'blocks'>('date')

  // Sample projects for demonstration
  const sampleProjects: AIProject[] = [
    {
      id: 'project1',
      name: 'Image Classifier',
      description: 'A machine learning model that can identify different types of animals in images',
      blocks: [],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 'project2',
      name: 'Sentiment Analyzer',
      description: 'Analyze the emotions in text messages using natural language processing',
      blocks: [],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: 'project3',
      name: 'Data Visualization Dashboard',
      description: 'Create beautiful charts and graphs to understand complex datasets',
      blocks: [],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-12')
    },
    {
      id: 'project4',
      name: 'Neural Network for Number Recognition',
      description: 'A neural network that can recognize handwritten digits',
      blocks: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-08')
    }
  ]

  const allProjects = [...state.projects, ...sampleProjects]

  const categories = [
    { value: 'all', label: 'All Projects', icon: <FolderOpen className="w-4 h-4" /> },
    { value: 'Machine Learning', label: 'Machine Learning', icon: <Target className="w-4 h-4" /> },
    { value: 'Neural Networks', label: 'Neural Networks', icon: <Brain className="w-4 h-4" /> },
    { value: 'Computer Vision', label: 'Computer Vision', icon: <EyeIcon className="w-4 h-4" /> },
    { value: 'Natural Language', label: 'Natural Language', icon: <MessageSquare className="w-4 h-4" /> },
    { value: 'Data Science', label: 'Data Science', icon: <BarChart3 className="w-4 h-4" /> }
  ]

  const sortOptions = [
    { value: 'date', label: 'Date Created', icon: <Calendar className="w-4 h-4" /> },
    { value: 'name', label: 'Project Name', icon: <FolderOpen className="w-4 h-4" /> },
    { value: 'blocks', label: 'Number of Blocks', icon: <Brain className="w-4 h-4" /> }
  ]

  const filteredProjects = allProjects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
                            project.description.toLowerCase().includes(selectedCategory.toLowerCase())
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        case 'blocks':
          return b.blocks.length - a.blocks.length
        default:
          return 0
      }
    })

  const handleCreateProject = () => {
    const projectName = prompt('Enter project name:')
    if (projectName) {
      const newProject: AIProject = {
        id: `project_${Date.now()}`,
        name: projectName,
        description: 'A new AI project',
        blocks: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      dispatch({ type: 'ADD_PROJECT', payload: newProject })
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject })
      navigate('/workspace')
      toast.success('New project created!')
    }
  }

  const handleOpenProject = (project: AIProject) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project })
    navigate('/workspace')
    toast.success(`Opened project: ${project.name}`)
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      dispatch({ type: 'DELETE_PROJECT', payload: projectId })
      toast.success('Project deleted!')
    }
  }

  const handleShareProject = (project: AIProject) => {
    // In a real app, this would generate a shareable link
    const shareData = {
      title: project.name,
      text: project.description,
      url: `${window.location.origin}/project/${project.id}`
    }
    
    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareData.url)
      toast.success('Project link copied to clipboard!')
    }
  }

  const handleExportProject = (project: AIProject) => {
    const dataStr = JSON.stringify(project, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.name}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Project exported!')
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const getProjectIcon = (project: AIProject) => {
    const description = project.description.toLowerCase()
    if (description.includes('neural') || description.includes('network')) {
      return <Brain className="w-6 h-6" />
    } else if (description.includes('image') || description.includes('vision')) {
      return <EyeIcon className="w-6 h-6" />
    } else if (description.includes('text') || description.includes('language')) {
      return <MessageSquare className="w-6 h-6" />
    } else if (description.includes('data') || description.includes('chart')) {
      return <BarChart3 className="w-6 h-6" />
    } else {
      return <Target className="w-6 h-6" />
    }
  }

  const getProjectColor = (project: AIProject) => {
    const description = project.description.toLowerCase()
    if (description.includes('neural') || description.includes('network')) {
      return 'pink'
    } else if (description.includes('image') || description.includes('vision')) {
      return 'blue'
    } else if (description.includes('text') || description.includes('language')) {
      return 'green'
    } else if (description.includes('data') || description.includes('chart')) {
      return 'orange'
    } else {
      return 'purple'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">My Projects</h1>
          <p className="text-xl text-gray-600 mt-2">
            Manage and organize your AI projects
          </p>
        </div>
        
        <button
          onClick={handleCreateProject}
          className="px-6 py-3 bg-gradient-to-r from-ai-purple to-ai-pink text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Projects</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ai-purple focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ai-purple focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'blocks')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ai-purple focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-200"
          >
            {/* Project Header */}
            <div className={`p-6 bg-gradient-to-r from-ai-${getProjectColor(project)} to-${getProjectColor(project)}-600 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  {getProjectIcon(project)}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleShareProject(project)}
                    className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                    title="Share Project"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExportProject(project)}
                    className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                    title="Export Project"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-sm opacity-90">{project.description}</p>
            </div>

            {/* Project Details */}
            <div className="p-6 space-y-4">
              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Brain className="w-4 h-4" />
                    <span>{project.blocks.length} blocks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>4.8</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenProject(project)}
                  className="flex-1 px-4 py-2 bg-ai-purple text-white rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open</span>
                </button>
                
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first AI project to get started'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <button
              onClick={handleCreateProject}
              className="px-6 py-3 bg-ai-purple text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
            >
              Create Your First Project
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Projects 