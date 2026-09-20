import { Dialog } from "@base-ui/react/dialog";
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, BaseEdge, Controls, EdgeLabelRenderer, getStraightPath, Handle, Position, ReactFlow, type Connection, type EdgeChange, type NodeChange, type NodeProps } from "@xyflow/react";
import { useCallback, useState } from "react";
import '@xyflow/react/dist/style.css';
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select, { type Option } from "../../components/Select";
import { Popover } from "@base-ui/react/popover";

export function CraftingLink({ nodes, setNodes, edges, setEdges }: { nodes: Node[], setNodes: React.Dispatch<React.SetStateAction<Node[]>>, edges: Edge[], setEdges: React.Dispatch<React.SetStateAction<Edge[]>> }) {
    return (
        <Dialog.Root>
            <Dialog.Trigger className="outline-none">
                <h1 className="text-xl hover:underline hover:cursor-pointer">Crafting</h1>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:opacity-50 supports-[-webkit-touch-callout:none]:absolute" />
                <Dialog.Popup className="outline-none fixed top-1/2 left-1/2 -mt-8 flex w-400 h-220 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 bg-white dark:bg-neutral-950 p-4 text-neutral-950 dark:text-white border border-neutral-950 dark:border-white shadow-[0.25rem_0.25rem_0] shadow-black/12 dark:shadow-none transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
                    <CraftingDialog nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export type Node = {
    id: string,
    position: { x: number, y: number },
    type: string,
    data: {
        name: string,
        onNameChange: (name: string) => void,
        itemType: ItemType | null,
        onItemTypeChange: (ty: ItemType | null) => void
        damage: string | null,
        onDamageChange: (damage: string | null) => void
        miningSpeed: string | null,
        onMiningSpeedChange: (speed: string | null) => void
    }
}
export type Edge = {
    id: string,
    source: string,
    target: string,
    type: string,
    data: {
        cost: string,
        onCostChange: (cost: string) => void
    }
}


function CraftingDialog({ nodes, setNodes, edges, setEdges }: { nodes: Node[], setNodes: React.Dispatch<React.SetStateAction<Node[]>>, edges: Edge[], setEdges: React.Dispatch<React.SetStateAction<Edge[]>> }) {
    const onNodesChange = useCallback((changes: NodeChange<Node>[]) => setNodes(applyNodeChanges(changes, nodes)), [nodes]);
    const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => setEdges(applyEdgeChanges(changes, edges)), [edges]);
    const onConnect = useCallback((params: Connection) => { setEdges(addEdge({ ...params, type: "craft", data: { cost: "1", onCostChange: (cost) => setEdges(edges => edges.map((edge) => edge.source == params.source && edge.target == params.target ? { ...edge, data: { ...edge.data, cost }, } : edge)) } }, edges)) }, [edges]);
    const onAddNode = useCallback(() => {
        const newNodeId = (nodes.length + 1).toString(); 
        const newNode: Node = { id: newNodeId, position: { x: Math.random() * 400, y: Math.random() * 400 }, data: { name: "", onNameChange: (name) => { setNodes(nodes => nodes.map((node) => node.id === newNodeId ? { ...node, data: { ...node.data, name }, } : node)) }, itemType: null, onItemTypeChange: (itemType) => { setNodes(nodes => nodes.map((node) => node.id === newNodeId ? { ...node, data: { ...node.data, itemType, damage: null, miningSpeed: null }, } : node)) }, damage: null, onDamageChange: (damage) => { setNodes(nodes => nodes.map((node) => node.id === newNodeId ? { ...node, data: { ...node.data, damage }, } : node)) }, miningSpeed: null, onMiningSpeedChange: (speed) => { setNodes(nodes => nodes.map((node) => node.id === newNodeId ? { ...node, data: { ...node.data, miningSpeed: speed }, } : node)) } }, type: "item", }; setNodes((nds) => nds.concat([newNode]));
    }, [nodes, setNodes]);
    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <Dialog.Title className="text-base font-bold">Crafting</Dialog.Title>
            <div className="w-full h-full text-black">
                <div className="absolute w-full h-full">
                    <div className="relative bottom-0 z-10">
                        <Button title="Add item" onClick={onAddNode} disabled={false} />
                    </div>
                </div>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    panOnScroll={true}
                    fitView>
                </ReactFlow>
            </div>
        </div>
    )
}

const nodeTypes = {
    item: ItemNode
}
const edgeTypes = {
    craft: CraftEdge
}

const ItemType = {
    Weapon: "weapon",
    Tool: "tool",
    Other: "other"
} as const;
type ItemType = typeof ItemType[keyof typeof ItemType];

const itemTypes: Option[] = [
    { label: "Weapon", value: ItemType.Weapon },
    { label: "Tool", value: ItemType.Tool },
    { label: "Other", value: ItemType.Other }
]

function ItemNode({ data }: Pick<Node, "data">) {
    return (
        <div className="border border-white p-2 bg-background flex flex-col gap-1">
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />

            <Input title="Name" placeholder="Wood" value={data.name} onChange={data.onNameChange} type="text" />
            <Select options={itemTypes} label="Type" placeholder="Select item type" value={data.itemType} onValueChange={(value) => data.onItemTypeChange(value as any)} />
            {data.itemType == ItemType.Weapon && (
                <Input title="Attack damage" placeholder="10" value={data.damage} onChange={data.onDamageChange} type="number" />
            )}
            {data.itemType == ItemType.Tool && (
                <Input title="Mining speed" placeholder="10" value={data.miningSpeed} onChange={data.onMiningSpeedChange} type="number" />
            )}
        </div>
    )
}

function CraftEdge({ id, sourceX, sourceY, targetX, targetY, data }: Edge & { sourceX: number, sourceY: number, targetX: number, targetY: number }) {
    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: 'all'
                    }}
                    className="text-white bg-black border border-white p-1 nodrag nopan">
                    <Popover.Root>
                        <Popover.Trigger className="outline-none">Cost: {data.cost}x</Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Positioner sideOffset={8}>
                                <Popover.Popup className="relative flex h-(--popup-height,auto) w-(--popup-width,auto) max-w-125 flex-col gap-1 origin-(--transform-origin) bg-white dark:bg-neutral-950 p-3 text-neutral-950 dark:text-white outline-none border border-neutral-950 dark:border-white shadow-[0.25rem_0.25rem_0] shadow-black/12 dark:shadow-none transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
                                    <Popover.Arrow className="relative block w-3 h-1.5 overflow-clip data-[side=bottom]:-top-1.5 data-[side=left]:-right-2.25 data-[side=left]:rotate-90 data-[side=right]:-left-2.25 data-[side=right]:-rotate-90 data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-[calc(6px*sqrt(2))] before:h-[calc(6px*sqrt(2))] before:bg-white dark:before:bg-neutral-950 before:border before:border-neutral-950 dark:before:border-white before:transform-[translate(-50%,50%)_rotate(45deg)]" />
                                    <Input title="Cost" placeholder="" value={data.cost} onChange={data.onCostChange} type="number" />
                                </Popover.Popup>
                            </Popover.Positioner>
                        </Popover.Portal>
                    </Popover.Root>

                </div>
            </EdgeLabelRenderer>
        </>
    );
}