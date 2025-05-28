CREATE OR REPLACE FUNCTION tambah_jadwal_rutin()
RETURNS TRIGGER AS $$
DECLARE
    freq INTEGER;
    tgl_awal DATE;
    tgl_berikut DATE;
    nama_hewan TEXT;
BEGIN
    freq := NEW.freq_pemeriksaan_rutin;
    tgl_awal := NEW.tgl_pemeriksaan_selanjutnya;
    tgl_berikut := tgl_awal + (freq || ' month')::interval;

    -- Tambahkan jadwal berikutnya dalam tahun yang sama
    WHILE EXTRACT(YEAR FROM tgl_berikut) = EXTRACT(YEAR FROM tgl_awal) LOOP
        -- Cek apakah jadwal sudah ada, jika belum baru insert
        IF NOT EXISTS (
            SELECT 1 FROM jadwal_pemeriksaan_kesehatan
            WHERE id_hewan = NEW.id_hewan
              AND tgl_pemeriksaan_selanjutnya = tgl_berikut::DATE
        ) THEN
            INSERT INTO jadwal_pemeriksaan_kesehatan (id_hewan, tgl_pemeriksaan_selanjutnya, freq_pemeriksaan_rutin)
            VALUES (NEW.id_hewan, tgl_berikut::DATE, freq);
        END IF;

        tgl_berikut := tgl_berikut + (freq || ' month')::interval;
    END LOOP;

    -- Ambil nama hewan
    SELECT nama INTO nama_hewan FROM hewan WHERE id = NEW.id_hewan;

    RAISE NOTICE 'SUKSES: Jadwal pemeriksaan rutin hewan "%" telah ditambahkan sesuai frekuensi.', nama_hewan;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_tambah_jadwal_rutin
AFTER INSERT ON jadwal_pemeriksaan_kesehatan
FOR EACH ROW
EXECUTE FUNCTION tambah_jadwal_rutin();
