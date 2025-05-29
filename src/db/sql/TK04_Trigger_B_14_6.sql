-- Memastikan tabel adopter memiliki kolom total_kontribusi
ALTER TABLE adopter ADD COLUMN IF NOT EXISTS total_kontribusi INTEGER DEFAULT 0;

-- Trigger untuk sinkronisasi total kontribusi adopter
CREATE OR REPLACE FUNCTION update_total_kontribusi()
RETURNS TRIGGER AS $$
DECLARE
    adopter_name VARCHAR;
    total_sum INT;
BEGIN
    -- Hanya jalankan logika jika status berubah menjadi Lunas
    IF NEW.status_pembayaran = 'Lunas' THEN
        -- Hitung total kontribusi untuk adopter
        SELECT COALESCE(SUM(a.kontribusi_finansial), 0) INTO total_sum
        FROM adopsi a
        WHERE a.id_adopter = NEW.id_adopter AND a.status_pembayaran = 'Lunas';
        
        -- Update total_kontribusi di tabel adopter
        UPDATE adopter SET total_kontribusi = total_sum
        WHERE id_adopter = NEW.id_adopter;
        
        -- Dapatkan nama adopter
        SELECT COALESCE(i.nama, o.nama_organisasi, ad.username_adopter) INTO adopter_name
        FROM adopter ad
        LEFT JOIN individu i ON i.id_adopter = ad.id_adopter
        LEFT JOIN organisasi o ON o.id_adopter = ad.id_adopter
        WHERE ad.id_adopter = NEW.id_adopter;
        
        -- Tampilkan pesan sukses
        RAISE NOTICE 'SUKSES: Total kontribusi adopter "%" telah diperbarui.', adopter_name;
        
        -- Jalankan juga update_top_adopters untuk memicu pesan peringkat
        PERFORM update_top_adopters();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Hapus trigger jika sudah ada untuk menghindari error
DROP TRIGGER IF EXISTS adopsi_update_trigger ON adopsi;
DROP TRIGGER IF EXISTS adopsi_insert_trigger ON adopsi;

CREATE TRIGGER adopsi_update_trigger
AFTER UPDATE OF status_pembayaran ON adopsi
FOR EACH ROW
EXECUTE FUNCTION update_total_kontribusi();

CREATE TRIGGER adopsi_insert_trigger
AFTER INSERT ON adopsi
FOR EACH ROW
EXECUTE FUNCTION update_total_kontribusi();

-- Trigger untuk pemeringkatan adopter dengan total kontribusi tertinggi
CREATE OR REPLACE FUNCTION update_top_adopters()
RETURNS TRIGGER AS $$
DECLARE
    top_adopter_name VARCHAR;
    top_kontribusi INT;
BEGIN
    -- Ambil adopter dengan kontribusi tertinggi setahun terakhir
    SELECT 
        COALESCE(i.nama, o.nama_organisasi, ad.username_adopter), 
        SUM(a.kontribusi_finansial)
    INTO top_adopter_name, top_kontribusi
    FROM adopsi a
    JOIN adopter ad ON a.id_adopter = ad.id_adopter
    LEFT JOIN individu i ON i.id_adopter = a.id_adopter
    LEFT JOIN organisasi o ON o.id_adopter = a.id_adopter
<<<<<<< HEAD
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
=======
    WHERE a.status_pembayaran = 'Lunas'
      AND a.tgl_mulai_adopsi >= (CURRENT_DATE - INTERVAL '1 year')
    GROUP BY COALESCE(i.nama, o.nama_organisasi, ad.username_adopter)
    ORDER BY SUM(a.kontribusi_finansial) DESC
>>>>>>> cf58997e25d1ebdfd74835d825f14a950df209f1
    LIMIT 1;

    IF top_adopter_name IS NOT NULL THEN
        -- Format pesan dengan pemisah ribuan
        RAISE NOTICE 'SUKSES: Daftar Top 5 Adopter satu tahun terakhir berhasil diperbarui, dengan peringkat pertama dengan nama adopter "%" berkontribusi sebesar "Rp%".', 
            top_adopter_name, 
            TO_CHAR(top_kontribusi, 'FM999,999,999');
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Versi function sebagai stored procedure biasa untuk dipanggil langsung
CREATE OR REPLACE FUNCTION get_top_adopters()
RETURNS TEXT AS $$
DECLARE
    top_adopter_name VARCHAR;
    top_kontribusi INT;
    result_msg TEXT;
BEGIN
    -- Ambil adopter dengan kontribusi tertinggi setahun terakhir
    SELECT 
        COALESCE(i.nama, o.nama_organizasi, ad.username_adopter), 
        SUM(a.kontribusi_finansial)
    INTO top_adopter_name, top_kontribusi
    FROM adopsi a
    JOIN adopter ad ON a.id_adopter = ad.id_adopter
    LEFT JOIN individu i ON i.id_adopter = a.id_adopter
    LEFT JOIN organisasi o ON o.id_adopter = a.id_adopter
    WHERE a.status_pembayaran = 'Lunas'
      AND a.tgl_mulai_adopsi >= (CURRENT_DATE - INTERVAL '1 year')
    GROUP BY COALESCE(i.nama, o.nama_organizasi, ad.username_adopter)
    ORDER BY SUM(a.kontribusi_finansial) DESC
    LIMIT 1;

    IF top_adopter_name IS NOT NULL THEN
        -- Format pesan dengan pemisah ribuan
        result_msg := format('SUKSES: Daftar Top 5 Adopter satu tahun terakhir berhasil diperbarui, dengan peringkat pertama dengan nama adopter "%s" berkontribusi sebesar "Rp%s"', 
            top_adopter_name, 
            to_char(top_kontribusi, 'FM999,999,999'));
        RETURN result_msg;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Hapus trigger jika sudah ada
DROP TRIGGER IF EXISTS top_adopters_update_trigger ON adopsi;

CREATE TRIGGER top_adopters_update_trigger
AFTER UPDATE OF status_pembayaran ON adopsi
FOR EACH ROW
WHEN (NEW.status_pembayaran = 'Lunas')
EXECUTE FUNCTION update_top_adopters();