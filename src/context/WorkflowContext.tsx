import React, { createContext, useContext, useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';

interface WorkflowContextType {
  workflows: Record<string, { nodes: Node[]; edges: Edge[]; lastSaved: string }>;
  saveWorkflow: (id: string, nodes: Node[], edges: Edge[]) => void;
  getWorkflow: (id: string) => { nodes: Node[]; edges: Edge[]; lastSaved: string } | null;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workflows, setWorkflows] = useState<Record<string, { nodes: Node[]; edges: Edge[]; lastSaved: string }>>({});

  useEffect(() => {
    const savedWorkflows = localStorage.getItem('workflows');
    if (savedWorkflows) {
      setWorkflows(JSON.parse(savedWorkflows));
    }
  }, []);

  const saveWorkflow = (id: string, nodes: Node[], edges: Edge[]) => {
    const now = new Date().toISOString();
    const updatedWorkflows = { ...workflows, [id]: { nodes, edges, lastSaved: now } };
    setWorkflows(updatedWorkflows);
    localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
  };

  const getWorkflow = (id: string) => {
    return workflows[id] || null;
  };

  return (
    <WorkflowContext.Provider value={{ workflows, saveWorkflow, getWorkflow }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};