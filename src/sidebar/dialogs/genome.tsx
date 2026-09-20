import { Dialog } from "@base-ui/react/dialog";
import type { Genome } from "../../model/genome";
import { useState } from "react";

export function GenomeLink({ genomes }: { genomes: Genome[] }) {
    return (
        <Dialog.Root>
            <Dialog.Trigger className="outline-none">
                <h1 className="text-xl hover:underline hover:cursor-pointer">Genome</h1>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:opacity-50 supports-[-webkit-touch-callout:none]:absolute" />
                <Dialog.Popup className="outline-none fixed top-1/2 left-1/2 -mt-8 flex w-400 h-220 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 bg-white dark:bg-neutral-950 p-4 text-neutral-950 dark:text-white border border-neutral-950 dark:border-white shadow-[0.25rem_0.25rem_0] shadow-black/12 dark:shadow-none transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
                    <GenomeDialog genomes={genomes} />
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

function GenomeDialog({ genomes }: { genomes: Genome[] }) {
    const [selectedGenome, setSelectedGenome] = useState<Genome | null>(null)

    return (
        <div>
            {!selectedGenome && <GenomeSelect genomes={genomes} onGenomeSelect={setSelectedGenome} />}
            {selectedGenome && <EditGenome genome={selectedGenome} />}
        </div>
    )
}

function GenomeSelect({ genomes, onGenomeSelect }: { genomes: Genome[], onGenomeSelect: (genome: Genome) => void }) {
    return (
        <div className="flex flex-col gap-2">
            <Dialog.Title className="text-base font-bold">Genome</Dialog.Title>
            <div className="grid grid-cols-3 gap-3 w-200">
                {genomes.map((genome) => (
                    <div key={genome.id}>
                        <div className="w-full flex gap-3">
                            <div className="w-10 h-10" style={{ backgroundColor: genome.color }}></div>
                            <div className="flex flex-col hover:bg-neutral-900 hover:cursor-pointer flex-1 pt-1 pl-1" onClick={(_) => onGenomeSelect(genome)}>
                                <h1 className="leading-none">Genome {genome.id}</h1>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function EditGenome({ genome }: { genome: Genome }) {
    return (
        <div className="flex flex-col gap-2">
            <Dialog.Title className="text-base font-bold">Editing genome {genome.id}</Dialog.Title>
            <p>Genome placeholder</p>
        </div>
    )
}