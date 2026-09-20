import { Tabs } from "@base-ui/react/tabs";
import { panelClassName } from "../styles";
import Input from "../components/Input";
import Button from "../components/Button";
import { Dialog } from "@base-ui/react/dialog";
import { Genome } from "../model/genome";
import { useMemo } from "react";
import { GenomeLink } from "./dialogs/genome";
import { CraftingLink, type Edge, type Node } from "./dialogs/crafting";

export default function RunTab({ seed, onSeedChange, agentsCount, setAgentsCount, onStart, isRunning, nodes, setNodes, edges, setEdges  }: { seed: string, onSeedChange: (seed: string) => void, agentsCount: string, setAgentsCount: (count: string) => void, onStart: () => void, isRunning: boolean, nodes: Node[], setNodes: React.Dispatch<React.SetStateAction<Node[]>>, edges: Edge[], setEdges: React.Dispatch<React.SetStateAction<Edge[]>> }) {
    const genomes = useMemo(() => {
        let genomes = []
        for (let i = 0; i < 10; i++) {
            genomes.push(new Genome(i));
        }
        return genomes;
    }, [])

    return (
        <Tabs.Panel className={panelClassName} value="run">
            <div className="flex gap-5">
                <div className="flex flex-col gap-4">
                    <Input title="Seed" placeholder="43" value={seed} onChange={onSeedChange} type="number"/> 
                    <Input title="Agents count" placeholder="23" value={agentsCount} onChange={setAgentsCount} type="number"/>
                    <div className="flex justify-start w-65">
                        <Button title={isRunning ? "Stop simulation" : "Start simulation"} onClick={onStart} disabled={seed.length == 0 || agentsCount.length == 0 || parseInt(agentsCount) <= 0 }/>
                    </div>
                </div>
                <div>
                    <h1 className="text-sm text-neutral-950 dark:text-white">Extras</h1>
                    <GenomeLink genomes={genomes} /><br /> {/* Dialog.Root makes them inline XXD */}
                    <CraftingLink nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
                </div>
            </div>
        </Tabs.Panel>
    )
}


