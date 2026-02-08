import * as React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-md",
            className
        )}
        {...props}
    />
));
Card.displayName = "Card";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-8", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { Card, CardContent };
