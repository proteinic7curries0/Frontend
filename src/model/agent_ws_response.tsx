import { Agent } from "./agent"


export class AgentWSResponse {
    readonly agent: Agent
    readonly interactions: MessageInteraction[]

    constructor(agent: Agent, interactions: MessageInteraction[]) {
        this.agent = agent
        this.interactions = interactions
    }
    
    static fromJSON(json: Record<string, any>): AgentWSResponse {
        return new AgentWSResponse(Agent.fromJSON(json), (json.messages as Record<string, any>[]).map(MessageInteraction.fromJSON))
    }
}

export class MessageInteraction {
    readonly from: number
    readonly message: string

    constructor(from: number, message: string) {
        this.from = from
        this.message = message
    }

    static fromJSON(json: Record<string, any>): MessageInteraction {
        return new MessageInteraction(json.sender, json.message)
    }
}