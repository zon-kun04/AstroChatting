import { cn } from '@/lib/utils';import { jsx as _jsx } from "react/jsx-runtime";

function Skeleton({ className, ...props }) {
  return (
    _jsx("div", {
      "data-slot": "skeleton",
      className: cn('bg-accent animate-pulse rounded-md', className), ...
      props }
    ));

}

export { Skeleton };