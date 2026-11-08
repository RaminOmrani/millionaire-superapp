CREATE TABLE `consult_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text NOT NULL,
	`phone` text NOT NULL,
	`business_name` text,
	`product` text NOT NULL,
	`message` text,
	`best_time` text,
	`status` text DEFAULT 'new' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
