export type HomelabCanvasNodeKind =
	| "app"
	| "control"
	| "device"
	| "header"
	| "network"
	| "note"
	| "security"
	| "storage"
	| "title";

export interface HomelabCanvasNode {
	id: string;
	kind: HomelabCanvasNodeKind;
	label: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface HomelabCanvasConnector {
	id: string;
	source: string;
	target: string;
	label?: string;
	animated?: boolean;
	type?: "default" | "smoothstep";
	sourceHandle?: string;
	targetHandle?: string;
	pathOptions?: {
		borderRadius?: number;
		offset?: number;
		stepPosition?: number;
	};
}

export const homelabCanvasNodes: HomelabCanvasNode[] = [
	{
		id: "title",
		kind: "title",
		label:
			"Homelab architecture map\nTraffic flows left to right. Storage and durable state live on the far right.",
		x: 20,
		y: 0,
		width: 1060,
		height: 64,
	},
	{
		id: "header-network",
		kind: "header",
		label: "Network + access",
		x: 45,
		y: 112,
		width: 190,
		height: 42,
	},
	{
		id: "header-compute",
		kind: "header",
		label: "Compute + control",
		x: 325,
		y: 112,
		width: 190,
		height: 42,
	},
	{
		id: "header-apps",
		kind: "header",
		label: "Applications",
		x: 605,
		y: 112,
		width: 190,
		height: 42,
	},
	{
		id: "header-storage",
		kind: "header",
		label: "Storage",
		x: 875,
		y: 112,
		width: 190,
		height: 42,
	},
	{
		id: "clients",
		kind: "network",
		label: "Home clients\nSystems + IoT",
		x: 20,
		y: 180,
		width: 240,
		height: 58,
	},
	{
		id: "ap-downstairs",
		kind: "device",
		label: "UniFi U7 Pro (Downstairs)",
		x: 10,
		y: 355,
		width: 120,
		height: 66,
	},
	{
		id: "ap-upstairs",
		kind: "device",
		label: "UniFi U7 Lite (Upstairs)",
		x: 150,
		y: 355,
		width: 120,
		height: 66,
	},
	{
		id: "switching-firewall",
		kind: "network",
		label: "UniFi Gateway Max\nZyxel 8-Port 2.5Gb PoE Switch",
		x: 20,
		y: 260,
		width: 240,
		height: 72,
	},
	{
		id: "dns-host",
		kind: "device",
		label: "Raspberry Pi 5 with a PoE Hat",
		x: 20,
		y: 445,
		width: 240,
		height: 58,
	},
	{
		id: "dns-stack",
		kind: "security",
		label: "AdGuard + Unbound\nfiltered local DNS",
		x: 10,
		y: 530,
		width: 125,
		height: 66,
	},
	{
		id: "tailscale",
		kind: "security",
		label: "Tailscale\nprivate admin access",
		x: 150,
		y: 530,
		width: 120,
		height: 66,
	},
	{
		id: "pve1",
		kind: "note",
		label: "pve1\nJonsbo C6\nRyzen 7 1700X\n32GB DDR4\nNVMe for OS, LXCs, VMs",
		x: 330,
		y: 180,
		width: 180,
		height: 110,
	},
	{
		id: "proxmox",
		kind: "control",
		label: "Proxmox\nvirtualization layer",
		x: 330,
		y: 320,
		width: 180,
		height: 58,
	},
	{
		id: "traefik",
		kind: "control",
		label: "Traefik\ninternal ingress",
		x: 315,
		y: 430,
		width: 95,
		height: 58,
	},
	{
		id: "komodo",
		kind: "control",
		label: "Komodo\nservice control",
		x: 425,
		y: 430,
		width: 95,
		height: 58,
	},
	{
		id: "homepage",
		kind: "app",
		label: "Homepage\nservice dashboard",
		x: 620,
		y: 175,
		width: 160,
		height: 58,
	},
	{
		id: "servarr",
		kind: "app",
		label: "Servarr\nmedia automation",
		x: 620,
		y: 255,
		width: 160,
		height: 58,
	},
	{
		id: "home-assistant",
		kind: "app",
		label: "Home Assistant\nhouse automation",
		x: 620,
		y: 335,
		width: 160,
		height: 58,
	},
	{
		id: "support",
		kind: "app",
		label: "RustDesk / Forgejo\nremote support + code",
		x: 620,
		y: 415,
		width: 160,
		height: 58,
	},
	{
		id: "sync",
		kind: "app",
		label: "Syncthing\nfile synchronization",
		x: 620,
		y: 495,
		width: 160,
		height: 58,
	},
	{
		id: "nas",
		kind: "note",
		label: "TrueNAS\nRyzen 5 5500G\n64GB DDR4\n16TB WD Red Pro",
		x: 890,
		y: 190,
		width: 160,
		height: 98,
	},
	{
		id: "shares",
		kind: "storage",
		label: "Shares + datasets\nbulk and app storage",
		x: 890,
		y: 330,
		width: 160,
		height: 58,
	},
	{
		id: "protection",
		kind: "storage",
		label: "Protection\nsnapshots + rebuild path",
		x: 890,
		y: 430,
		width: 160,
		height: 58,
	},
];

export const homelabCanvasConnectors: HomelabCanvasConnector[] = [
	// Static structural edges
	{
		id: "clients-to-switching-firewall",
		source: "clients",
		target: "switching-firewall",
	},
	{
		id: "switching-firewall-to-ap-downstairs",
		source: "switching-firewall",
		target: "ap-downstairs",
	},
	{
		id: "switching-firewall-to-ap-upstairs",
		source: "switching-firewall",
		target: "ap-upstairs",
	},
	{
		id: "switching-firewall-to-dns-host",
		source: "switching-firewall",
		target: "dns-host",
	},
	{
		id: "dns-host-to-dns-stack",
		source: "dns-host",
		target: "dns-stack",
	},
	{
		id: "dns-host-to-tailscale",
		source: "dns-host",
		target: "tailscale",
	},
	{ id: "pve1-to-proxmox", source: "pve1", target: "proxmox" },
	{ id: "proxmox-to-traefik", source: "proxmox", target: "traefik" },
	{ id: "proxmox-to-komodo", source: "proxmox", target: "komodo" },
	{ id: "nas-to-shares", source: "nas", target: "shares" },
	{
		id: "shares-to-protection",
		source: "shares",
		target: "protection",
	},

	// Animated relationship edges
	{
		id: "adguard-to-pve1",
		source: "dns-stack",
		target: "pve1",
		animated: true,
		type: "smoothstep",
		sourceHandle: "right",
		targetHandle: "left",
		pathOptions: {
			borderRadius: 8,
			offset: 20,
			stepPosition: 0.9,
		},
	},
	{
		id: "adguard-to-nas",
		source: "dns-stack",
		target: "nas",
		animated: true,
	},
	{
		id: "tailscale-to-pve1",
		source: "tailscale",
		target: "pve1",
		animated: true,
		type: "smoothstep",
		sourceHandle: "right",
		targetHandle: "left",
		pathOptions: {
			borderRadius: 8,
			offset: 20,
			stepPosition: 0.5,
		},
	},
	{
		id: "tailscale-to-nas",
		source: "tailscale",
		target: "nas",
		animated: true,
	},
	{
		id: "traefik-to-apps",
		source: "traefik",
		target: "header-apps",
		label: "routes",
		animated: true,
	},
	{
		id: "komodo-to-apps",
		source: "komodo",
		target: "sync",
		label: "deploys",
		animated: true,
	},
	{
		id: "apps-to-shares",
		source: "servarr",
		target: "shares",
		label: "data",
		animated: true,
	},
];
