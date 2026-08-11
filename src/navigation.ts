export type SidebarIconName =
	| "home"
	| "layers"
	| "file"
	| "camera"
	| "mail"
	| "wrench"
	| "server";

type ActiveMatch = "exact" | "prefix";

export interface SidebarNavItem {
	label: string;
	href: string;
	match?: ActiveMatch;
	icon?: SidebarIconName;
	children?: SidebarNavItem[];
	collapsible?: boolean;
}

const pageChild = (href: string, label: string): SidebarNavItem => ({
	label,
	href,
});

const homelabSection = (
	slug: string,
	label: string,
	options?: { extraChildren?: SidebarNavItem[] },
): SidebarNavItem => {
	const href = `/homelab/${slug}`;
	const children = options?.extraChildren?.length
		? options.extraChildren
		: undefined;

	return {
		label,
		href,
		match: "prefix",
		children,
	};
};

export const sidebarNavigation: SidebarNavItem[] = [
	{
		label: "About",
		href: "/",
		icon: "home",
	},
	{
		label: "Projects",
		href: "/projects",
		icon: "layers",
		match: "prefix",
	},
	{
		label: "Posts",
		href: "/posts",
		icon: "file",
		match: "prefix",
	},
	{
		label: "Photography",
		href: "/photography",
		icon: "camera",
	},
	{
		label: "Newsletter",
		href: "/newsletter",
		icon: "mail",
	},
	{
		label: "Uses",
		href: "/uses",
		icon: "wrench",
	},
	{
		label: "Homelab",
		href: "/homelab",
		icon: "server",
		match: "prefix",
		collapsible: true,
		children: [
			homelabSection("proxmox", "Proxmox", {
				extraChildren: [
					pageChild("/homelab/proxmox/lxc", "LXC/VM"),
					pageChild("/homelab/proxmox/traefik", "Traefik"),
				],
			}),
			homelabSection("truenas", "TrueNAS"),
			homelabSection("home-assistant", "Home Assistant"),
			homelabSection("adguard", "AdGuard"),
			homelabSection("network", "Network"),
			homelabSection("services", "Services"),
			homelabSection("servarr", "Servarr"),
		],
	},
];

export const isNavItemCurrent = (item: SidebarNavItem, currentPage: string) =>
	item.href === currentPage;

export const isNavItemActive = (item: SidebarNavItem, currentPage: string) => {
	const match = item.match ?? "exact";

	if (match === "prefix") {
		return currentPage === item.href || currentPage.startsWith(`${item.href}/`);
	}

	return currentPage === item.href;
};

export const getSidebarSubtreeId = (href: string) =>
	`sidebar-subtree-${href.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;
