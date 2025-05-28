CREATE OR REPLACE FUNCTION sinkronisasi_pemeriksaan()
RETURNS TRIGGER AS $$
DECLARE
    existing_record RECORD;
    nama_hewan TEXT;
BEGIN
    -- Cek apakah status kesehatan adalah 'Sakit'
    IF NEW.status_kesehatan = 'Sakit' THEN
        -- Cari jadwal pemeriksaan terdekat dalam 7 hari ke depan dari tanggal pemeriksaan
        SELECT * INTO existing_record
        FROM jadwal_pemeriksaan_kesehatan
        WHERE id_hewan = NEW.id_hewan
          AND tgl_pemeriksaan_selanjutnya BETWEEN NEW.tanggal_pemeriksaan AND (NEW.tanggal_pemeriksaan + INTERVAL '7 days')
        ORDER BY tgl_pemeriksaan_selanjutnya
        LIMIT 1;

        IF FOUND THEN
            -- Update tanggal pemeriksaan selanjutnya menjadi 7 hari dari tanggal pemeriksaan baru
            UPDATE jadwal_pemeriksaan_kesehatan
            SET tgl_pemeriksaan_selanjutnya = NEW.tanggal_pemeriksaan + INTERVAL '7 days'
            WHERE id_hewan = NEW.id_hewan
              AND tgl_pemeriksaan_selanjutnya = existing_record.tgl_pemeriksaan_selanjutnya;
        ELSE
            -- Tambahkan entri baru
            INSERT INTO jadwal_pemeriksaan_kesehatan (id_hewan, tgl_pemeriksaan_selanjutnya, freq_pemeriksaan_rutin)
            VALUES (NEW.id_hewan, NEW.tanggal_pemeriksaan + INTERVAL '7 days', 3);
        END IF;

        -- Ambil nama hewan untuk output
        SELECT nama INTO nama_hewan FROM hewan WHERE id = NEW.id_hewan;

        RAISE NOTICE 'SUKSES: Jadwal pemeriksaan hewan "%" telah diperbarui karena status kesehatan "Sakit".', nama_hewan;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sinkronisasi_pemeriksaan
AFTER INSERT ON catatan_medis
FOR EACH ROW
EXECUTE FUNCTION sinkronisasi_pemeriksaan();
