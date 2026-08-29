import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_cta_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__services_v_version_cta_type" AS ENUM('internal', 'custom');
  CREATE TABLE IF NOT EXISTS "services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_partner_brands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"services_id" integer,
  	"posts_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_version_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_version_partner_brands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"services_id" integer,
  	"posts_id" integer,
  	"projects_id" integer
  );
  
  ALTER TABLE "services" ADD COLUMN "cta_heading" varchar;
  ALTER TABLE "services" ADD COLUMN "cta_subhead" varchar;
  ALTER TABLE "services" ADD COLUMN "cta_type" "enum_services_cta_type" DEFAULT 'internal';
  ALTER TABLE "services" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "services" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "services" ADD COLUMN "cta_new_tab" boolean DEFAULT false;
  ALTER TABLE "_services_v" ADD COLUMN "version_cta_heading" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_cta_subhead" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_cta_type" "enum__services_v_version_cta_type" DEFAULT 'internal';
  ALTER TABLE "_services_v" ADD COLUMN "version_cta_label" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_cta_url" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_cta_new_tab" boolean DEFAULT false;
  DO $$ BEGIN
   ALTER TABLE "services_features" ADD CONSTRAINT "services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services_process_steps" ADD CONSTRAINT "services_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services_partner_brands" ADD CONSTRAINT "services_partner_brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services_partner_brands" ADD CONSTRAINT "services_partner_brands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_services_v_version_features" ADD CONSTRAINT "_services_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_services_v_version_process_steps" ADD CONSTRAINT "_services_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_services_v_version_partner_brands" ADD CONSTRAINT "_services_v_version_partner_brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_services_v_version_partner_brands" ADD CONSTRAINT "_services_v_version_partner_brands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "services_features_order_idx" ON "services_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_features_parent_id_idx" ON "services_features" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_process_steps_order_idx" ON "services_process_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_process_steps_parent_id_idx" ON "services_process_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_partner_brands_order_idx" ON "services_partner_brands" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_partner_brands_parent_id_idx" ON "services_partner_brands" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_partner_brands_logo_idx" ON "services_partner_brands" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "services_rels_pages_id_idx" ON "services_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "services_rels_services_id_idx" ON "services_rels" USING btree ("services_id");
  CREATE INDEX IF NOT EXISTS "services_rels_posts_id_idx" ON "services_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "services_rels_projects_id_idx" ON "services_rels" USING btree ("projects_id");
  CREATE INDEX IF NOT EXISTS "_services_v_version_features_order_idx" ON "_services_v_version_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_version_features_parent_id_idx" ON "_services_v_version_features" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_version_process_steps_order_idx" ON "_services_v_version_process_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_version_process_steps_parent_id_idx" ON "_services_v_version_process_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_version_partner_brands_order_idx" ON "_services_v_version_partner_brands" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_version_partner_brands_parent_id_idx" ON "_services_v_version_partner_brands" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_version_partner_brands_logo_idx" ON "_services_v_version_partner_brands" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_services_v_rels_pages_id_idx" ON "_services_v_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "_services_v_rels_services_id_idx" ON "_services_v_rels" USING btree ("services_id");
  CREATE INDEX IF NOT EXISTS "_services_v_rels_posts_id_idx" ON "_services_v_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "_services_v_rels_projects_id_idx" ON "_services_v_rels" USING btree ("projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "services_features" CASCADE;
  DROP TABLE "services_process_steps" CASCADE;
  DROP TABLE "services_partner_brands" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "_services_v_version_features" CASCADE;
  DROP TABLE "_services_v_version_process_steps" CASCADE;
  DROP TABLE "_services_v_version_partner_brands" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_heading";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_subhead";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_type";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_label";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_url";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_new_tab";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_cta_heading";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_cta_subhead";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_cta_type";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_cta_label";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_cta_url";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_cta_new_tab";
  DROP TYPE "public"."enum_services_cta_type";
  DROP TYPE "public"."enum__services_v_version_cta_type";`)
}
