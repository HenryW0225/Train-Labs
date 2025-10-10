import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Code, 
  BookOpen, 
  FolderOpen, 
  Play, 
  Sparkles, 
  Target, 
  Users,
  Zap,
  Lightbulb
} from 'lucide-react'

const Home: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Concepts Made Simple",
      description: "Learn machine learning, neural networks, and computer vision through colorful blocks"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Visual Programming",
      description: "Drag and drop blocks to create AI models without writing complex code"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Interactive Tutorials",
      description: "Step-by-step guides to master different AI concepts at your own pace"
    },
    {
      icon: <FolderOpen className="w-8 h-8" />,
      title: "Project Gallery",
      description: "Save and share your AI creations with other young learners"
    }
  ]

  const aiConcepts = [
    {
      name: "Machine Learning",
      description: "Teach computers to learn from data",
      color: "ai-purple",
      icon: <Target className="w-6 h-6" />
    },
    {
      name: "Neural Networks",
      description: "Create brain-like computer systems",
      color: "ai-pink",
      icon: <Brain className="w-6 h-6" />
    },
    {
      name: "Computer Vision",
      description: "Help computers see and understand images",
      color: "ai-blue",
      icon: <Zap className="w-6 h-6" />
    },
    {
      name: "Natural Language",
      description: "Make computers understand human language",
      color: "ai-green",
      icon: <Users className="w-6 h-6" />
    },
    {
      name: "Data Science",
      description: "Discover patterns in information",
      color: "ai-orange",
      icon: <Lightbulb className="w-6 h-6" />
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-r from-ai-purple to-ai-pink rounded-full mx-auto flex items-center justify-center"
          >
            <Brain className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gradient">
            Learn AI Through
            <br />
            <span className="text-gray-800">Visual Programming</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the fascinating world of artificial intelligence by building AI models 
            with colorful blocks. No coding experience required!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/workspace"
            className="px-8 py-4 bg-gradient-to-r from-ai-purple to-ai-pink text-white rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Start Building</span>
          </Link>
          
          <Link
            to="/tutorials"
            className="px-8 py-4 bg-white text-ai-purple border-2 border-ai-purple rounded-lg text-lg font-semibold hover:bg-ai-purple hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <BookOpen className="w-5 h-5" />
            <span>Learn Tutorials</span>
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose AI Block Coding?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform makes learning AI fun, interactive, and accessible for everyone
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-ai-purple to-ai-pink rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* AI Concepts Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Explore AI Concepts
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Master different areas of artificial intelligence through hands-on projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiConcepts.map((concept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`ai-block ai-block-${concept.color.split('-')[1]} cursor-pointer`}
            >
              <div className="flex items-center space-x-3 mb-3">
                {concept.icon}
                <h3 className="text-lg font-semibold">{concept.name}</h3>
              </div>
              <p className="text-sm opacity-90">{concept.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="bg-gradient-to-r from-ai-purple to-ai-pink rounded-2xl p-8 text-center text-white"
      >
        <div className="space-y-4">
          <Sparkles className="w-12 h-12 mx-auto" />
          <h2 className="text-3xl font-bold">
            Ready to Create Your First AI Project?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of young learners who are already building amazing AI models
          </p>
          <Link
            to="/workspace"
            className="inline-block px-8 py-4 bg-white text-ai-purple rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Get Started Now
          </Link>
        </div>
      </motion.section>
    </div>
  )
}

export default Home 