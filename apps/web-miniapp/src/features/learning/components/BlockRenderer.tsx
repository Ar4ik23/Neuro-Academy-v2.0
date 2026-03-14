import React from 'react';

interface BlockProps {
  type: string;
  content: any;
}

const TextBlock = ({ content }: { content: any }) => (
  <div className="prose dark:prose-invert max-w-none my-4">
    {content.text}
  </div>
);

const VideoBlock = ({ content }: { content: any }) => (
  <div className="aspect-video w-full my-6 bg-black flex items-center justify-center rounded-lg overflow-hidden">
    {/* Placeholder for real player */}
    <span className="text-white">Video: {content.url}</span>
  </div>
);

const QuoteBlock = ({ content }: { content: any }) => (
  <blockquote className="border-l-4 border-primary pl-4 italic my-6">
    {content.text}
    {content.author && <footer className="mt-2 text-sm">— {content.author}</footer>}
  </blockquote>
);

export const BlockRenderer: React.FC<BlockProps> = ({ type, content }) => {
  switch (type.toLowerCase()) {
    case 'text':
      return <TextBlock content={content} />;
    case 'video':
      return <VideoBlock content={content} />;
    case 'quote':
      return <QuoteBlock content={content} />;
    default:
      return <div className="p-4 bg-muted my-2 rounded">Unsupported block type: {type}</div>;
  }
};
