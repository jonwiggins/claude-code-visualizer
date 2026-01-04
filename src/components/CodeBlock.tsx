import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  language?: string;
  maxHeight?: string;
}

export function CodeBlock({ code, language = 'json', maxHeight }: CodeBlockProps) {
  return (
    <Highlight theme={themes.nightOwl} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} text-[13px] leading-relaxed p-4 rounded-lg overflow-x-auto`}
          style={{
            ...style,
            background: '#161b22',
            maxHeight: maxHeight,
            overflowY: maxHeight ? 'auto' : undefined,
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="whitespace-pre">
              <span className="inline-block w-10 text-[#484f58] select-none text-right pr-4">
                {i + 1}
              </span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
