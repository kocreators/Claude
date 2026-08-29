import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_nav_items_sub_items" ALTER COLUMN "link_label" DROP NOT NULL;
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_label" DROP NOT NULL;
  ALTER TABLE "header" ALTER COLUMN "quote_cta_label" DROP NOT NULL;
  ALTER TABLE "footer_columns_links" ALTER COLUMN "link_label" DROP NOT NULL;
  ALTER TABLE "pages_blocks_company_stores" ADD COLUMN "store_mockup_mobile_image_id" integer;
  ALTER TABLE "_pages_v_blocks_company_stores" ADD COLUMN "store_mockup_mobile_image_id" integer;
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_company_stores" ADD CONSTRAINT "pages_blocks_company_stores_store_mockup_mobile_image_id_media_id_fk" FOREIGN KEY ("store_mockup_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_company_stores" ADD CONSTRAINT "_pages_v_blocks_company_stores_store_mockup_mobile_image_id_media_id_fk" FOREIGN KEY ("store_mockup_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_blocks_company_stores_store_mockup_mobile_image_idx" ON "pages_blocks_company_stores" USING btree ("store_mockup_mobile_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_company_stores_store_mockup_mobile_image_idx" ON "_pages_v_blocks_company_stores" USING btree ("store_mockup_mobile_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_company_stores" DROP CONSTRAINT "pages_blocks_company_stores_store_mockup_mobile_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_company_stores" DROP CONSTRAINT "_pages_v_blocks_company_stores_store_mockup_mobile_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "pages_blocks_company_stores_store_mockup_mobile_image_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_company_stores_store_mockup_mobile_image_idx";
  ALTER TABLE "header_nav_items_sub_items" ALTER COLUMN "link_label" SET NOT NULL;
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_label" SET NOT NULL;
  ALTER TABLE "header" ALTER COLUMN "quote_cta_label" SET NOT NULL;
  ALTER TABLE "footer_columns_links" ALTER COLUMN "link_label" SET NOT NULL;
  ALTER TABLE "pages_blocks_company_stores" DROP COLUMN IF EXISTS "store_mockup_mobile_image_id";
  ALTER TABLE "_pages_v_blocks_company_stores" DROP COLUMN IF EXISTS "store_mockup_mobile_image_id";`)
}
