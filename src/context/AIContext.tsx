import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export interface AIBlock {
  id: string
  type: string
  category: string
  color: string
  title: string
  description: string
  inputs: string[]
  outputs: string[]
  code: string
  position: { x: number; y: number }
}

export interface AIProject {
  id: string
  name: string
  description: string
  blocks: AIBlock[]
  createdAt: Date
  updatedAt: Date
}

interface AIState {
  currentProject: AIProject | null
  projects: AIProject[]
  selectedBlocks: string[]
  isRunning: boolean
  output: string[]
  tutorials: Tutorial[]
}

interface Tutorial {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  steps: TutorialStep[]
}

interface TutorialStep {
  id: string
  title: string
  description: string
  blocks: AIBlock[]
}

type AIAction =
  | { type: 'SET_CURRENT_PROJECT'; payload: AIProject | null }
  | { type: 'ADD_PROJECT'; payload: AIProject }
  | { type: 'UPDATE_PROJECT'; payload: AIProject }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_BLOCK'; payload: AIBlock }
  | { type: 'UPDATE_BLOCK'; payload: AIBlock }
  | { type: 'DELETE_BLOCK'; payload: string }
  | { type: 'SELECT_BLOCK'; payload: string }
  | { type: 'DESELECT_BLOCK'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_RUNNING'; payload: boolean }
  | { type: 'ADD_OUTPUT'; payload: string }
  | { type: 'CLEAR_OUTPUT' }
  | { type: 'LOAD_TUTORIALS'; payload: Tutorial[] }

const initialState: AIState = {
  currentProject: null,
  projects: [],
  selectedBlocks: [],
  isRunning: false,
  output: [],
  tutorials: []
}

function aiReducer(state: AIState, action: AIAction): AIState {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload }
    
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] }
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        currentProject: state.currentProject?.id === action.payload.id 
          ? action.payload 
          : state.currentProject
      }
    
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload 
          ? null 
          : state.currentProject
      }
    
    case 'ADD_BLOCK':
      if (!state.currentProject) return state
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          blocks: [...state.currentProject.blocks, action.payload],
          updatedAt: new Date()
        }
      }
    
    case 'UPDATE_BLOCK':
      if (!state.currentProject) return state
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          blocks: state.currentProject.blocks.map(b => 
            b.id === action.payload.id ? action.payload : b
          ),
          updatedAt: new Date()
        }
      }
    
    case 'DELETE_BLOCK':
      if (!state.currentProject) return state
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          blocks: state.currentProject.blocks.filter(b => b.id !== action.payload),
          updatedAt: new Date()
        }
      }
    
    case 'SELECT_BLOCK':
      return {
        ...state,
        selectedBlocks: [...state.selectedBlocks, action.payload]
      }
    
    case 'DESELECT_BLOCK':
      return {
        ...state,
        selectedBlocks: state.selectedBlocks.filter(id => id !== action.payload)
      }
    
    case 'CLEAR_SELECTION':
      return { ...state, selectedBlocks: [] }
    
    case 'SET_RUNNING':
      return { ...state, isRunning: action.payload }
    
    case 'ADD_OUTPUT':
      return { ...state, output: [...state.output, action.payload] }
    
    case 'CLEAR_OUTPUT':
      return { ...state, output: [] }
    
    case 'LOAD_TUTORIALS':
      return { ...state, tutorials: action.payload }
    
    default:
      return state
  }
}

interface AIContextType {
  state: AIState
  dispatch: React.Dispatch<AIAction>
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(aiReducer, initialState)

  return (
    <AIContext.Provider value={{ state, dispatch }}>
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
} 