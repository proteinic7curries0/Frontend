import { Tabs } from "@base-ui/react/tabs";
import { panelClassName } from "../styles";
import Input from "../components/Input";
import Button from "../components/Button";
import { Dialog } from "@base-ui/react/dialog";
import { Genome } from "../model/genome";
import { useMemo } from "react";
import { GenomeLink } from "./dialogs/genome";
import { CraftingLink } from "./dialogs/crafting";

export default function RunTab() {
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
                    <Input title="Seed" placeholder="43" />
                    <Input title="Agents count" placeholder="23" />
                    <div className="flex justify-start w-65">
                        <Button title="Start simulation" />
                    </div>
                </div>
                <div>
                    <h1 className="text-sm text-neutral-950 dark:text-white">Extras</h1>
                    <GenomeLink genomes={genomes} /><br /> {/* Dialog.Root makes them inline XXD */}
                    <CraftingLink />
                </div>
            </div>
        </Tabs.Panel>
    )
}


