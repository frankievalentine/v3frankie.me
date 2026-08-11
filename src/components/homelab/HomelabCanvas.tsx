import "@xyflow/react/dist/style.css";
import {
	ReactFlow,
	useReactFlow,
	type Edge,
	type Node,
} from "@xyflow/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	homelabCanvasConnectors,
	homelabCanvasNodes,
} from "../../data/homelab-canvas";
import HomelabNode from "./HomelabNode";

const nodeTypes = {
	homelabNode: HomelabNode,
};

const edgeColorLight = "#9ca3af";
const edgeColorDark = "#6b7280";

function getSiteColorScheme() {
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function FitViewOnMount() {
	const { fitView } = useReactFlow();

	useEffect(() => {
		const id = requestAnimationFrame(() => {
			fitView({ padding: 0.2, maxZoom: 1.5 });
		});
		return () => cancelAnimationFrame(id);
	}, [fitView]);

	return null;
}

function CanvasControls() {
	const { zoomIn, zoomOut, fitView } = useReactFlow();
	return (
		<fieldset className="homelab-canvas-controls">
			<legend className="sr-only">Canvas zoom controls</legend>
			<button
				type="button"
				aria-label="Zoom out"
				onClick={() => zoomOut()}
			>
				-
			</button>
			<button type="button" aria-label="Fit diagram" onClick={() => fitView({ padding: 0.2, maxZoom: 1.5 })}>
				Fit
			</button>
			<button type="button" aria-label="Zoom in" onClick={() => zoomIn()}>
				+
			</button>
		</fieldset>
	);
}

export default function HomelabCanvas() {
	const [colorScheme, setColorScheme] = useState<"dark" | "light">("dark");
	const reactFlowRef = useRef<HTMLDivElement>(null);

	const nodes = useMemo<Node[]>(
		() =>
			homelabCanvasNodes.map((node) => ({
				id: node.id,
				type: "homelabNode",
				position: { x: node.x, y: node.y },
				style: { width: node.width, height: node.height },
				data: { kind: node.kind, label: node.label },
				draggable: false,
				selectable: false,
				deletable: false,
			})),
		[],
	);

	const edges = useMemo<Edge[]>(
		() =>
			homelabCanvasConnectors.map((conn) => ({
				id: conn.id,
				source: conn.source,
				target: conn.target,
				sourceHandle: conn.sourceHandle,
				targetHandle: conn.targetHandle,
				label: conn.label,
				animated: conn.animated ?? false,
				type: conn.type ?? "default",
				pathOptions: conn.pathOptions,
				style: {
					stroke:
						colorScheme === "dark" ? edgeColorDark : edgeColorLight,
					strokeWidth: 1.5,
				},
				labelStyle: {
					fill:
						colorScheme === "dark" ? edgeColorDark : edgeColorLight,
					fontSize: 10,
					fontFamily:
						'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
				},
				markerEnd: {
					type: "arrowclosed" as const,
					width: 10,
					height: 10,
					color:
						colorScheme === "dark" ? edgeColorDark : edgeColorLight,
				},
			})),
		[colorScheme],
	);

	useEffect(() => {
		setColorScheme(getSiteColorScheme());

		const observer = new MutationObserver(() => {
			setColorScheme(getSiteColorScheme());
		});

		observer.observe(document.documentElement, {
			attributeFilter: ["class"],
			attributes: true,
		});

		return () => observer.disconnect();
	}, []);

	return (
		<section
			ref={reactFlowRef}
			className="homelab-canvas-shell"
			aria-label="Homelab topology canvas"
		>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={false}
				panOnDrag
				zoomOnScroll
				zoomOnPinch
				minZoom={0.3}
				maxZoom={2}
				proOptions={{ hideAttribution: true }}
			>
				<FitViewOnMount />
				<CanvasControls />
			</ReactFlow>
		</section>
	);
}
