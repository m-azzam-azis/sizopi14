CREATE OR REPLACE FUNCTION sinkronisasi_total_kontribusi()
RETURNS TRIGGER AS $$
DECLARE
    total NUMERIC;
    nama_adopter TEXT;
BEGIN
    -- Hitung total kontribusi dari adopsi yang lunas
    SELECT COALESCE(SUM(kontribusi_finansial), 0)
    INTO total
    FROM adopsi
    WHERE id_adopter = COALESCE(NEW.id_adopter, OLD.id_adopter)
    AND status_pembayaran = 'Lunas';

    -- Update total_kontribusi di tabel adopter
    UPDATE adopter
    SET total_kontribusi = total
    WHERE id_adopter = COALESCE(NEW.id_adopter, OLD.id_adopter);

    -- Ambil nama adopter untuk notifikasi
    SELECT 
        CASE 
            WHEN i.nama IS NOT NULL THEN i.nama
            WHEN o.nama_organisasi IS NOT NULL THEN o.nama_organisasi
        END
    INTO nama_adopter
    FROM adopter a
    LEFT JOIN individu i ON i.id_adopter = a.id_adopter
    LEFT JOIN organisasi o ON o.id_adopter = a.id_adopter
    WHERE a.id_adopter = COALESCE(NEW.id_adopter, OLD.id_adopter);

    RAISE NOTICE 'SUKSES: Total kontribusi adopter "%" telah diperbarui', nama_adopter;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_total_kontribusi
AFTER INSERT OR UPDATE OR DELETE ON adopsi
FOR EACH ROW
EXECUTE FUNCTION sinkronisasi_total_kontribusi();


CREATE OR REPLACE FUNCTION rank_top_adopters()
RETURNS TRIGGER AS $$
DECLARE
    top_adopter RECORD;
    top_kontribusi NUMERIC;
    top_nama TEXT;
BEGIN
    -- Ambil adopter dengan kontribusi tertinggi dalam setahun terakhir
    SELECT 
        CASE 
            WHEN i.nama IS NOT NULL THEN i.nama
            WHEN o.nama_organisasi IS NOT NULL THEN o.nama_organisasi
        END as nama,
        SUM(ad.kontribusi_finansial) as total_kontribusi
    INTO top_adopter
    FROM adopsi ad
    JOIN adopter ap ON ad.id_adopter = ap.id_adopter
    LEFT JOIN individu i ON i.id_adopter = ap.id_adopter
    LEFT JOIN organisasi o ON o.id_adopter = ap.id_adopter
    WHERE ad.status_pembayaran = 'Lunas'
    AND ad.tgl_mulai_adopsi >= CURRENT_DATE - INTERVAL '1 year'
    GROUP BY ap.id_adopter, i.nama, o.nama_organisasi
    ORDER BY total_kontribusi DESC
    LIMIT 1;

    IF FOUND THEN
        RAISE NOTICE 'SUKSES: Daftar Top 5 Adopter satu tahun terakhir berhasil diperbarui, dengan peringkat pertama dengan nama adopter "%" berkontribusi sebesar "Rp%"', 
            top_adopter.nama, 
            to_char(top_adopter.total_kontribusi, 'FM999,999,999');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_top_adopters
AFTER INSERT OR UPDATE OR DELETE ON adopsi
FOR EACH ROW
EXECUTE FUNCTION rank_top_adopters();