import { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs } from '@base-ui/react/tabs';
import { tabClassName } from "./styles";
import { Agent } from "./model/agent";
import RunTab from "./sidebar/RunTab";
import InteractionsTab from "./sidebar/InteractionsTab";
import StatisticsTab from "./sidebar/StatisticsTab";
import { Interaction } from "./model/interaction";
import { AgentWSResponse } from "./model/agent_ws_response";
import { type Node, type Edge } from "./sidebar/dialogs/crafting";



function Sidebar({ agents, seed, onSeedChange, agentsCount, setAgentsCount, onStart, isRunning, populationHistory, saturationHistory, interactions, nodes, setNodes, edges, setEdges  }: { agents: Agent[], seed: string, onSeedChange: (seed: string) => void, agentsCount: string, setAgentsCount: (count: string) => void, onStart: () => void, isRunning: boolean, populationHistory: number[], saturationHistory: number[], interactions: Interaction[], nodes: Node[], setNodes: React.Dispatch<React.SetStateAction<Node[]>>, edges: Edge[], setEdges: React.Dispatch<React.SetStateAction<Edge[]>> }) {
  return (
    <Tabs.Root className="w-300 h-220 p-13" defaultValue="run">
      <Tabs.List className="relative z-1 -mb-px flex gap-1">
        <Tabs.Tab className={tabClassName} value="run">
          Run
        </Tabs.Tab>
        <Tabs.Tab className={tabClassName} value="interactions">
          Interactions
        </Tabs.Tab>
        <Tabs.Tab className={tabClassName} value="statistics">
          Statistics
        </Tabs.Tab>
        <Tabs.Indicator className="absolute top-0 left-0 -z-1 h-full w-(--active-tab-width) translate-x-(--active-tab-left) border-x border-t border-neutral-950 bg-white transition-[translate,width] duration-150 ease-in-out dark:border-white dark:bg-neutral-950" />
      </Tabs.List>
      <div className="relative grid h-full w-full grid-cols-1 overflow-hidden border border-neutral-950 bg-white dark:border-white dark:bg-neutral-950">
        <RunTab seed={seed} onSeedChange={onSeedChange} agentsCount={agentsCount} setAgentsCount={setAgentsCount} onStart={onStart} isRunning={isRunning} nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges}/>
        <InteractionsTab interactions={interactions}/>
        <StatisticsTab populationHistory={populationHistory} saturationHistory={saturationHistory} agents={agents}/>
      </div>
    </Tabs.Root>
  );
}

function nodeToRecord(node: Node): Record<string, any> {
  return {
    id: node.id,
    name: node.data.name,
    item_type: node.data.itemType,
    damage: node.data.damage,
    mining: node.data.miningSpeed
  }
}

function edgeToRecord(edge: Edge): Record<string, any> {
  return {
    source: edge.source,
    target: edge.target,
    count: edge.data.cost
  }
}


function App() {
  const [seed, setSeed] = useState("")
  const [agentsCount, setAgentsCount] = useState("")
  
  const [agentsMap, setAgentsMap] = useState<Map<number, Agent>>(new Map());
  const agents = useMemo(() => Array.from(agentsMap.values()), [agentsMap])

  const [populationHistory, setPopulationHistory] = useState<number[]>([])
  const [saturationHistory, setSaturationHistory] = useState<number[]>([])

  const [interactions, setInteractions] = useState<Interaction[]>([]);

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const onStart = () => {
    if (socket) {
      socket.close()
      setSocket(null)
      setPopulationHistory([])
      setSaturationHistory([])
      setInteractions([])
      return
    }
    const nSocket = new WebSocket("http://127.0.0.1:8000/api/ws")
    nSocket.onopen = function() {
      nSocket.send(JSON.stringify({num_agents: parseInt(agentsCount), seed: parseInt(seed), items: nodes.map(nodeToRecord), crafts: edges.map(edgeToRecord)}))
      setSocket(nSocket)
    };
    nSocket.onmessage = function(event)  {
        let data: Record<string, any>[] = JSON.parse(event.data)
        let agentsResponse = data.map(AgentWSResponse.fromJSON)
        agentsResponse.forEach((agentResponse) => {
          const agent = agentResponse.agent
          if (agentsMap.get(agent.id)) {
            let oldAgent = agentsMap.get(agent.id)
            oldAgent!!.saturation = agent.saturation
            oldAgent!!.x = agent.x
            oldAgent!!.y = agent.y
            return
          }

          agentsMap.set(agent.id, agent)
        })
        Array.from(agentsMap.keys()).forEach((key) => {
          if (!agentsResponse.find((a) => a.agent.id == key)) {
            agentsMap.delete(key)
          }
        })
        setAgentsMap(new Map(agentsMap))

        const interactions = agentsResponse.flatMap((a) => {
          console.log(a)
          const interactions = a.interactions.flatMap((i) => {
            const fromAgent = agentsResponse.find((a) => a.agent.id == i.from)?.agent
            if (fromAgent) return [new Interaction(fromAgent, a.agent, i.message)];
            return []
          })
          
          return interactions;
        })
        setInteractions(prev => [...prev, ...interactions]);

        setPopulationHistory(prev => [...prev, agentsResponse.length])
        let saturation = 0;
        if(agentsResponse.length > 0) {
          saturation = agentsResponse.map((a) => a.agent.saturation).reduce((x, y) => x + y) / agentsResponse.length
        }
        setSaturationHistory(prev => [...prev, saturation])
        nSocket.send(JSON.stringify({ ack: true }))
    }
  }

  return (
    <div className="w-full h-lvh flex items-center bg-background">
      <Sidebar agents={agents} seed={seed} onSeedChange={setSeed} agentsCount={agentsCount} setAgentsCount={setAgentsCount} onStart={onStart} isRunning={socket !== null} populationHistory={populationHistory} saturationHistory={saturationHistory} interactions={interactions} nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges}/>
      <div className="h-full w-full bg-background flex justify-center items-center">
        <div className="w-220 h-220 border-2 border-white grid grid-cols-44 grid-rows-44">
          {agents.map((agent) => (
              <div className="w-5 h-5" style={{ backgroundColor: agent?.color, gridColumn: agent.x + 1, gridRow: agent.y + 1 }} key={agent.id}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
