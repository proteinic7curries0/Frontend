export const tabClassName =
  'flex h-[calc(2rem+1px)] items-center justify-center bg-transparent px-2 py-0 font-inherit text-sm font-normal leading-5 break-keep whitespace-nowrap text-neutral-600 outline-none select-none hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 dark:focus-visible:outline-white data-active:text-neutral-950 dark:text-neutral-300 dark:hover:text-white dark:data-active:text-white';

export const panelClassName =
  'col-start-1 row-start-1 flex flex-col w-full p-4 text-sm text-neutral-950 outline-none focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 dark:focus-visible:outline-white dark:text-white ' +
  '[transition:opacity_175ms_ease,translate_350ms_cubic-bezier(0.22,1,0.36,1)] ' +
  'data-starting-style:opacity-0 data-ending-style:opacity-0 ' +
  'motion-safe:data-starting-style:data-[activation-direction=left]:translate-x-[-50%] ' +
  'motion-safe:data-starting-style:data-[activation-direction=right]:translate-x-[50%] ' +
  'motion-safe:data-ending-style:data-[activation-direction=left]:translate-x-[50%] ' +
  'motion-safe:data-ending-style:data-[activation-direction=right]:translate-x-[-50%]';
