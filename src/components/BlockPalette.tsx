import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'

interface BlockTemplate {
  type: string
  title: string
  description: string
  inputs: string[]
  outputs: string[]
  code: string
}

interface CategoryTemplate {
  category: string
  color: string
  icon: React.ReactNode
  blocks: BlockTemplate[]
}

interface BlockPaletteProps {
  blockTemplates: CategoryTemplate[]
  onAddBlock: (block: BlockTemplate) => void
}

const BlockPalette: React.FC<BlockPaletteProps> = ({ blockTemplates, onAddBlock }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Machine Learning'])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
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
    <div className="p-4 space-y-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">AI Blocks</h2>
        <p className="text-sm text-gray-600">
          Drag blocks to the workspace to build your AI project
        </p>
      </div>

      <div className="space-y-2">
        {blockTemplates.map((category) => (
          <div key={category.category} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.category)}
              className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                expandedCategories.includes(category.category)
                  ? 'bg-gray-100'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                  getColorClass(category.color).replace('ai-block-', 'bg-ai-')
                }`}>
                  {category.icon}
                </div>
                <span className="font-semibold text-gray-800">{category.category}</span>
              </div>
              {expandedCategories.includes(category.category) ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* Category Blocks */}
            <AnimatePresence>
              {expandedCategories.includes(category.category) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-3 space-y-2">
                    {category.blocks.map((block, index) => (
                      <motion.div
                        key={block.type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`ai-block ${getColorClass(category.color)} cursor-pointer`}
                        onClick={() => onAddBlock(block)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">{block.title}</h4>
                          <Plus className="w-4 h-4 opacity-70" />
                        </div>
                        
                        <p className="text-xs opacity-90 mb-3">{block.description}</p>
                        
                        <div className="space-y-1">
                          {block.inputs.length > 0 && (
                            <div>
                              <p className="text-xs font-medium opacity-75">Inputs:</p>
                              <div className="flex flex-wrap gap-1">
                                {block.inputs.map((input, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 bg-white bg-opacity-20 rounded text-xs">
                                    {input}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {block.outputs.length > 0 && (
                            <div>
                              <p className="text-xs font-medium opacity-75">Outputs:</p>
                              <div className="flex flex-wrap gap-1">
                                {block.outputs.map((output, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 bg-white bg-opacity-20 rounded text-xs">
                                    {output}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Quick Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Click on blocks to add them to your workspace</li>
          <li>• Drag blocks around to organize your project</li>
          <li>• Connect blocks by placing them near each other</li>
          <li>• Use the Run button to execute your AI project</li>
        </ul>
      </div>
    </div>
  )
}

export default BlockPalette 