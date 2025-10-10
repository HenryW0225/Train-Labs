import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Play, 
  Save, 
  Download, 
  Upload,
  Brain,
  Target,
  Zap,
  Users,
  Lightbulb,
  Eye,
  MessageSquare,
  BarChart3
} from 'lucide-react'
import { useAI, AIBlock } from '../context/AIContext'
import BlockPalette from '../components/BlockPalette'
import CodeOutput from '../components/CodeOutput'
import toast from 'react-hot-toast'

const Workspace: React.FC = () => {
  const { state, dispatch } = useAI()
  const workspaceRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // AI Block Templates
  const aiBlockTemplates = [
    {
      category: "Machine Learning",
      color: "purple",
      icon: <Target className="w-5 h-5" />,
      blocks: [
        {
          type: "train_model",
          title: "Train Model",
          description: "Train a machine learning model with data",
          inputs: ["data", "algorithm"],
          outputs: ["model"],
          code: "model = train_model(data, algorithm)"
        },
        {
          type: "predict",
          title: "Make Prediction",
          description: "Use trained model to make predictions",
          inputs: ["model", "input_data"],
          outputs: ["prediction"],
          code: "prediction = model.predict(input_data)"
        },
        {
          type: "evaluate",
          title: "Evaluate Model",
          description: "Test how well your model performs",
          inputs: ["model", "test_data"],
          outputs: ["accuracy"],
          code: "accuracy = evaluate_model(model, test_data)"
        }
      ]
    },
    {
      category: "Neural Networks",
      color: "pink",
      icon: <Brain className="w-5 h-5" />,
      blocks: [
        {
          type: "create_network",
          title: "Create Neural Network",
          description: "Build a neural network with layers",
          inputs: ["layers"],
          outputs: ["network"],
          code: "network = create_neural_network(layers)"
        },
        {
          type: "add_layer",
          title: "Add Layer",
          description: "Add a layer to your neural network",
          inputs: ["network", "layer_type", "neurons"],
          outputs: ["network"],
          code: "network.add_layer(layer_type, neurons)"
        },
        {
          type: "train_network",
          title: "Train Network",
          description: "Train your neural network",
          inputs: ["network", "training_data", "epochs"],
          outputs: ["trained_network"],
          code: "trained_network = train_network(network, training_data, epochs)"
        }
      ]
    },
    {
      category: "Computer Vision",
      color: "blue",
      icon: <Eye className="w-5 h-5" />,
      blocks: [
        {
          type: "load_image",
          title: "Load Image",
          description: "Load an image for processing",
          inputs: ["image_path"],
          outputs: ["image"],
          code: "image = load_image(image_path)"
        },
        {
          type: "detect_objects",
          title: "Detect Objects",
          description: "Find objects in an image",
          inputs: ["image", "model"],
          outputs: ["objects"],
          code: "objects = detect_objects(image, model)"
        },
        {
          type: "classify_image",
          title: "Classify Image",
          description: "Categorize what's in an image",
          inputs: ["image", "classifier"],
          outputs: ["category"],
          code: "category = classify_image(image, classifier)"
        }
      ]
    },
    {
      category: "Natural Language",
      color: "green",
      icon: <MessageSquare className="w-5 h-5" />,
      blocks: [
        {
          type: "process_text",
          title: "Process Text",
          description: "Analyze and understand text",
          inputs: ["text"],
          outputs: ["processed_text"],
          code: "processed_text = process_text(text)"
        },
        {
          type: "generate_text",
          title: "Generate Text",
          description: "Create new text using AI",
          inputs: ["prompt", "model"],
          outputs: ["generated_text"],
          code: "generated_text = generate_text(prompt, model)"
        },
        {
          type: "sentiment_analysis",
          title: "Sentiment Analysis",
          description: "Analyze emotions in text",
          inputs: ["text"],
          outputs: ["sentiment"],
          code: "sentiment = analyze_sentiment(text)"
        }
      ]
    },
    {
      category: "Data Science",
      color: "orange",
      icon: <BarChart3 className="w-5 h-5" />,
      blocks: [
        {
          type: "load_data",
          title: "Load Data",
          description: "Load data from a file",
          inputs: ["file_path"],
          outputs: ["data"],
          code: "data = load_data(file_path)"
        },
        {
          type: "analyze_data",
          title: "Analyze Data",
          description: "Explore and understand your data",
          inputs: ["data"],
          outputs: ["insights"],
          code: "insights = analyze_data(data)"
        },
        {
          type: "visualize",
          title: "Create Visualization",
          description: "Create charts and graphs",
          inputs: ["data", "chart_type"],
          outputs: ["visualization"],
          code: "visualization = create_chart(data, chart_type)"
        }
      ]
    }
  ]

  const handleAddBlock = (blockTemplate: any) => {
    const newBlock: AIBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: blockTemplate.type,
      category: blockTemplate.category,
      color: blockTemplate.color,
      title: blockTemplate.title,
      description: blockTemplate.description,
      inputs: blockTemplate.inputs,
      outputs: blockTemplate.outputs,
      code: blockTemplate.code,
      position: { x: Math.random() * 200, y: Math.random() * 200 }
    }

    dispatch({ type: 'ADD_BLOCK', payload: newBlock })
    toast.success(`Added ${blockTemplate.title} block!`)
  }

  const handleDeleteBlock = (blockId: string) => {
    dispatch({ type: 'DELETE_BLOCK', payload: blockId })
    toast.success('Block deleted!')
  }

  const handleBlockSelect = (blockId: string) => {
    if (state.selectedBlocks.includes(blockId)) {
      dispatch({ type: 'DESELECT_BLOCK', payload: blockId })
    } else {
      dispatch({ type: 'SELECT_BLOCK', payload: blockId })
    }
  }

  const handleNewProject = () => {
    const projectName = prompt('Enter project name:')
    if (projectName) {
      const newProject = {
        id: `project_${Date.now()}`,
        name: projectName,
        description: 'A new AI project',
        blocks: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      dispatch({ type: 'ADD_PROJECT', payload: newProject })
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject })
      toast.success('New project created!')
    }
  }

  const handleSaveProject = () => {
    if (state.currentProject) {
      dispatch({ type: 'UPDATE_PROJECT', payload: state.currentProject })
      toast.success('Project saved!')
    }
  }

  const handleExportProject = () => {
    if (state.currentProject) {
      const dataStr = JSON.stringify(state.currentProject, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${state.currentProject.name}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast.success('Project exported!')
    }
  }

  const handleImportProject = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const project = JSON.parse(e.target?.result as string)
            dispatch({ type: 'ADD_PROJECT', payload: project })
            dispatch({ type: 'SET_CURRENT_PROJECT', payload: project })
            toast.success('Project imported!')
          } catch (error) {
            toast.error('Invalid project file!')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">AI Workspace</h1>
            {state.currentProject && (
              <span className="text-gray-600">
                Project: {state.currentProject.name}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewProject}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
            
            <button
              onClick={handleSaveProject}
              disabled={!state.currentProject}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            
            <button
              onClick={handleExportProject}
              disabled={!state.currentProject}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={handleImportProject}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex">
        {/* Block Palette */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <BlockPalette 
            blockTemplates={aiBlockTemplates}
            onAddBlock={handleAddBlock}
          />
        </div>

        {/* Workspace Area */}
        <div className="flex-1 flex flex-col">
          {/* Workspace Canvas */}
          <div 
            ref={workspaceRef}
            className="flex-1 bg-white relative overflow-hidden"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.1) 1px, transparent 0)', backgroundSize: '20px 20px' }}
          >
            {state.currentProject?.blocks.map((block) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                drag
                dragMomentum={false}
                dragElastic={0.1}
                style={{
                  position: 'absolute',
                  left: block.position.x,
                  top: block.position.y,
                  zIndex: state.selectedBlocks.includes(block.id) ? 10 : 1
                }}
                className={`ai-block ai-block-${block.color} cursor-move ${
                  state.selectedBlocks.includes(block.id) ? 'ring-4 ring-ai-purple ring-opacity-50' : ''
                }`}
                onClick={() => handleBlockSelect(block.id)}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {aiBlockTemplates
                      .find(cat => cat.category === block.category)
                      ?.icon}
                    <h3 className="font-semibold">{block.title}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteBlock(block.id)
                    }}
                    className="text-white opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm opacity-90 mb-3">{block.description}</p>
                
                <div className="space-y-2">
                  {block.inputs.length > 0 && (
                    <div>
                      <p className="text-xs font-medium opacity-75">Inputs:</p>
                      <div className="flex flex-wrap gap-1">
                        {block.inputs.map((input, index) => (
                          <span key={index} className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs">
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
                        {block.outputs.map((output, index) => (
                          <span key={index} className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs">
                            {output}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {(!state.currentProject || state.currentProject.blocks.length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No blocks yet!</h3>
                  <p className="mb-4">Drag AI blocks from the palette to start building</p>
                  <button
                    onClick={handleNewProject}
                    className="px-6 py-3 bg-ai-purple text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Create New Project
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="h-64 bg-gray-900 border-t border-gray-700">
            <CodeOutput />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Workspace 