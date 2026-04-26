"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export type MegaMenuItem = {
  id: number;
  label: string;
  subMenus?: {
    title: string;
    items: {
      label: string;
      description: string;
      icon: React.ElementType;
      href?: string;
    }[];
  }[];
  link?: string;
};

export interface MegaMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  items: MegaMenuItem[];
  className?: string;
}

const MegaMenu = React.forwardRef<HTMLUListElement, MegaMenuProps>(
  ({ items, className, ...props }, ref) => {
    const [openMenu, setOpenMenu] = React.useState<string | null>(null);

    const handleHover = (menuLabel: string | null) => {
      setOpenMenu(menuLabel);
    };

    return (
      <ul
        ref={ref}
        className={`relative flex items-center space-x-0 ${className || ""}`}
        {...props}
      >
        {items.map((navItem) => (
          <li
            key={navItem.label}
            className="relative"
            onMouseEnter={() => handleHover(navItem.label)}
            onMouseLeave={() => handleHover(null)}
          >
            {navItem.link && !navItem.subMenus ? (
              <Link
                href={navItem.link}
                className="relative flex cursor-pointer items-center justify-center gap-1 px-4 py-1.5 text-sm text-[#2B2B2B]/70 transition-colors duration-300 hover:text-[#C9A227]"
              >
                <span className="relative z-10">{navItem.label}</span>
              </Link>
            ) : (
              <button
                className="group relative flex cursor-pointer items-center justify-center gap-1 px-4 py-1.5 text-sm text-[#2B2B2B]/70 transition-colors duration-300 hover:text-[#C9A227]"
                type="button"
              >
                <span className="relative z-10">{navItem.label}</span>
                {navItem.subMenus && (
                  <ChevronDown
                    className={`relative z-10 h-4 w-4 transition-transform duration-300 group-hover:rotate-180 ${
                      openMenu === navItem.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            )}

            <AnimatePresence>
              {openMenu === navItem.label && navItem.subMenus && (
                <div className="absolute left-0 top-full z-10 w-auto pt-2">
                  <motion.div
                    className="w-max border border-[#F5E6DA] bg-[#FFFDF9] p-4 shadow-[0_24px_70px_rgba(10,10,10,0.12)]"
                    style={{
                      borderRadius: 16,
                    }}
                    layoutId="menu"
                  >
                    <div className="flex w-fit shrink-0 space-x-9 overflow-hidden">
                      {navItem.subMenus.map((sub) => (
                        <motion.div layout className="w-full" key={sub.title}>
                          <h3 className="mb-4 text-sm font-medium capitalize text-[#8A8A8A]">
                            {sub.title}
                          </h3>
                          <ul className="space-y-6">
                            {sub.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <li key={item.label}>
                                  <Link
                                    href={item.href ?? "#"}
                                    className="group flex items-start space-x-3"
                                  >
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[#F5E6DA] bg-[#F5E6DA] text-[#2B2B2B] transition-colors duration-300 group-hover:bg-[#C9A227]">
                                      <Icon className="h-5 w-5 flex-none" />
                                    </div>
                                    <div className="w-max leading-5">
                                      <p className="shrink-0 text-sm font-medium text-[#2B2B2B]">
                                        {item.label}
                                      </p>
                                      <p className="shrink-0 text-xs text-[#8A8A8A] transition-colors duration-300 group-hover:text-[#2B2B2B]">
                                        {item.description}
                                      </p>
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    );
  },
);

MegaMenu.displayName = "MegaMenu";

export default MegaMenu;
