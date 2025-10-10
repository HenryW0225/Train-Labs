import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Play, 
  Target, 
  Brain, 
  Eye, 
  MessageSquare, 
  BarChart3,
  Star,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  Circle
} from 'lucide-react'
import { useAI } from '../context/AIContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Tutorials: React.FC = () => {
  const { state, dispatch } = useAI()
  const navigate = useNavigate()
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const tutorials = [
    {
      id: 'ml-basics',
      title: 'Machine Learning Basics',
      description: 'Learn the fundamentals of machine learning with hands-on examples',
      difficulty: 'beginner' as const,
      category: 'Machine Learning',
      duration: '30 min',
      rating: 4.8,
      students: 1247,
      icon: <Target className="w-6 h-6" />,
      color: 'purple',
      steps: [
        {
          id: 'step1',
          title: 'What is Machine Learning?',
          description: 'Understand the basic concepts and types of machine learning',
          completed: false
        },
        {
          id: 'step2',
          title: 'Your First Model',
          description: 'Build a simple machine learning model using blocks',
          completed: false
        },
        {
          id: 'step3',
          title: 'Training and Testing',
          description: 'Learn how to train and evaluate your model',
          completed: false
        }
      ]
    },
    {
      id: 'neural-networks',
      title: 'Neural Networks for Kids',
      description: 'Discover how neural networks work like the human brain',
      difficulty: 'intermediate' as const,
      category: 'Neural Networks',
      duration: '45 min',
      rating: 4.9,
      students: 892,
      icon: <Brain className="w-6 h-6" />,
      color: 'pink',
      steps: [
        {
          id: 'step1',
          title: 'Understanding Neurons',
          description: 'Learn how artificial neurons work',
          completed: false
        },
        {
          id: 'step2',
          title: 'Building Layers',
          description: 'Create neural network layers with blocks',
          completed: false
        },
        {
          id: 'step3',
          title: 'Training Your Network',
          description: 'Train your neural network to learn patterns',
          completed: false
        }
      ]
    },
    {
      id: 'computer-vision',
      title: 'Computer Vision Adventures',
      description: 'Teach computers to see and understand images',
      difficulty: 'intermediate' as const,
      category: 'Computer Vision',
      duration: '40 min',
      rating: 4.7,
      students: 756,
      icon: <Eye className="w-6 h-6" />,
      color: 'blue',
      steps: [
        {
          id: 'step1',
          title: 'Loading Images',
          description: 'Learn how to load and process images',
          completed: false
        },
        {
          id: 'step2',
          title: 'Object Detection',
          description: 'Detect objects in images using AI',
          completed: false
        },
        {
          id: 'step3',
          title: 'Image Classification',
          description: 'Categorize images into different classes',
          completed: false
        }
      ]
    },
    {
      id: 'nlp-basics',
      title: 'Natural Language Processing',
      description: 'Make computers understand and generate human language',
      difficulty: 'advanced' as const,
      category: 'Natural Language',
      duration: '50 min',
      rating: 4.6,
      students: 634,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'green',
      steps: [
        {
          id: 'step1',
          title: 'Text Processing',
          description: 'Learn how to process and analyze text',
          completed: false
        },
        {
          id: 'step2',
          title: 'Sentiment Analysis',
          description: 'Analyze emotions in text messages',
          completed: false
        },
        {
          id: 'step3',
          title: 'Text Generation',
          description: 'Create AI that generates human-like text',
          completed: false
        }
      ]
    },
    {
      id: 'data-science',
      title: 'Data Science Explorer',
      description: 'Discover patterns and insights in data',
      difficulty: 'beginner' as const,
      category: 'Data Science',
      duration: '35 min',
      rating: 4.5,
      students: 987,
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'orange',
      steps: [
        {
          id: 'step1',
          title: 'Loading Data',
          description: 'Learn how to load and explore datasets',
          completed: false
        },
        {
          id: 'step2',
          title: 'Data Analysis',
          description: 'Analyze data to find patterns and insights',
          completed: false
        },
        {
          id: 'step3',
          title: 'Creating Visualizations',
          description: 'Create charts and graphs to understand data',
          completed: false
        }
      ]
    }
  ]

  const difficulties = [
    { value: 'all', label: 'All Levels', color: 'gray' },
    { value: 'beginner', label: 'Beginner', color: 'green' },
    { value: 'intermediate', label: 'Intermediate', color: 'yellow' },
    { value: 'advanced', label: 'Advanced', color: 'red' }
  ]

  const categories = [
    { value: 'all', label: 'All Categories', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'Machine Learning', label: 'Machine Learning', icon: <Target className="w-4 h-4" /> },
    { value: 'Neural Networks', label: 'Neural Networks', icon: <Brain className="w-4 h-4" /> },
    { value: 'Computer Vision', label: 'Computer Vision', icon: <Eye className="w-4 h-4" /> },
    { value: 'Natural Language', label: 'Natural Language', icon: <MessageSquare className="w-4 h-4" /> },
    { value: 'Data Science', label: 'Data Science', icon: <BarChart3 className="w-4 h-4" /> }
  ]

  const filteredTutorials = tutorials.filter(tutorial => {
    const difficultyMatch = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty
    const categoryMatch = selectedCategory === 'all' || tutorial.category === selectedCategory
    return difficultyMatch && categoryMatch
  })

  const handleStartTutorial = (tutorial: any) => {
    // Create a new project for the tutorial
    const tutorialProject = {
      id: `tutorial_${tutorial.id}_${Date.now()}`,
      name: tutorial.title,
      description: tutorial.description,
      blocks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    dispatch({ type: 'ADD_PROJECT', payload: tutorialProject })
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: tutorialProject })
    
    // Load tutorial steps into context
    dispatch({ type: 'LOAD_TUTORIALS', payload: [tutorial] })
    
    navigate('/workspace')
    toast.success(`Started tutorial: ${tutorial.title}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      purple: 'ai-block-purple',
      pink: 'ai-block-pink',
      orange: 'ai-block-orange',
      green: 'ai-block-green',
      blue: 'ai-block-blue',
      yellow: 'ai-block-yellow'
    }
    return colorMap[color] || 'ai-block-purple'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">AI Tutorials</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Learn AI concepts step by step with interactive tutorials designed for young learners
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Difficulty Filter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.value}
                  onClick={() => setSelectedDifficulty(difficulty.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === difficulty.value
                      ? 'bg-ai-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    selectedCategory === category.value
                      ? 'bg-ai-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon}
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tutorial, index) => (
          <motion.div
            key={tutorial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="tutorial-card p-6 space-y-4"
          >
            {/* Tutorial Header */}
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${
                getColorClass(tutorial.color).replace('ai-block-', 'bg-ai-')
              }`}>
                {tutorial.icon}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                {tutorial.difficulty}
              </span>
            </div>

            {/* Tutorial Info */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">{tutorial.title}</h3>
              <p className="text-gray-600">{tutorial.description}</p>
            </div>

            {/* Tutorial Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{tutorial.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{tutorial.students}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{tutorial.rating}</span>
              </div>
            </div>

            {/* Tutorial Steps Preview */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">What you'll learn:</h4>
              <div className="space-y-1">
                {tutorial.steps.slice(0, 2).map((step) => (
                  <div key={step.id} className="flex items-center space-x-2 text-sm text-gray-600">
                    <Circle className="w-3 h-3" />
                    <span>{step.title}</span>
                  </div>
                ))}
                {tutorial.steps.length > 2 && (
                  <div className="text-sm text-gray-500">
                    +{tutorial.steps.length - 2} more steps
                  </div>
                )}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => handleStartTutorial(tutorial)}
              className="w-full px-4 py-3 bg-gradient-to-r from-ai-purple to-ai-pink text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Tutorial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTutorials.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tutorials found</h3>
          <p className="text-gray-500">Try adjusting your filters to find more tutorials</p>
        </div>
      )}
    </div>
  )
}

export default Tutorials 