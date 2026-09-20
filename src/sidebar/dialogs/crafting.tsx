import { Dialog } from "@base-ui/react/dialog";
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, BaseEdge, Controls, EdgeLabelRenderer, getStraightPath, Handle, Position, ReactFlow, type Connection, type EdgeChange, type NodeChange } from "@xyflow/react";
import { useCallback, useState } from "react";
import '@xyflow/react/dist/style.css';
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select, { type Option } from "../../components/Select";
import { Popover } from "@base-ui/react/popover";

export function CraftingLink() {
    return (
        <Dialog.Root>
            <Dialog.Trigger className="outline-none">
                <h1 className="text-xl hover:underline hover:cursor-pointer">Crafting</h1>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:opacity-50 supports-[-webkit-touch-callout:none]:absolute" />
                <Dialog.Popup className="outline-none fixed top-1/2 left-1/2 -mt-8 flex w-400 h-220 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 bg-white dark:bg-neutral-950 p-4 text-neutral-950 dark:text-white border border-neutral-950 dark:border-white shadow-[0.25rem_0.25rem_0] shadow-black/12 dark:shadow-none transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
                    <CraftingDialog />
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

type Node = { id: string, position: { x: number, y: number }, type: string, data: {} }
type Edge = { id: string, source: string, target: string, type: string }


function CraftingDialog() {
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])

    const onNodesChange = useCallback((changes: NodeChange<Node>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), []);
    const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), []);
    const onConnect = useCallback((params: Connection) => { setEdges((edgesSnapshot) => addEdge({ ...params, type: "craft" }, edgesSnapshot)) }, []);

    const onAddNode = useCallback(() => {
        const newNodeId = (nodes.length + 1).toString();

        const newNode = {
            id: newNodeId,
            // Position the new node relative to the pane (or randomly so they don't stack)
            position: {
                x: Math.random() * 400,
                y: Math.random() * 400
            },
            data: {},
            type: "item",
        };

        // Append the new node to the existing nodes array
        setNodes((nds) => nds.concat([newNode]));
    }, [nodes, setNodes]);

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <Dialog.Title className="text-base font-bold">Crafting</Dialog.Title>
            <div className="w-full h-full text-black">
                <div className="absolute w-full h-full">
                    <div className="relative bottom-0 z-10">
                        <Button title="Add item" onClick={onAddNode} />
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

function ItemNode(props: any) {
    const [itemType, setItemType] = useState<ItemType | null>(null)

    return (
        <div className="border border-white p-2 bg-background flex flex-col gap-1">
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />

            <Input title="Name" placeholder="Wood" />
            <Select options={itemTypes} label="Type" placeholder="Select item type" value={itemType} onValueChange={(value) => setItemType(value as any)} />
            {itemType == ItemType.Weapon && (
                <Input title="Attack damage" placeholder="10" />
            )}
            {itemType == ItemType.Tool && (
                <Input title="Mining speed" placeholder="10" />
            )}
        </div>
    )
}

function CraftEdge({ id, sourceX, sourceY, targetX, targetY }: { id: string, sourceX: number, sourceY: number, targetX: number, targetY: number }) {
    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });
    const [cost, setCost] = useState("1")

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
                        <Popover.Trigger className="outline-none">Cost: {cost}x</Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Positioner sideOffset={8}>
                                <Popover.Popup className="relative flex h-(--popup-height,auto) w-(--popup-width,auto) max-w-125 flex-col gap-1 origin-(--transform-origin) bg-white dark:bg-neutral-950 p-3 text-neutral-950 dark:text-white outline-none border border-neutral-950 dark:border-white shadow-[0.25rem_0.25rem_0] shadow-black/12 dark:shadow-none transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
                                    <Popover.Arrow className="relative block w-3 h-1.5 overflow-clip data-[side=bottom]:-top-1.5 data-[side=left]:-right-2.25 data-[side=left]:rotate-90 data-[side=right]:-left-2.25 data-[side=right]:-rotate-90 data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-[calc(6px*sqrt(2))] before:h-[calc(6px*sqrt(2))] before:bg-white dark:before:bg-neutral-950 before:border before:border-neutral-950 dark:before:border-white before:transform-[translate(-50%,50%)_rotate(45deg)]" />
                                    <Input title="Cost" placeholder="" value={cost} onChange={setCost}/>
                                </Popover.Popup>
                            </Popover.Positioner>
                        </Popover.Portal>
                    </Popover.Root>

                </div>
            </EdgeLabelRenderer>
        </>
    );
}