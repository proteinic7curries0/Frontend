import { Tabs } from "@base-ui/react/tabs";
import type { Agent } from "../model/agent";
import { panelClassName } from "../styles";
import { useMemo, useState } from "react";
import { Interaction } from "../model/interaction";

export default function InteractionsTab({ interactions }: { interactions: Interaction[] }) {
    const [selectedFirstAgent, setSelectedFirstAgent] = useState<Agent | null>(null)
    const [selectedSecondAgent, setSelectedSecondAgent] = useState<Agent | null>(null);
    const agents = useMemo(() => {
        return [...new Set(interactions.flatMap((i) => [i.from, i.to]))]
    }, [interactions])

    return (
        <Tabs.Panel className={panelClassName + ' overflow-y-scroll'} value="interactions">
            {!selectedFirstAgent && <MainInteractionsTab agents={agents} onAgentSelected={setSelectedFirstAgent} />}
            {selectedFirstAgent && !selectedSecondAgent && <InteractionsForAgent agent={selectedFirstAgent} interactions={interactions} onGoBack={() => setSelectedFirstAgent(null)} onAgentSelected={setSelectedSecondAgent} />}
            {selectedFirstAgent && selectedSecondAgent && <InteractionsBetween firstAgent={selectedFirstAgent} secondAgent={selectedSecondAgent} onGoBack={() => setSelectedSecondAgent(null)} interactions={interactions} />}
        </Tabs.Panel>
    )
}

function MainInteractionsTab({ agents, onAgentSelected }: { agents: Agent[], onAgentSelected: (agent: Agent) => void }) {
    return (
        <div className="flex flex-col gap-2">
            {agents.map((agent) => (
                <div key={agent.id}>
                    <div className="w-full flex gap-3">
                        <div className="w-10 h-10" style={{ backgroundColor: agent.color }}></div>
                        <div className="flex flex-col hover:bg-neutral-900 hover:cursor-pointer flex-1 pt-1 pl-1" onClick={(_) => onAgentSelected(agent)}>
                            <h1 className="leading-none">Agent {agent.id}</h1>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    )
}

function InteractionsForAgent({ agent, interactions, onGoBack, onAgentSelected }: { agent: Agent, interactions: Interaction[], onGoBack: () => void, onAgentSelected: (agent: Agent) => void }) {
    const filteredInteractions = useMemo(() => {
        return [... new Set(interactions.flatMap((i) => {
            if (i.from == agent) {
                return [i.to]
            }
            if (i.to == agent) {
                return [i.from];
            }
            return []
        }))]
    }, [interactions, agent])

    return (
        <div>
            <div className="flex justify-between items-end pb-3 gap-1">
                <h1 className="text-lg leading-none">Interactions for: Agent {agent.id}</h1>
                <p className="underline hover:cursor-pointer" onClick={(_) => onGoBack()}>Back</p>
            </div>
            <div className="flex flex-col gap-2">
                {
                    filteredInteractions.map((agent) => (
                        <div key={agent.id}>
                            <div className="w-full flex gap-3">
                                <div className="w-10 h-10" style={{ backgroundColor: agent.color }}></div>
                                <div className="flex flex-col hover:bg-neutral-900 hover:cursor-pointer flex-1 pt-1 pl-1" onClick={(_) => onAgentSelected(agent)}>
                                    <h1 className="leading-none">Agent {agent.id}</h1>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div >
    )
}

function InteractionsBetween({ firstAgent, secondAgent, interactions, onGoBack }: { firstAgent: Agent, secondAgent: Agent, interactions: Interaction[], onGoBack: () => void }) {
    return (
        <div>
            <div className="flex justify-between items-end pb-3 gap-1">
                <h1 className="text-lg leading-none">Interactions: Agent {firstAgent.id} - Agent {secondAgent.id}</h1>
                <p className="underline hover:cursor-pointer" onClick={(_) => onGoBack()}>Back</p>
            </div>
            <div className="flex flex-col gap-3 overflow-y-scroll">
                {interactions.filter((i) => (i.from == firstAgent && i.to == secondAgent) || (i.from == secondAgent && i.to == firstAgent)).map((i) => (
                    <div className="flex gap-2 items-end">
                        <div className="w-10 h-10" style={{ backgroundColor: i.from.color }}></div>
                        <div>
                            <h1 className="font-bold">Agent {i.from.id}</h1>
                            <p>{i.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}