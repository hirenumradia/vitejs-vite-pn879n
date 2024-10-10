import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  ReactFlowInstance,
  MarkerType,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';
import { useMachine } from '@xstate/react';
import NodeLibrary from './NodeLibrary';
import NodeConfigPanel from './NodeConfigPanel';
import { nodeTypes } from './nodes';
import { WorkflowNode, WorkflowEdge } from '@/types/workflow';
import { workflowMachine } from '@/machines/workflowMachine';
import Header from './Header';
import { useWorkflow } from '@/context/WorkflowContext';

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FlowContainer = styled.div`
  flex-grow: 1;
  display: flex;
`;

const WorkflowEditor: React.FC<{ workflowId: string }> = ({ workflowId }) => {
  const { saveWorkflow, getWorkflow } = useWorkflow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [state, send] = useMachine(workflowMachine);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const savedWorkflow = getWorkflow(workflowId);
    if (savedWorkflow) {
      setNodes(savedWorkflow.nodes);
      setEdges(savedWorkflow.edges);
    }
  }, [workflowId, getWorkflow]);

  const debouncedSave = useCallback(
    (() => {
      let timer: NodeJS.Timeout;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          saveWorkflow(workflowId, nodes, edges);
          setLastSaved(new Date());
          send({ type: 'SAVE' });
        }, 1000); // 1 second debounce
      };
    })(),
    [workflowId, nodes, edges, saveWorkflow, send]
  );

  const onNodesChangeWithSave = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    const positionChange = changes.find(change => change.type === 'position' && !change.dragging);
    if (positionChange) {
      debouncedSave();
    }
  }, [onNodesChange, debouncedSave]);

  const onEdgesChangeWithSave = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
    debouncedSave();
  }, [onEdgesChange, debouncedSave]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
    debouncedSave();
  }, [setEdges, debouncedSave]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const getNodeLabel = (type: string): string => {
    switch (type) {
      case 'startNode':
        return 'Start';
      case 'actionNode':
        return 'Action';
      case 'conditionNode':
        return 'Condition';
      case 'endNode':
        return 'End';
      default:
        return type;
    }
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowInstance || !reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: WorkflowNode = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: { label: getNodeLabel(type) },
      };

      setNodes((nds) => nds.concat(newNode));
      debouncedSave();
    },
    [reactFlowInstance, setNodes, debouncedSave]
  );

  const edgeOptions = {
    animated: state.matches('live'),
    style: {
      stroke: state.matches('live') ? '#10b981' : '#9ca3af',
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: state.matches('live') ? '#10b981' : '#9ca3af',
    },
  };

  const handlePublish = () => {
    send({ type: state.matches('draft') ? 'PUBLISH' : 'UNPUBLISH' });
    debouncedSave();
  };

  return (
    <EditorContainer>
      <Header 
        onSave={debouncedSave}
        onPublish={handlePublish}
        isPublished={state.matches('live')}
        currentState={state.value.toString()}
        lastSaved={lastSaved}
      />
      <FlowContainer>
        <NodeLibrary />
        <div ref={reactFlowWrapper} style={{ flexGrow: 1, height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChangeWithSave}
            onEdgesChange={onEdgesChangeWithSave}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={edgeOptions}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        {selectedNode && (
          <NodeConfigPanel 
            node={selectedNode} 
            setNode={setNodes} 
            onSave={debouncedSave}
          />
        )}
      </FlowContainer>
    </EditorContainer>
  );
};

export default WorkflowEditor;