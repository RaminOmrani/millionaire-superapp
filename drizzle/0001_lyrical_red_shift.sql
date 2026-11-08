CREATE TABLE `login_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ip` text NOT NULL,
	`username` text NOT NULL,
	`success` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_content` (
	`slug` text PRIMARY KEY NOT NULL,
	`status` text,
	`description` text,
	`website` text,
	`version` text,
	`features` text,
	`actions` text,
	`plans` text,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
