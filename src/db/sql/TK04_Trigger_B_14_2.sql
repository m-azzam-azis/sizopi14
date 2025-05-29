CREATE OR REPLACE FUNCTION cek_duplikat_satwa()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM hewan
    WHERE LOWER(nama) = LOWER(NEW.nama)
      AND LOWER(spesies) = LOWER(NEW.spesies)
      AND LOWER(asal_hewan) = LOWER(NEW.asal_hewan)
  ) THEN
    RAISE EXCEPTION 'Data satwa atas nama “%”, spesies “%”, dan berasal dari “%” sudah terdaftar.',
      NEW.nama, NEW.spesies, NEW.asal_hewan;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cek_duplikat_satwa
BEFORE INSERT ON hewan
FOR EACH ROW
EXECUTE FUNCTION cek_duplikat_satwa();


CREATE TABLE IF NOT EXISTS riwayat_satwa (
  id_hewan UUID NOT NULL,
  status_kesehatan_lama VARCHAR(50),
  status_kesehatan_baru VARCHAR(50),
  nama_habitat_lama VARCHAR(100),
  nama_habitat_baru VARCHAR(100),
  waktu_perubahan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_hewan, waktu_perubahan),
  FOREIGN KEY (id_hewan) REFERENCES hewan(id)
);

CREATE OR REPLACE FUNCTION log_riwayat_satwa()
RETURNS TRIGGER AS $$
BEGIN
  -- Cek apakah status_kesehatan atau nama_habitat berubah
  IF NEW.status_kesehatan IS DISTINCT FROM OLD.status_kesehatan
     OR NEW.nama_habitat IS DISTINCT FROM OLD.nama_habitat THEN

    INSERT INTO riwayat_satwa (
      id_hewan,
      status_kesehatan_lama,
      status_kesehatan_baru,
      nama_habitat_lama,
      nama_habitat_baru,
      waktu_perubahan
    )
    VALUES (
      OLD.id,
      OLD.status_kesehatan,
      NEW.status_kesehatan,
      OLD.nama_habitat,
      NEW.nama_habitat,
      CURRENT_TIMESTAMP
    );

    RAISE NOTICE 'SUKSES: Riwayat perubahan status kesehatan dari "%" menjadi "%" atau habitat dari "%" menjadi "%" telah dicatat.',
      OLD.status_kesehatan, NEW.status_kesehatan,
      OLD.nama_habitat, NEW.nama_habitat;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_riwayat_satwa
AFTER UPDATE ON hewan
FOR EACH ROW
EXECUTE FUNCTION log_riwayat_satwa();