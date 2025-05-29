CREATE TABLE IF NOT EXISTS login_attempts (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success BOOLEAN NOT NULL
);

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

CREATE OR REPLACE PROCEDURE verify_login_proc(
    IN input_username VARCHAR,
    IN input_password VARCHAR,
    INOUT login_success BOOLEAN DEFAULT FALSE
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM PENGGUNA 
        WHERE username = input_username 
        AND password = input_password
    ) INTO login_success;
    
    INSERT INTO LOGIN_ATTEMPTS (username, password, success)
    VALUES (input_username, input_password, login_success);
    
    IF NOT login_success THEN
        RAISE EXCEPTION 'Username atau password salah, silakan coba lagi.';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION login_validation_func()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM PENGGUNA 
        WHERE username = NEW.username 
        AND password = NEW.password
    ) THEN
        NEW.success := FALSE;
        RAISE EXCEPTION 'Username atau password salah, silakan coba lagi.';
    ELSE
        NEW.success := TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_login_validation
BEFORE INSERT ON LOGIN_ATTEMPTS
FOR EACH ROW EXECUTE FUNCTION login_validation_func();