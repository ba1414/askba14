import React from "react";

export const AppleEmoji = ({ emoji, className = "w-5 h-5" }: { emoji: string, className?: string }) => (
  <img 
    src={`https://emojicdn.elk.sh/${emoji}?style=apple`} 
    alt={emoji} 
    className={`inline-block select-none pointer-events-none ${className}`} 
    loading="lazy"
  />
);
