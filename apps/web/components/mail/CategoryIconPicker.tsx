"use client";
import { CATEGORY_ICONS } from "@/lib/categoryIcons";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import clsx from "clsx";

export function CategoryIconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = CATEGORY_ICONS[value];

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-zinc-900 py-2 pl-3 pr-10 text-left text-white border border-zinc-700">
          <span className="flex items-center gap-2">
            {selected && (
              <div
                className={clsx(
                  "w-6 h-6 flex items-center justify-center rounded-md text-white",
                  selected.bg
                )}
              >
                <selected.icon size={14} />
              </div>
            )}
            <span>{selected?.label || "Choose an icon"}</span>
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown size={16} />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-900 py-1 text-base shadow-lg ring-1 ring-black/20 focus:outline-none sm:text-sm z-50">
            {Object.entries(CATEGORY_ICONS).map(([key, iconObj]: [string, any]) => (
              <Listbox.Option
                key={key}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-zinc-800 text-white" : "text-gray-300"
                  }`
                }
                value={key}
              >
                {({ selected }) => (
                  <>
                    <span className="absolute left-2 top-2.5">
                      <div
                        className={clsx(
                          "w-5 h-5 flex items-center justify-center rounded-md text-white",
                          iconObj.bg
                        )}
                      >
                        <iconObj.icon size={12} />
                      </div>
                    </span>
                    <span>{iconObj.label}</span>
                    {selected && (
                      <span className="absolute inset-y-0 right-3 flex items-center">
                        <Check className="h-4 w-4 text-green-400" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}