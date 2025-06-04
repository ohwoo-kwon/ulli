CREATE TYPE "public"."image_type" AS ENUM('USER', 'PRODUCT', 'RESULT');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('M', 'F', 'U');--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('TOP', 'BOTTOM', 'OUTER', 'DRESS', 'SHOES', 'BAG', 'ACCESSORY', 'INNERWEAR', 'SPORTSWEAR', 'SLEEPWEAR', 'ETC');--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"image_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "images_image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profileId" uuid,
	"type" "image_type" NOT NULL,
	"url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"product_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"brand" text NOT NULL,
	"category" "product_category" NOT NULL,
	"gender" "gender",
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_profileId_profiles_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;

CREATE OR REPLACE FUNCTION handle_sign_up()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET SEARCH_PATH = ''
AS $$
BEGIN
    IF new.raw_app_meta_data IS NOT NULL AND new.raw_app_meta_data ? 'provider' THEN
        IF new.raw_app_meta_data ->> 'provider' = 'email' OR new.raw_app_meta_data ->> 'provider' = 'phone' THEN
            IF new.raw_user_meta_data ? 'name' THEN
                INSERT INTO public.profiles (profile_id, name)
                VALUES (new.id, new.raw_user_meta_data ->> 'name');
            ELSE
                INSERT INTO public.profiles (profile_id, name)
                VALUES (new.id, 'Anonymous');
            END IF;
        ELSE
            INSERT INTO public.profiles (profile_id, name)
            VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER handle_sign_up
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_sign_up();