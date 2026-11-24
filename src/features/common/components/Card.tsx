import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
}

export default function Card({ children }: CardProps) {

    return (
        <div className="w-full rounded-card border border-border bg-surface p-6">
            {children}
        </div>
    );
}