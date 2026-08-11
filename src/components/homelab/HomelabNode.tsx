import { Handle, Position } from "@xyflow/react";
import { memo } from "react";

interface NodeData {
	kind: string;
	label: string;
}

const kindClasses: Record<string, string> = {
	title:
		"text-foreground border-border bg-transparent font-medium text-sm",
	header:
		"text-green-600 border-green-600/40 bg-green-50 dark:bg-green-950/30 font-medium",
	control:
		"text-blue-600 border-blue-600/40 bg-blue-50 dark:bg-blue-950/30",
	security:
		"text-green-600 border-green-600/40 bg-green-50 dark:bg-green-950/30",
	app: "text-violet-600 border-violet-600/40 bg-violet-50 dark:bg-violet-950/30",
	storage:
		"text-orange-600 border-orange-600/40 bg-orange-50 dark:bg-orange-950/30",
	network:
		"text-sky-600 border-sky-600/40 bg-sky-50 dark:bg-sky-950/30",
	device:
		"text-muted-foreground border-border bg-transparent",
	note: "text-muted-foreground border-border bg-transparent",
};

function HomelabNode({ data }: { data: NodeData }) {
	const { kind, label } = data;
	const classes = kindClasses[kind] ?? kindClasses.note;

	return (
		<div className={`w-full h-full ${classes}`}>
			{/* Hidden handles on all sides for flexible edge routing */}
			<Handle
				type="target"
				position={Position.Top}
				className="!opacity-0"
			/>
			<Handle
				id="left"
				type="target"
				position={Position.Left}
				className="!opacity-0"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				className="!opacity-0"
			/>
			<Handle
				id="right"
				type="source"
				position={Position.Right}
				className="!opacity-0"
			/>
			<div className="flex h-full w-full items-center justify-center rounded-md border px-2 text-center text-xs font-mono whitespace-pre-line leading-tight">
				{label}
			</div>
		</div>
	);
}

export default memo(HomelabNode);
