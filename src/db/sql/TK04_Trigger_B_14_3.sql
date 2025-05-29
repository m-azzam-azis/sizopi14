-- This trigger will synchronize jadwal_pemeriksaan_kesehatan when a new medical record
-- is added with "Sakit" status, setting the next check date to 7 days from today's medical record date.
-- If no existing schedule is found for that animal, a new one will be created.

-- Function to update or create a health check schedule
CREATE OR REPLACE FUNCTION update_health_check_schedule_on_medical_record() 
RETURNS TRIGGER AS $$
DECLARE
    hewan_name VARCHAR(100);
    existing_schedule RECORD;
    next_check_date DATE;
BEGIN
    -- Set next check date to 7 days after the current medical record date
    next_check_date := NEW.tanggal_pemeriksaan + INTERVAL '7 days';
    
    -- Get the animal name for the message
    SELECT nama INTO hewan_name
    FROM HEWAN
    WHERE id = NEW.id_hewan;
      -- Only modify schedule if status is "Sedang Sakit" (matches the frontend value)
    IF NEW.status_kesehatan = 'Sedang Sakit' THEN
        -- Check if there's an existing schedule for this animal
        SELECT * INTO existing_schedule
        FROM JADWAL_PEMERIKSAAN_KESEHATAN
        WHERE id_hewan = NEW.id_hewan;
        
        IF FOUND THEN
            -- Update existing schedule with the new date
            UPDATE JADWAL_PEMERIKSAAN_KESEHATAN
            SET tgl_pemeriksaan_selanjutnya = next_check_date
            WHERE id_hewan = NEW.id_hewan;
        ELSE
            -- Create new schedule with default frequency of 3 months
            INSERT INTO JADWAL_PEMERIKSAAN_KESEHATAN (
                id_hewan,
                tgl_pemeriksaan_selanjutnya,
                freq_pemeriksaan_rutin
            ) VALUES (
                NEW.id_hewan,
                next_check_date,
                3   -- Default frequency is 3 months
            );
        END IF;
          -- Display success message
        RAISE NOTICE 'SUKSES: Jadwal pemeriksaan hewan "%" telah diperbarui karena status kesehatan "Sedang Sakit".', hewan_name;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on CATATAN_MEDIS table
DROP TRIGGER IF EXISTS sync_health_check_schedule_trigger ON CATATAN_MEDIS;
CREATE TRIGGER sync_health_check_schedule_trigger
AFTER INSERT OR UPDATE OF status_kesehatan
ON CATATAN_MEDIS
FOR EACH ROW
EXECUTE FUNCTION update_health_check_schedule_on_medical_record();

