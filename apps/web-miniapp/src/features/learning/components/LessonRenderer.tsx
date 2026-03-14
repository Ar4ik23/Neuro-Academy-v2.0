"use client";

import React from 'react';
import { LessonBlock } from '@neuro-academy/types';

export const LessonRenderer: React.FC<{ blocks: LessonBlock[] }> = ({ blocks }) => {
  return (
    <div className="flex flex-col gap-6 p-5 pb-10">
      {blocks.map((block) => {
        switch (block.type) {
          case 'TEXT':
            return (
              <div key={block.id} className="prose prose-invert max-w-none text-slate-300 leading-relaxed animate-enter">
                {block.content.text}
              </div>
            );
          case 'VIDEO':
            return (
              <div key={block.id} className="relative aspect-video rounded-3xl overflow-hidden glass-card premium-border animate-enter">
                <iframe 
                  src={block.content.url} 
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            );
          case 'IMAGE':
            return (
              <div key={block.id} className="flex flex-col gap-2 animate-enter">
                <img src={block.content.url} alt={block.content.caption} className="rounded-3xl premium-border" />
                {block.content.caption && <p className="text-xs text-slate-500 text-center italic">{block.content.caption}</p>}
              </div>
            );
          case 'QUOTE':
            return (
              <blockquote key={block.id} className="border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-500/5 rounded-r-2xl italic text-lg text-white animate-enter">
                {block.content.text}
              </blockquote>
            );
          case 'CALLOUT':
            return (
              <div key={block.id} className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex gap-4 animate-enter">
                <span className="text-2xl">💡</span>
                <p className="text-sm text-amber-200/80 leading-relaxed font-medium">{block.content.text}</p>
              </div>
            );
          default:
            return <div key={block.id}>Unsupported block type: {block.type}</div>;
        }
      })}
    </div>
  );
};
