import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg",
                outline:
                    "border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black",
                ghost: "hover:bg-white/10 text-white",
            },
            size: {
                default: "h-11 px-6 py-2",
                lg: "h-14 px-10 text-lg",
                sm: "h-9 px-4",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
