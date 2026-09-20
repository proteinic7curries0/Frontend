import { Tabs } from "@base-ui/react/tabs";
import { panelClassName } from "../styles";
import LineChart from "../components/LineChart";
import PieChart from "../components/PieChart";
import type { Agent } from "../model/agent";
import { useMemo } from "react";

export default function StatisticsTab({ populationHistory, saturationHistory, agents }: { populationHistory: number[], saturationHistory: number[], agents: Agent[] }) {
    const strenghs = useMemo(() => Array.from(agents.map((a) => a.strength)), [agents])
    const intelligences = useMemo(() => Array.from(agents.map((a) => a.intelligence)), [agents])
    
    return (
        <Tabs.Panel className={panelClassName} value="statistics">
            <div className="flex flex-col">
                <h1 className="text-2xl">Population</h1>
                <LineChart
                    data={
                        populationHistory
                    }
                    color="fill-blue-500"
                />
            </div>
            <div className="flex flex-col">
                <h1 className="text-2xl">Saturation</h1>
                <LineChart
                    data={
                        saturationHistory
                    }
                    color="fill-red-500"
                />
            </div>
            <div className="flex gap-8">
                <div className="flex flex-col">
                    <h1 className="text-2xl">Strength distribution</h1>
                    <PieChart
                        data={
                           strenghs 
                        }
                        colors={
                            ["fill-orange-500", "fill-green-500", "fill-blue-500", "fill-red-500"]
                        }
                    />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-2xl">Intelligence distribution</h1>
                    <PieChart
                        data={
                            intelligences
                        }
                        colors={
                            ["fill-orange-500", "fill-green-500", "fill-blue-500", "fill-red-500"]
                        }
                    />
                </div>
            </div>
        </Tabs.Panel>
    )
}