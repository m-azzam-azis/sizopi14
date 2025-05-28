CREATE OR REPLACE FUNCTION check_attraction_capacity()
RETURNS TRIGGER AS $$
DECLARE
    capacity_max INT;
    tickets_sold INT;
    remaining_capacity INT;
BEGIN
    SELECT 
        f.kapasitas_max,
        COALESCE(SUM(r.jumlah_tiket) FILTER (WHERE r.status = 'Aktif' AND r.tanggal_kunjungan::date = NEW.tanggal_kunjungan::date), 0)
    INTO 
        capacity_max, tickets_sold
    FROM FASILITAS f
    LEFT JOIN RESERVASI r ON f.nama = r.nama_fasilitas 
    WHERE f.nama = NEW.nama_fasilitas
    GROUP BY f.kapasitas_max;
    
    remaining_capacity := capacity_max - tickets_sold;
    
    IF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'Aktif' AND OLD.nama_fasilitas = NEW.nama_fasilitas AND OLD.tanggal_kunjungan::date = NEW.tanggal_kunjungan::date THEN
            remaining_capacity := remaining_capacity + OLD.jumlah_tiket;
        END IF;
    END IF;
    
    IF NEW.jumlah_tiket > remaining_capacity THEN
        RAISE EXCEPTION 'ERROR: Kapasitas tersisa "%" tiket, atraksi tidak mencukupi untuk sejumlah "%" tiket yang diminta.', 
                        remaining_capacity, NEW.jumlah_tiket;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_check_attraction_capacity
BEFORE INSERT OR UPDATE ON RESERVASI
FOR EACH ROW EXECUTE FUNCTION check_attraction_capacity();

CREATE OR REPLACE FUNCTION check_trainer_rotation()
RETURNS TRIGGER AS $$
DECLARE
    three_months_ago DATE := CURRENT_DATE - INTERVAL '3 months';
    current_trainer RECORD;
    new_trainer_record RECORD;
    rotation_message TEXT;
BEGIN
    SELECT 
        p.username_lh,
        CONCAT(pg.nama_depan, ' ', pg.nama_belakang) AS full_name,
        MIN(jp.tgl_penugasan) AS first_assignment
    INTO 
        current_trainer
    FROM 
        JADWAL_PENUGASAN jp
        JOIN PELATIH_HEWAN p ON jp.username_lh = p.username_lh
        JOIN PENGGUNA pg ON p.username_lh = pg.username
    WHERE 
        jp.nama_atraksi = NEW.nama_atraksi
    GROUP BY 
        p.username_lh, pg.nama_depan, pg.nama_belakang
    HAVING 
        MIN(jp.tgl_penugasan) < three_months_ago
    LIMIT 1;
    
    IF current_trainer.username_lh IS NOT NULL THEN
        SELECT 
            p.username_lh,
            CONCAT(pg.nama_depan, ' ', pg.nama_belakang) AS full_name
        INTO 
            new_trainer_record
        FROM 
            JADWAL_PENUGASAN jp
            JOIN PELATIH_HEWAN p ON jp.username_lh = p.username_lh
            JOIN PENGGUNA pg ON p.username_lh = pg.username
        WHERE 
            jp.nama_atraksi = NEW.nama_atraksi
            AND p.username_lh != current_trainer.username_lh
        ORDER BY jp.tgl_penugasan DESC
        LIMIT 1;
        
        IF new_trainer_record.username_lh IS NOT NULL THEN
            RAISE EXCEPTION 'TRAINER_ROTATION: Pelatih "%" telah bertugas lebih dari 3 bulan di atraksi "%" dan akan diganti.',
                current_trainer.full_name, NEW.nama_atraksi;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_check_trainer_rotation
AFTER UPDATE ON ATRAKSI
FOR EACH ROW EXECUTE FUNCTION check_trainer_rotation();

CREATE OR REPLACE FUNCTION perform_trainer_rotation(atraksi_name TEXT) 
RETURNS TABLE(old_trainer TEXT, new_trainer TEXT, rotated BOOLEAN) AS $$
DECLARE
    three_months_ago DATE := CURRENT_DATE - INTERVAL '3 months';
    current_trainer_username TEXT;
    current_trainer_name TEXT;
    new_trainer_username TEXT;
    new_trainer_name TEXT;
BEGIN
    SELECT 
        p.username_lh,
        CONCAT(pg.nama_depan, ' ', pg.nama_belakang)
    INTO 
        current_trainer_username, current_trainer_name
    FROM 
        JADWAL_PENUGASAN jp
        JOIN PELATIH_HEWAN p ON jp.username_lh = p.username_lh
        JOIN PENGGUNA pg ON p.username_lh = pg.username
    WHERE 
        jp.nama_atraksi = atraksi_name
    GROUP BY 
        p.username_lh, pg.nama_depan, pg.nama_belakang
    HAVING 
        MIN(jp.tgl_penugasan) < three_months_ago
    LIMIT 1;
    
    IF current_trainer_username IS NOT NULL THEN
        SELECT 
            p.username_lh,
            CONCAT(pg.nama_depan, ' ', pg.nama_belakang)
        INTO 
            new_trainer_username, new_trainer_name
        FROM 
            PELATIH_HEWAN p
            JOIN PENGGUNA pg ON p.username_lh = pg.username
        WHERE 
            p.username_lh != current_trainer_username
        ORDER BY RANDOM()
        LIMIT 1;
        
        IF new_trainer_username IS NOT NULL THEN
            INSERT INTO JADWAL_PENUGASAN (username_lh, tgl_penugasan, nama_atraksi)
            VALUES (new_trainer_username, CURRENT_TIMESTAMP, atraksi_name);
            
            RETURN QUERY SELECT 
                current_trainer_name, 
                new_trainer_name, 
                TRUE;
            RETURN;
        END IF;
    END IF;
    
    RETURN QUERY SELECT 
        current_trainer_name, 
        NULL::TEXT, 
        FALSE;
END;
$$ LANGUAGE plpgsql;