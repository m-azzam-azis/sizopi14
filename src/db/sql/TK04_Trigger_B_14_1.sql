CREATE OR REPLACE FUNCTION check_duplicate_username()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM PENGGUNA WHERE username = NEW.username AND username != COALESCE(OLD.username, '')) THEN
        RAISE EXCEPTION 'ERROR: Username "%" sudah digunakan, silakan pilih username lain.', NEW.username;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_duplicate_username
BEFORE INSERT OR UPDATE ON PENGGUNA
FOR EACH ROW EXECUTE FUNCTION check_duplicate_username();

CREATE OR REPLACE FUNCTION verify_login(input_username VARCHAR, input_password VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM PENGGUNA 
        WHERE username = input_username 
        AND password = input_password
    ) INTO user_exists;
    
    IF NOT user_exists THEN
        RAISE EXCEPTION 'Username atau password salah, silakan coba lagi.';
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;