'use client';


import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return (
    _jsx(TooltipPrimitive.Provider, {
      "data-slot": "tooltip-provider",
      delayDuration: delayDuration, ...
      props }
    ));

}

function Tooltip({
  ...props
}) {
  return (
    _jsx(TooltipProvider, { children:
      _jsx(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props }) }
    ));

}

function TooltipTrigger({
  ...props
}) {
  return _jsx(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return (
    _jsx(TooltipPrimitive.Portal, { children:
      _jsxs(TooltipPrimitive.Content, {
        "data-slot": "tooltip-content",
        sideOffset: sideOffset,
        className: cn(
          'bg-[#111214]/80 backdrop-blur-md text-white border border-white/10 shadow-2xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance',
          className
        ), ...
        props, children: [

        children,
        _jsx(TooltipPrimitive.Arrow, { className: "fill-[#111214] opacity-80 z-50 size-2" })] }
      ) }
    ));

}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };