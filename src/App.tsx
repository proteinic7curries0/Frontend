import { useMemo } from "react";
import { Tabs } from '@base-ui/react/tabs';
import { tabClassName } from "./styles";
import { Agent } from "./model/agent";
import RunTab from "./sidebar/RunTab";
import InteractionsTab from "./sidebar/InteractionsTab";
import StatisticsTab from "./sidebar/StatisticsTab";



function Sidebar({ agentsMatrix }: { agentsMatrix: (Agent | null)[][] }) {
  const agents = useMemo(() => agentsMatrix.flat().filter((a) => !!a), [agentsMatrix]);[]

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
        <RunTab/>
        <InteractionsTab agents={agents}/>
        <StatisticsTab/>
      </div>
    </Tabs.Root>
  );
}


function App() {
  const agentsMatrix: (Agent | null)[][] = useMemo(() => {
    let rows = [];
    let id = 0;
    for (let i = 0; i < 44; i++) {
      let row = [];
      for (let j = 0; j < 44; j++) {
        if (!Math.round(Math.random() * 5)) {
          row.push(new Agent(++id));
        } else {
          row.push(null);
        }
      }
      rows.push(row);
    }
    return rows;
  }, []);

  return (
    <div className="w-full h-lvh flex items-center bg-background">
      <Sidebar agentsMatrix={agentsMatrix} />
      <div className="h-full w-full bg-background flex justify-center items-center">
        <div className="w-220 h-220 border-2 border-white grid grid-cols-44 grid-rows-44">
          {agentsMatrix.map((row) =>
            row.map((agent) => (
              <div className="w-5 h-5" style={{ backgroundColor: agent?.color }}></div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
