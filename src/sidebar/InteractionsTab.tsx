import { Tabs } from "@base-ui/react/tabs";
import type { Agent } from "../model/agent";
import { panelClassName } from "../styles";
import { useState } from "react";
import type { Interaction } from "../model/interaction";

export default function InteractionsTab({ agents }: { agents: Agent[] }) {
    const [selectedFirstAgent, setSelectedFirstAgent] = useState<Agent | null>(null)
    const [selectedSecondAgent, setSelectedSecondAgent] = useState<Agent | null>(null);

    return (
        <Tabs.Panel className={panelClassName + ' overflow-y-scroll'} value="interactions">
            {!selectedFirstAgent && <MainInteractionsTab agents={agents} onAgentSelected={setSelectedFirstAgent} />}
            {selectedFirstAgent && !selectedSecondAgent && <InteractionsForAgent agent={selectedFirstAgent} interactedWith={agents} onGoBack={() => setSelectedFirstAgent(null)} onAgentSelected={setSelectedSecondAgent}/>}
            {selectedFirstAgent && selectedSecondAgent && <InteractionsBetween firstAgent={selectedFirstAgent} secondAgent={selectedSecondAgent} onGoBack={() => setSelectedSecondAgent(null)} interactions={[]}/>}
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
                            <h4 className="text-neutral-400">Last interaction</h4>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    )
}

function InteractionsForAgent({ agent, interactedWith, onGoBack, onAgentSelected }: { agent: Agent, interactedWith: Agent[], onGoBack: () => void, onAgentSelected: (agent: Agent) => void }) {
    return (
        <div>
            <div className="flex justify-between items-end pb-3 gap-1">
                <h1 className="text-lg leading-none">Interactions for: Agent {agent.id}</h1>
                <p className="underline hover:cursor-pointer" onClick={(_) => onGoBack()}>Back</p>
            </div>
            <div className="flex flex-col gap-2">
                {
                    interactedWith.map((agent) => (
                        <div key={agent.id}>
                            <div className="w-full flex gap-3">
                                <div className="w-10 h-10" style={{ backgroundColor: agent.color }}></div>
                                <div className="flex flex-col hover:bg-neutral-900 hover:cursor-pointer flex-1 pt-1 pl-1" onClick={(_) => onAgentSelected(agent)}>
                                    <h1 className="leading-none">Agent {agent.id}</h1>
                                    <h4 className="text-neutral-400">Last interaction</h4>
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
        </div>
    )
}