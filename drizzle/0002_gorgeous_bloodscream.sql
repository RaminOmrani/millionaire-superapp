CREATE TABLE `banners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`subtitle` text,
	`cta_label` text,
	`href` text,
	`theme` text DEFAULT 'brand' NOT NULL,
	`image` text,
	`placement` text DEFAULT 'top' NOT NULL,
	`audience` text DEFAULT 'both' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`starts_at` integer,
	`ends_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
