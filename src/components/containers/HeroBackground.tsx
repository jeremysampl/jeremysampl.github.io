import React from 'react';

type CodeBlock = {
	id: string;
	filename: string;
	lines: { tokens: { type: string; text: string }[] }[];
	style: React.CSSProperties;
	duration: string;
	delay: string;
};

const CODE_BLOCKS: CodeBlock[] = [
	{
		id: 'typescript',
		filename: 'api.ts',
		duration: '26s',
		delay: '0s',
		style: { top: '7%', left: '17%', '--rotate': '-6deg' } as React.CSSProperties,
		lines: [
			{
				tokens: [
					{ type: 'keyword', text: 'async' },
					{ type: 'plain', text: ' ' },
					{ type: 'keyword', text: 'function' },
					{ type: 'plain', text: ' ' },
					{ type: 'fn', text: 'fetchUser' },
					{ type: 'plain', text: '(' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '  id: ' },
					{ type: 'type', text: 'string' },
					{ type: 'plain', text: ',' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '): ' },
					{ type: 'type', text: 'Promise' },
					{ type: 'plain', text: '<' },
					{ type: 'type', text: 'User' },
					{ type: 'plain', text: '> {' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '  ' },
					{ type: 'keyword', text: 'return' },
					{ type: 'plain', text: ' ' },
					{ type: 'fn', text: 'api' },
					{ type: 'plain', text: '.get(id);' },
				],
			},
			{ tokens: [{ type: 'plain', text: '}' }] },
		],
	},
	{
		id: 'react',
		filename: 'App.tsx',
		duration: '28s',
		delay: '-8s',
		style: { top: '12%', right: '4%', '--rotate': '5deg' } as React.CSSProperties,
		lines: [
			{
				tokens: [
					{ type: 'keyword', text: 'export' },
					{ type: 'plain', text: ' ' },
					{ type: 'keyword', text: 'function' },
					{ type: 'plain', text: ' ' },
					{ type: 'fn', text: 'App' },
					{ type: 'plain', text: '() {' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '  ' },
					{ type: 'keyword', text: 'return' },
					{ type: 'plain', text: ' <' },
					{ type: 'type', text: 'Portfolio' },
					{ type: 'plain', text: ' />;' },
				],
			},
			{ tokens: [{ type: 'plain', text: '}' }] },
		],
	},
	{
		id: 'python',
		filename: 'views.py',
		duration: '30s',
		delay: '-14s',
		style: { bottom: '14%', left: '4%', '--rotate': '4deg' } as React.CSSProperties,
		lines: [
			{
				tokens: [
					{ type: 'keyword', text: 'from' },
					{ type: 'plain', text: ' django.http ' },
					{ type: 'keyword', text: 'import' },
					{ type: 'plain', text: ' ' },
					{ type: 'type', text: 'JsonResponse' },
				],
			},
			{
				tokens: [
					{ type: 'keyword', text: 'def' },
					{ type: 'plain', text: ' ' },
					{ type: 'fn', text: 'health' },
					{ type: 'plain', text: '(request):' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '    ' },
					{ type: 'keyword', text: 'return' },
					{ type: 'plain', text: ' ' },
					{ type: 'fn', text: 'JsonResponse' },
					{ type: 'plain', text: '({' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '        ' },
					{ type: 'string', text: '"ok"' },
					{ type: 'plain', text: ': ' },
					{ type: 'keyword', text: 'True' },
					{ type: 'plain', text: ',' },
				],
			},
			{ tokens: [{ type: 'plain', text: '    })' }] },
		],
	},
	{
		id: 'postgres',
		filename: 'schema.sql',
		duration: '27s',
		delay: '-5s',
		style: { bottom: '10%', right: '5%', '--rotate': '-4deg' } as React.CSSProperties,
		lines: [
			{
				tokens: [
					{ type: 'keyword', text: 'SELECT' },
					{ type: 'plain', text: ' id, name' },
				],
			},
			{
				tokens: [
					{ type: 'keyword', text: 'FROM' },
					{ type: 'plain', text: ' projects' },
				],
			},
			{
				tokens: [
					{ type: 'keyword', text: 'WHERE' },
					{ type: 'plain', text: ' stack ' },
					{ type: 'keyword', text: '@>' },
					{ type: 'plain', text: ' ' },
					{ type: 'string', text: "'{react}'" },
					{ type: 'plain', text: ';' },
				],
			},
		],
	},
	{
		id: 'docker',
		filename: 'Dockerfile',
		duration: '29s',
		delay: '-11s',
		style: { top: '38%', left: '1%', '--rotate': '-3deg' } as React.CSSProperties,
		lines: [
			{
				tokens: [
					{ type: 'keyword', text: 'FROM' },
					{ type: 'plain', text: ' node:24-alpine' },
				],
			},
			{
				tokens: [
					{ type: 'keyword', text: 'WORKDIR' },
					{ type: 'plain', text: ' /app' },
				],
			},
			{
				tokens: [
					{ type: 'keyword', text: 'COPY' },
					{ type: 'plain', text: ' . .' },
				],
			},
			{
				tokens: [
					{ type: 'keyword', text: 'RUN' },
					{ type: 'plain', text: ' npm ci && npm run build' },
				],
			},
			{
				tokens: [
					{ type: 'keyword', text: 'CMD' },
					{ type: 'plain', text: ' [' },
					{ type: 'string', text: '"npm"' },
					{ type: 'plain', text: ', ' },
					{ type: 'string', text: '"start"' },
					{ type: 'plain', text: ']' },
				],
			},
		],
	},
	{
		id: 'nodejs',
		filename: 'server.js',
		duration: '25s',
		delay: '-17s',
		style: { top: '36%', right: '2%', '--rotate': '3deg' } as React.CSSProperties,
		lines: [
			{
				tokens: [
					{ type: 'keyword', text: 'const' },
					{ type: 'plain', text: ' app = ' },
					{ type: 'fn', text: 'express' },
					{ type: 'plain', text: '();' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: 'app.' },
					{ type: 'fn', text: 'get' },
					{ type: 'plain', text: '(' },
					{ type: 'string', text: "'/api'" },
					{ type: 'plain', text: ', (req, res) => {' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '  res.' },
					{ type: 'fn', text: 'json' },
					{ type: 'plain', text: '({ ok: ' },
					{ type: 'keyword', text: 'true' },
					{ type: 'plain', text: ' });' },
				],
			},
			{ tokens: [{ type: 'plain', text: '});' }] },
		],
	},
	{
		id: 'redis',
		filename: 'cache.py',
		duration: '31s',
		delay: '-20s',
		style: { top: '58%', right: '18%', '--rotate': '-5deg' } as React.CSSProperties,
		lines: [
			{
				tokens: [
					{ type: 'plain', text: 'redis.' },
					{ type: 'fn', text: 'setex' },
					{ type: 'plain', text: '(' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '    ' },
					{ type: 'string', text: '"session:42"' },
					{ type: 'plain', text: ',' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '    3600,' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '    user.' },
					{ type: 'fn', text: 'to_json' },
					{ type: 'plain', text: '()' },
				],
			},
			{ tokens: [{ type: 'plain', text: ')' }] },
		],
	},
	{
		id: 'nextjs',
		filename: 'page.tsx',
		duration: '24s',
		delay: '-3s',
		style: { top: '82%', left: '36%', '--rotate': '6deg' } as React.CSSProperties,
		lines: [
			{
				tokens: [
					{ type: 'keyword', text: 'export' },
					{ type: 'plain', text: ' ' },
					{ type: 'keyword', text: 'default' },
					{ type: 'plain', text: ' ' },
					{ type: 'keyword', text: 'async' },
					{ type: 'plain', text: ' ' },
					{ type: 'keyword', text: 'function' },
				],
			},
			{
				tokens: [
					{ type: 'fn', text: 'Page' },
					{ type: 'plain', text: '() {' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '  ' },
					{ type: 'keyword', text: 'const' },
					{ type: 'plain', text: ' data = ' },
					{ type: 'keyword', text: 'await' },
					{ type: 'plain', text: ' ' },
					{ type: 'fn', text: 'getData' },
					{ type: 'plain', text: '();' },
				],
			},
			{
				tokens: [
					{ type: 'plain', text: '  ' },
					{ type: 'keyword', text: 'return' },
					{ type: 'plain', text: ' <' },
					{ type: 'type', text: 'View' },
					{ type: 'plain', text: ' {...data} />;' },
				],
			},
			{ tokens: [{ type: 'plain', text: '}' }] },
		],
	},
	{
		id: 'shell',
		filename: 'bash',
		duration: '23s',
		delay: '-12s',
		style: { top: '6%', left: '52%', '--rotate': '-2deg' } as React.CSSProperties,
		lines: [
			{
				tokens: [{ type: 'comment', text: '$ git push origin main' }],
			},
			{
				tokens: [{ type: 'comment', text: '$ docker compose up -d' }],
			},
			{
				tokens: [
					{ type: 'fn', text: '✓' },
					{ type: 'plain', text: ' api  redis  postgres' },
				],
			},
			{
				tokens: [{ type: 'comment', text: '$ npm run build' }],
			},
		],
	},
];

export default function HeroBackground() {
	return (
		<div className="hero-bg" aria-hidden="true">
			<div className="hero-bg__gradient" />
			<div className="hero-bg__grid" />
			<div className="hero-bg__glow hero-bg__glow--one" />
			<div className="hero-bg__glow hero-bg__glow--two" />
			<div className="hero-bg__glow hero-bg__glow--three" />

			<div className="hero-bg__watermark hero-bg__watermark--braces">{'{ }'}</div>
			<div className="hero-bg__watermark hero-bg__watermark--tag">{'</>'}</div>

			<div className="hero-bg__particles">
				{Array.from({ length: 22 }, (_, i) => (
					<span key={i} className={`hero-bg__particle hero-bg__particle--${i + 1}`} />
				))}
			</div>

			<div className="hero-bg__blocks">
				{CODE_BLOCKS.map((block) => (
					<div
						key={block.id}
						className={`hero-bg__block hero-bg__block--${block.id}`}
						style={{
							...block.style,
							animationDuration: block.duration,
							animationDelay: block.delay,
						}}
					>
						<div className="hero-bg__block-chrome">
							<span className="hero-bg__dot hero-bg__dot--red" />
							<span className="hero-bg__dot hero-bg__dot--yellow" />
							<span className="hero-bg__dot hero-bg__dot--green" />
							<span className="hero-bg__filename">{block.filename}</span>
						</div>
						<pre className="hero-bg__code">
							{block.lines.map((line, li) => (
								<code key={li} className="hero-bg__line">
									{line.tokens.map((token, ti) => (
										<span key={ti} className={`tok tok--${token.type}`}>
											{token.text}
										</span>
									))}
								</code>
							))}
						</pre>
					</div>
				))}
			</div>

			<div className="hero-bg__vignette" />
		</div>
	);
}
