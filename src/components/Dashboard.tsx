import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { useWorkflow } from '@/context/WorkflowContext'

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`

const WorkflowList = styled.ul`
  list-style-type: none;
  padding: 0;
`

const WorkflowItem = styled.li`
  background-color: #f0f0f0;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Button = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #0051bb;
  }
`

interface Workflow {
  id: string;
  name: string;
}

const Dashboard = () => {
  const { workflows } = useWorkflow();
  const [workflowList, setWorkflowList] = useState<Workflow[]>([]);

  useEffect(() => {
    const list = Object.entries(workflows).map(([id, workflow]) => ({
      id,
      name: workflow.name || `Workflow ${id}`,
    }));
    setWorkflowList(list);
  }, [workflows]);

  const handleDelete = (id: string) => {
    // Implement delete functionality
    console.log(`Delete workflow ${id}`);
  }

  return (
    <DashboardContainer>
      <h2>Your Workflows</h2>
      <Link href="/editor/new">
        <Button>Create New Workflow</Button>
      </Link>
      <WorkflowList>
        {workflowList.map(workflow => (
          <WorkflowItem key={workflow.id}>
            <span>{workflow.name}</span>
            <div>
              <Link href={`/editor/${workflow.id}`}>
                <Button>Edit</Button>
              </Link>
              <Button onClick={() => handleDelete(workflow.id)}>Delete</Button>
            </div>
          </WorkflowItem>
        ))}
      </WorkflowList>
    </DashboardContainer>
  )
}

export default Dashboard