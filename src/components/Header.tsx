import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Brain, Code, BookOpen, FolderOpen, Play, Save } from 'lucide-react'
import { useAI } from '../context/AIContext'
import toast from 'react-hot-toast'

const Header: React.FC = () => {
  const location = useLocation()
  const { state, dispatch } = useAI()

  const handleRunCode = () => {
    if (!state.currentProject || state.currentProject.blocks.length === 0) {
      toast.error('No blocks to run! Add some AI blocks first.')
      return
    }

    dispatch({ type: 'SET_RUNNING', payload: true })
    dispatch({ type: 'CLEAR_OUTPUT' })

    // Simulate running the AI blocks
    setTimeout(() => {
      state.currentProject?.blocks.forEach((block, index) => {
        setTimeout(() => {
          dispatch({ 
            type: 'ADD_OUTPUT', 
            payload: `Running ${block.title}...` 
          })
        }, index * 1000)
      })

      setTimeout(() => {
        dispatch({ 
          type: 'ADD_OUTPUT', 
          payload: 'AI model training completed! 🎉' 
        })
        dispatch({ type: 'SET_RUNNING', payload: false })
        toast.success('AI project executed successfully!')
      }, state.currentProject.blocks.length * 1000 + 1000)
    }, 500)
  }

  const handleSaveProject = () => {
    if (!state.currentProject) {
      toast.error('No project to save!')
      return
    }

    dispatch({ type: 'UPDATE_PROJECT', payload: state.currentProject })
    toast.success('Project saved successfully!')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-ai-purple to-ai-pink rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">AI Block Coding</h1>
              <p className="text-xs text-gray-500">Learn AI through visual programming</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-ai-purple text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Home</span>
              </div>
            </Link>
            
            <Link
              to="/workspace"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/workspace') 
                  ? 'bg-ai-purple text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span>Workspace</span>
              </div>
            </Link>
            
            <Link
              to="/tutorials"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/tutorials') 
                  ? 'bg-ai-purple text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Tutorials</span>
              </div>
            </Link>
            
            <Link
              to="/projects"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/projects') 
                  ? 'bg-ai-purple text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-4 h-4" />
                <span>Projects</span>
              </div>
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveProject}
              disabled={!state.currentProject}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            
            <button
              onClick={handleRunCode}
              disabled={!state.currentProject || state.isRunning}
              className="px-4 py-2 bg-ai-purple text-white rounded-lg text-sm font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{state.isRunning ? 'Running...' : 'Run'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 