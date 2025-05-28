CREATE OR REPLACE FUNCTION check_attraction_capacity()
RETURNS TRIGGER AS $$
DECLARE
    capacity_max INT;
    tickets_sold INT;
    remaining_capacity INT;
BEGIN
    SELECT f.kapasitas_max INTO capacity_max
    FROM FASILITAS f
    WHERE f.nama = NEW.nama_fasilitas;
    
    SELECT COALESCE(SUM(jumlah_tiket), 0) INTO tickets_sold
    FROM RESERVASI
    WHERE nama_fasilitas = NEW.nama_fasilitas
      AND tanggal_kunjungan = NEW.tanggal_kunjungan
      AND status != 'Batal'
      AND (username_P != NEW.username_P 
           OR nama_fasilitas != NEW.nama_fasilitas 
           OR tanggal_kunjungan != NEW.tanggal_kunjungan);
    
    remaining_capacity := capacity_max - tickets_sold;
    
    IF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'Batal' THEN
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
    trainer_record RECORD;
    trainer_name VARCHAR;
BEGIN
    FOR trainer_record IN (
        SELECT 
            p.username_lh,
            CONCAT(pg.nama_depan, ' ', pg.nama_belakang) AS full_name,
            MIN(jp.tgl_penugasan) AS first_assignment
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
    ) LOOP
        RAISE NOTICE 'SUKSES: Pelatih "%" telah bertugas lebih dari 3 bulan di atraksi "%" dan akan diganti.',
                    trainer_record.full_name, NEW.nama_atraksi;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_check_trainer_rotation
AFTER UPDATE ON ATRAKSI
FOR EACH ROW EXECUTE FUNCTION check_trainer_rotation();