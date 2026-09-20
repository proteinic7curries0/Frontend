import { Tabs } from "@base-ui/react/tabs";
import { panelClassName } from "../styles";
import LineChart from "../components/LineChart";
import PieChart from "../components/PieChart";

export default function StatisticsTab() {
    return (
        <Tabs.Panel className={panelClassName} value="statistics">
            <div className="flex flex-col">
                <h1 className="text-2xl">Population</h1>
                <LineChart
                    data={
                        [20, 15, 30, 7, 50, 20]
                    }
                    color="fill-blue-500"
                />
            </div>
            <div className="flex flex-col">
                <h1 className="text-2xl">Saturation</h1>
                <LineChart
                    data={
                        [20, 15, 30, 7, 50, 20]
                    }
                    color="fill-red-500"
                />
            </div>
            <div className="flex gap-8">
                <div className="flex flex-col">
                    <h1 className="text-2xl">Strength distribution</h1>
                    <PieChart
                        data={
                            [20, 10, 45, 100, 86, 56, 23, 64, 8]
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
                            [20, 10, 45, 100, 86, 56, 23, 64, 8]
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