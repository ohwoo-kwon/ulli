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
            INSERT INTO public.profiles (profile_id, name,)
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


