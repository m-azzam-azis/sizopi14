DROP TABLE IF EXISTS pengguna CASCADE;
DROP TABLE IF EXISTS pengunjung CASCADE;
DROP TABLE IF EXISTS dokter_hewan  CASCADE;
DROP TABLE IF EXISTS spesialisasi CASCADE;
DROP TABLE IF EXISTS penjaga_hewan CASCADE;
DROP TABLE IF EXISTS pelatih_hewan CASCADE;
DROP TABLE IF EXISTS staf_admin CASCADE;
DROP TABLE IF EXISTS hewan CASCADE;
DROP TABLE IF EXISTS catatan_medis CASCADE;
DROP TABLE IF EXISTS habitat CASCADE;
DROP TABLE IF EXISTS pakan CASCADE;
DROP TABLE IF EXISTS memberi CASCADE;
DROP TABLE IF EXISTS fasilitas CASCADE;
DROP TABLE IF EXISTS atraksi CASCADE;
DROP TABLE IF EXISTS jadwal_penugasan CASCADE;
DROP TABLE IF EXISTS berpartisipasi CASCADE;
DROP TABLE IF EXISTS jadwal_pemeriksaan_kesehatan CASCADE;
DROP TABLE IF EXISTS wahana CASCADE;
DROP TABLE IF EXISTS adopter CASCADE;
DROP TABLE IF EXISTS individu CASCADE;
DROP TABLE IF EXISTS organisasi CASCADE;
DROP TABLE IF EXISTS adopsi CASCADE;
DROP TABLE IF EXISTS reservasi CASCADE;
DROP TABLE IF EXISTS login_attempts CASCADE;

CREATE TABLE PENGGUNA (
  username VARCHAR(50) PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  nama_depan VARCHAR(50) NOT NULL,
  nama_tengah VARCHAR(50),
  nama_belakang VARCHAR(50) NOT NULL,
  no_telepon VARCHAR(15) NOT NULL
);

CREATE TABLE PENGUNJUNG (
  username_P VARCHAR(50) PRIMARY KEY,
  alamat VARCHAR(200) NOT NULL,
  tgl_lahir DATE NOT NULL,


  FOREIGN KEY (username_P) REFERENCES PENGGUNA (username) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE DOKTER_HEWAN (
  username_DH VARCHAR(50) PRIMARY KEY,
  no_STR VARCHAR(50) NOT NULL,


  FOREIGN KEY (username_DH) REFERENCES PENGGUNA (username) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE SPESIALISASI (
  username_SH VARCHAR(50),
  nama_spesialisasi VARCHAR(100) NOT NULL,


  PRIMARY KEY (username_SH, nama_spesialisasi),
  FOREIGN KEY (username_SH) REFERENCES DOKTER_HEWAN (username_DH) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE PENJAGA_HEWAN (
  username_JH VARCHAR(50) PRIMARY KEY,
  id_staf UUID NOT NULL,


  FOREIGN KEY (username_JH) REFERENCES PENGGUNA (username) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE PELATIH_HEWAN (
  username_LH VARCHAR(50) PRIMARY KEY,
  id_staf UUID NOT NULL,


  FOREIGN KEY (username_LH) REFERENCES PENGGUNA (username) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE STAF_ADMIN (
  username_sa VARCHAR(50) PRIMARY KEY REFERENCES PENGGUNA(username) ON UPDATE CASCADE ON DELETE CASCADE,
  id_staf UUID NOT NULL
);

CREATE TABLE HABITAT (
  nama VARCHAR(50) PRIMARY KEY,
  luas_area DECIMAL NOT NULL,
  kapasitas INT NOT NULL,
  status VARCHAR(100) NOT NULL
);

CREATE TABLE HEWAN (
  id UUID PRIMARY KEY,
  nama VARCHAR(100),
  spesies VARCHAR(100) NOT NULL,
  asal_hewan VARCHAR(100) NOT NULL,
  tanggal_lahir DATE,
  status_kesehatan VARCHAR(50) NOT NULL,
  nama_habitat VARCHAR(100) REFERENCES HABITAT(nama) ON UPDATE CASCADE ON DELETE CASCADE,
  url_foto VARCHAR(255) NOT NULL
);

CREATE TABLE CATATAN_MEDIS (
  id_hewan UUID REFERENCES HEWAN(id) ON UPDATE CASCADE ON DELETE CASCADE,
  username_dh VARCHAR(50) REFERENCES DOKTER_HEWAN(username_dh) ON UPDATE CASCADE ON DELETE CASCADE,
  tanggal_pemeriksaan DATE,
  diagnosis VARCHAR(100),
  pengobatan VARCHAR(100),
  status_kesehatan VARCHAR(50) NOT NULL,
  catatan_tindak_lanjut VARCHAR(100),
  PRIMARY KEY (id_hewan, tanggal_pemeriksaan)
);

CREATE TABLE PAKAN (
  id_hewan UUID REFERENCES HEWAN(id) ON UPDATE CASCADE ON DELETE CASCADE,
  jadwal DATE,
  jenis VARCHAR(50) NOT NULL,
  jumlah INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_hewan, jadwal)
);

CREATE TABLE MEMBERI (
  id_hewan UUID,
  jadwal DATE,
  username_jh VARCHAR(50) REFERENCES PENJAGA_HEWAN(username_jh) ON UPDATE CASCADE ON DELETE CASCADE,
  
  PRIMARY KEY (id_hewan, jadwal),
  FOREIGN KEY (id_hewan, jadwal) REFERENCES PAKAN (id_hewan, jadwal) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE FASILITAS (
	nama VARCHAR(50) PRIMARY KEY,
	jadwal TIME NOT NULL,
	kapasitas_max INT NOT NULL
);

CREATE TABLE ATRAKSI (
	nama_atraksi VARCHAR(50) PRIMARY KEY,
	lokasi VARCHAR(100) NOT NULL,
	CONSTRAINT fk_nama_atraksi FOREIGN KEY (nama_atraksi)
    	REFERENCES fasilitas(nama) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE JADWAL_PENUGASAN (
	username_lh VARCHAR(50),
	tgl_penugasan TIMESTAMP,
	nama_atraksi VARCHAR(50),
	PRIMARY KEY (username_lh, tgl_penugasan),
	CONSTRAINT fk_username_lh FOREIGN KEY (username_lh)
    	REFERENCES pelatih_hewan(username_lh) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_nama_atraksi_jadwal FOREIGN KEY (nama_atraksi)
    	REFERENCES atraksi(nama_atraksi) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE BERPARTISIPASI (
	nama_fasilitas VARCHAR(50),
	id_hewan UUID,
	PRIMARY KEY (nama_fasilitas, id_hewan),
	CONSTRAINT fk_berpartisipasi_fasilitas
    	FOREIGN KEY (nama_fasilitas) REFERENCES fasilitas(nama) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_berpartisipasi_hewan
    	FOREIGN KEY (id_hewan) REFERENCES hewan(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE JADWAL_PEMERIKSAAN_KESEHATAN (
	id_hewan UUID,
	tgl_pemeriksaan_selanjutnya DATE,
	freq_pemeriksaan_rutin INT NOT NULL DEFAULT 3,
	PRIMARY KEY (id_hewan, tgl_pemeriksaan_selanjutnya),
	CONSTRAINT fk_jpk_hewan FOREIGN KEY (id_hewan)
    	REFERENCES hewan(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE WAHANA (
	nama_wahana VARCHAR(50) PRIMARY KEY,
	peraturan TEXT NOT NULL,
	CONSTRAINT fk_wahana_fasilitas
    	FOREIGN KEY (nama_wahana)
    	REFERENCES fasilitas(nama) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE ADOPTER (
   username_adopter VARCHAR(50) UNIQUE,
   id_adopter UUID PRIMARY KEY,
   total_kontribusi INT NOT NULL,
   CONSTRAINT fk_adopter_pengunjung FOREIGN KEY (username_adopter)      
   REFERENCES PENGUNJUNG(username_P) ON UPDATE CASCADE ON DELETE 
   CASCADE
);

CREATE TABLE INDIVIDU (
   nik CHAR(16) PRIMARY KEY,
   nama VARCHAR(100) NOT NULL,
   id_adopter UUID,
   CONSTRAINT fk_individu_adopter FOREIGN KEY (id_adopter)      
   REFERENCES ADOPTER(id_adopter) ON UPDATE CASCADE ON DELETE 
   CASCADE
);

CREATE TABLE ORGANISASI (
   npp CHAR(8) PRIMARY KEY,
   nama_organisasi VARCHAR(100) NOT NULL,
   id_adopter UUID,
   CONSTRAINT fk_organisasi_adopter FOREIGN KEY (id_adopter)      
   REFERENCES ADOPTER(id_adopter) ON UPDATE CASCADE ON DELETE 
   CASCADE
);

CREATE TABLE ADOPSI (
   id_adopter UUID,
   id_hewan UUID,
   status_pembayaran VARCHAR(10) NOT NULL,
   tgl_mulai_adopsi DATE,
   tgl_berhenti_adopsi DATE NOT NULL,
   kontribusi_finansial INT NOT NULL,
   PRIMARY KEY (id_adopter, id_hewan, tgl_mulai_adopsi),
   CONSTRAINT fk_adopsi_adopter FOREIGN KEY (id_adopter)
   REFERENCES ADOPTER(id_adopter) ON UPDATE CASCADE ON DELETE     
   CASCADE,
   CONSTRAINT fk_adopsi_hewan FOREIGN KEY (id_hewan)
   REFERENCES HEWAN(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE RESERVASI (
   username_P VARCHAR(50) NOT NULL,
   nama_fasilitas VARCHAR(50) NOT NULL,
   tanggal_kunjungan DATE NOT NULL,
   jumlah_tiket INT NOT NULL,
   status VARCHAR(50) NOT NULL,


   PRIMARY KEY (username_P, nama_fasilitas, tanggal_kunjungan),
   FOREIGN KEY (username_P) REFERENCES PENGUNJUNG(username_P) ON UPDATE CASCADE ON DELETE CASCADE,
   FOREIGN KEY (nama_fasilitas) REFERENCES FASILITAS(nama) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS LOGIN_ATTEMPTS (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT FALSE
);

INSERT INTO pengguna VALUES ('rajatacalista', 'ywaskita@example.com', 'P5hX6Syg*A', 'Prasetya', 'NULL', 'Andriani', '089635460305');
INSERT INTO pengguna VALUES ('nsihotang', 'indahkuswandari@example.com', 't(&4eBYXnz', 'Damar', 'NULL', 'Thamrin', '083573452405');
INSERT INTO pengguna VALUES ('hestihassanah', 'hutapeamanah@example.net', '9)C1JrS9&*', 'Ibun', 'NULL', 'Permadi', '089802507003');
INSERT INTO pengguna VALUES ('atmajasuryatmi', 'wawan11@example.net', 'suSG28Bcs#', 'Gading', 'NULL', 'Nainggolan', '080035105623');
INSERT INTO pengguna VALUES ('catur59', 'laksitalili@example.net', 'aH4kCm*_^3', 'Azalea', 'NULL', 'Wijayanti', '087625425660');
INSERT INTO pengguna VALUES ('wijayacemplunk', 'daru09@example.org', '$fWcSXd^2A', 'Drajat', 'Rahmi', 'Nainggolan', '086488709166');
INSERT INTO pengguna VALUES ('wijayaheru', 'nasim79@example.org', 'k++R3Yb!+s', 'Warji', 'NULL', 'Gunarto', '082082982153');
INSERT INTO pengguna VALUES ('haryanticandrakanta', 'bakijan84@example.org', '9E$7XLGta!', 'Tira', 'Jais', 'Mangunsong', '082302821691');
INSERT INTO pengguna VALUES ('zfirmansyah', 'twijayanti@example.org', 'd7rCW!iC#$', 'Praba', 'NULL', 'Wulandari', '089729904560');
INSERT INTO pengguna VALUES ('awastuti', 'adiarja30@example.net', '2!8AT1NdY@', 'Elon', 'NULL', 'Budiman', '080715427385');
INSERT INTO pengguna VALUES ('dartono24', 'gunartobajragin@example.org', 'wv4Rhkae_Z', 'Silvia', 'NULL', 'Nurdiyanti', '082654760484');
INSERT INTO pengguna VALUES ('mandalagada', 'mulyanto55@example.net', '#5YVtz)(@v', 'Pardi', 'Lili', 'Siregar', '088708984076');
INSERT INTO pengguna VALUES ('liman61', 'purwantiyono@example.com', '^5#Dc+pTlz', 'Lukita', 'NULL', 'Waskita', '081657004049');
INSERT INTO pengguna VALUES ('hpuspita', 'usman79@example.net', 'F_73JENcds', 'Agus', 'NULL', 'Januar', '084388564319');
INSERT INTO pengguna VALUES ('pratamapadmi', 'danunapitupulu@example.com', '*WORZJQe&5', 'Kambali', 'NULL', 'Pranowo', '085398522509');
INSERT INTO pengguna VALUES ('margana08', 'kamidinsuartini@example.org', 'eM9QtJ)w&L', 'Ismail', 'Ajiman', 'Siregar', '080925544576');
INSERT INTO pengguna VALUES ('pertiwicemeti', 'aryanihendri@example.com', 'o(W59NrpAU', 'Prakosa', 'NULL', 'Nuraini', '089620290725');
INSERT INTO pengguna VALUES ('dwinarno', 'siskamahendra@example.org', '%5BW&dlb#M', 'Luluh', 'NULL', 'Wasita', '080749318642');
INSERT INTO pengguna VALUES ('rikasinaga', 'pudjiastutisalwa@example.com', 'j$6dZvyxe9', 'Arta', 'NULL', 'Firmansyah', '088212918896');
INSERT INTO pengguna VALUES ('wijayatirtayasa', 'harjaya75@example.net', '60QUB4pr@P', 'Dalima', 'NULL', 'Nainggolan', '086444064488');
INSERT INTO pengguna VALUES ('ghutasoit', 'gharyanto@example.com', '#I0ZCoE(dD', 'Erik', 'NULL', 'Aryani', '088553620829');
INSERT INTO pengguna VALUES ('adiarjaputra', 'ardiantolanggeng@example.com', 'p1TDwhxE+0', 'Caket', 'Mutia', 'Megantara', '086570869305');
INSERT INTO pengguna VALUES ('galar62', 'ivansihotang@example.net', '9J3)Y^fJS$', 'Caraka', 'Danang', 'Nasyidah', '088235703934');
INSERT INTO pengguna VALUES ('prayogatirtayasa', 'raina80@example.com', 'sK&0&1NxW+', 'Raina', 'NULL', 'Thamrin', '082619737813');
INSERT INTO pengguna VALUES ('nyanahariyah', 'laksmiwatihasim@example.com', '!Ai7T+oM!i', 'Umaya', 'NULL', 'Siregar', '082716644659');
INSERT INTO pengguna VALUES ('uli00', 'raden89@example.net', '6&7DW#xADR', 'Rahayu', 'Artawan', 'Lazuardi', '085140704366');
INSERT INTO pengguna VALUES ('karimahnurdiyanti', 'faizahjailani@example.com', 'jk9F_8MxV_', 'Labuh', 'NULL', 'Suryono', '086609759294');
INSERT INTO pengguna VALUES ('azalea07', 'edison70@example.net', '$0oyL&wuHp', 'Ibrani', 'Xanana', 'Lestari', '085067820195');
INSERT INTO pengguna VALUES ('ekopertiwi', 'harjaya16@example.com', 'CZc5v_Mf1+', 'Siti', 'NULL', 'Siregar', '085013187050');
INSERT INTO pengguna VALUES ('pradiptarahmi', 'nashiruddinozy@example.org', 'A&qhjrHt+2', 'Baktiadi', 'NULL', 'Wibisono', '085624629264');
INSERT INTO pengguna VALUES ('mursitasantoso', 'gunawanbala@example.org', '!0J4XJ4u^W', 'Ana', 'Kacung', 'Kusmawati', '088022270808');
INSERT INTO pengguna VALUES ('nurdiyantibakidin', 'oktohutapea@example.org', '(5AQGNGgAS', 'Martaka', 'NULL', 'Rajasa', '086259118243');
INSERT INTO pengguna VALUES ('daliminmangunsong', 'cprabowo@example.net', 'rHwRyo8E@6', 'Cawisono', 'NULL', 'Hutapea', '084544872782');
INSERT INTO pengguna VALUES ('onasyiah', 'kenes30@example.org', 'I4rF!xJ$)1', 'Lega', 'NULL', 'Handayani', '080928051379');
INSERT INTO pengguna VALUES ('cagermaryati', 'vivi53@example.com', '0_7JV@)syP', 'Tania', 'Kardi', 'Prasetya', '083782527808');
INSERT INTO pengguna VALUES ('emanpradipta', 'mthamrin@example.net', 'n7EL!Dat#w', 'Kamaria', 'Zulaikha', 'Prabowo', '081850116959');
INSERT INTO pengguna VALUES ('unainggolan', 'pranawa03@example.org', '^a430KUoYE', 'Karja', 'NULL', 'Mandala', '087568512502');
INSERT INTO pengguna VALUES ('nmansur', 'jfujiati@example.com', 'fU2!rRkye%', 'Cahyanto', 'Bancar', 'Situmorang', '082059306046');
INSERT INTO pengguna VALUES ('putiwijayanti', 'capasitompul@example.org', '#goTAzp*Y3', 'Adiarja', 'NULL', 'Mardhiyah', '080925160759');
INSERT INTO pengguna VALUES ('mandasaricemani', 'lanang27@example.org', '5ClvFR9x(R', 'Parman', 'Asmadi', 'Utami', '089449762074');
INSERT INTO pengguna VALUES ('anastasia00', 'bagiya49@example.net', '3GY6(qlv%b', 'Paiman', 'Digdaya', 'Waskita', '083615110502');
INSERT INTO pengguna VALUES ('maliktarihoran', 'queen45@example.com', '!f$NuwNw&9', 'Laila', 'Baktiono', 'Pratiwi', '086905787710');
INSERT INTO pengguna VALUES ('budiwahyuni', 'kaylakusumo@example.net', '_78TzfmRTz', 'Samsul', 'Kalim', 'Natsir', '088640811551');
INSERT INTO pengguna VALUES ('dtarihoran', 'purwantiridwan@example.net', 'R)cYYOA3rl', 'Calista', 'NULL', 'Mangunsong', '087028400652');
INSERT INTO pengguna VALUES ('nainggolangambira', 'bharyanto@example.net', '&jX&#!InG4', 'Jasmani', 'NULL', 'Hartati', '088222239507');
INSERT INTO pengguna VALUES ('janesetiawan', 'asirwada67@example.net', 'qE0fCMsow#', 'Nyana', 'NULL', 'Purnawati', '086033452353');
INSERT INTO pengguna VALUES ('calista02', 'embuhlaksmiwati@example.net', '$Th0XqV&_m', 'Ega', 'NULL', 'Waskita', '082675926902');
INSERT INTO pengguna VALUES ('bahuwarnausamah', 'siskamulyani@example.org', '1umQeG)j^&', 'Vino', 'Galak', 'Hassanah', '089062200580');
INSERT INTO pengguna VALUES ('kamaria75', 'xmulyani@example.net', '1@2W$KaktW', 'Daniswara', 'NULL', 'Aryani', '080019922606');
INSERT INTO pengguna VALUES ('nova94', 'janet76@example.org', 'Z7E)D1Xi!L', 'Balangga', 'NULL', 'Farida', '086953258386');
INSERT INTO pengguna VALUES ('asman81', 'sitorusnasim@example.org', '*9#E+q_0u0', 'Gabriella', 'NULL', 'Wacana', '081269516637');
INSERT INTO pengguna VALUES ('ogunawan', 'rahmisuryono@example.com', '#JLTGh+V3f', 'Ade', 'NULL', 'Utami', '086363769144');
INSERT INTO pengguna VALUES ('pertiwipadma', 'gaduhwulandari@example.com', 'tC66PRNsa!', 'Adiarja', 'Bahuwarna', 'Hardiansyah', '088580997340');
INSERT INTO pengguna VALUES ('elma58', 'suartinipadma@example.com', 'B$x*q$BtJ4', 'Cahyo', 'NULL', 'Ramadan', '089561802606');
INSERT INTO pengguna VALUES ('mamankusmawati', 'lmanullang@example.com', '(EMQLqlf1G', 'Wahyu', 'NULL', 'Marpaung', '086617972257');
INSERT INTO pengguna VALUES ('pardi35', 'emankusumo@example.net', '^MAe^Jfn20', 'Bagiya', 'Wirda', 'Zulkarnain', '086294815525');
INSERT INTO pengguna VALUES ('mumpuni16', 'galiono58@example.com', '(AMzDwPxx2', 'Nasab', 'NULL', 'Oktaviani', '087803429546');
INSERT INTO pengguna VALUES ('mutiayuniar', 'santosoyunita@example.net', 'k2McN(LV)O', 'Dariati', 'Zamira', 'Yuliarti', '080486064635');
INSERT INTO pengguna VALUES ('yuniarganda', 'qsudiati@example.org', '*I0K$FlaH6', 'Ciaobella', 'NULL', 'Narpati', '082219520696');
INSERT INTO pengguna VALUES ('ppuspasari', 'qkusmawati@example.org', 'A$8LLfTI&N', 'Kawaya', 'NULL', 'Mayasari', '087116882223');
INSERT INTO pengguna VALUES ('widiastutiendra', 'adityafirmansyah@example.com', '(uT9DP!woB', 'Dacin', 'NULL', 'Mandala', '082308275945');
INSERT INTO pengguna VALUES ('samosirkarimah', 'vprasetyo@example.com', 'vgN&E2HjHP', 'Cici', 'Mahmud', 'Iswahyudi', '081642585826');
INSERT INTO pengguna VALUES ('gsuryono', 'hsiregar@example.com', '1wOHGGxy#5', 'Kala', 'NULL', 'Tamba', '088436567846');
INSERT INTO pengguna VALUES ('lasmonomaryati', 'iswahyudiwarsa@example.com', '3#N2C(bE&$', 'Luthfi', 'NULL', 'Laksita', '086122099813');
INSERT INTO pengguna VALUES ('carubhastuti', 'adenurdiyanti@example.net', 'u41N!Ryfw&', 'Daruna', 'Nurul', 'Sudiati', '089981492610');
INSERT INTO pengguna VALUES ('jailanikenes', 'megantarapuspa@example.net', 'yB6PTGsP#1', 'Dina', 'Cengkal', 'Ramadan', '080157517594');
INSERT INTO pengguna VALUES ('pratiwicornelia', 'jarwa73@example.com', 'f!AiLJ6o*6', 'Kacung', 'NULL', 'Waluyo', '087328818202');
INSERT INTO pengguna VALUES ('limarmaryati', 'halimgalak@example.com', '+s5TOz$w!D', 'Yani', 'NULL', 'Irawan', '088693764092');
INSERT INTO pengguna VALUES ('omaryadi', 'kwijayanti@example.org', 'O7BgB%hq)a', 'Dalima', 'NULL', 'Namaga', '086279061965');
INSERT INTO pengguna VALUES ('knababan', 'ifa57@example.com', '_*h5HMOsec', 'Wani', 'NULL', 'Sirait', '083870791487');
INSERT INTO pengguna VALUES ('rahmiardianto', 'febiyuniar@example.com', '%Wgh3RE&r6', 'Kamaria', 'NULL', 'Zulkarnain', '088674238524');
INSERT INTO pengguna VALUES ('darmaji97', 'ismail66@example.net', '(5+YT%HNBs', 'Gaiman', 'NULL', 'Hastuti', '089271176968');
INSERT INTO pengguna VALUES ('aswanilazuardi', 'cprayoga@example.net', '%F42MdDS+O', 'Titi', 'NULL', 'Mansur', '081473142512');
INSERT INTO pengguna VALUES ('qhidayat', 'nurdiyanticakrawala@example.net', 'o4#n7Bbq2d', 'Malik', 'NULL', 'Januar', '080298300689');
INSERT INTO pengguna VALUES ('ianhastuti', 'edi48@example.net', 'A!w#X1VkyP', 'Mursinin', 'NULL', 'Pudjiastuti', '087178551033');
INSERT INTO pengguna VALUES ('hutapeamaimunah', 'lsinaga@example.com', '9@6VwyBy$9', 'Cindy', 'Faizah', 'Wasita', '087443075851');
INSERT INTO pengguna VALUES ('randriani', 'jonosihotang@example.net', '*0$eNW&d7)', 'Michelle', 'NULL', 'Hakim', '081496356234');
INSERT INTO pengguna VALUES ('betaniasuryono', 'respati67@example.net', 'E62W_Sq#!m', 'Raden', 'NULL', 'Maheswara', '083754692165');
INSERT INTO pengguna VALUES ('jumarinovitasari', 'artanto73@example.org', 'GGQ&2RMq!h', 'Edi', 'NULL', 'Prastuti', '088735564564');
INSERT INTO pengguna VALUES ('urajata', 'manullanglidya@example.org', '+PBLLyi)Y3', 'Rudi', 'NULL', 'Situmorang', '081741725325');
INSERT INTO pengguna VALUES ('citra42', 'kuswandariheru@example.net', 'KN9PjDZG&5', 'Unjani', 'Nasrullah', 'Utama', '087316678799');
INSERT INTO pengguna VALUES ('dian28', 'michellemaryati@example.net', '(L7KixL^2*', 'Harja', 'Setya', 'Pratama', '083684735801');
INSERT INTO pengguna VALUES ('oni40', 'damanikolivia@example.org', 'gp%3(MpV8g', 'Puput', 'Ganjaran', 'Wijayanti', '087563609061');
INSERT INTO pengguna VALUES ('padmarahayu', 'orahmawati@example.org', '#Z!P0NttXe', 'Gatot', 'NULL', 'Mandasari', '084352125030');
INSERT INTO pengguna VALUES ('kayun17', 'darijanmulyani@example.com', 'J(ui6mTojo', 'Yono', 'NULL', 'Sudiati', '080680219931');
INSERT INTO pengguna VALUES ('cici81', 'gunartoolivia@example.org', '#NNY_emh41', 'Karna', 'Kusuma', 'Kusumo', '087308961823');
INSERT INTO pengguna VALUES ('iwaskita', 'hassanahhalima@example.org', '(2UMg3cqpQ', 'Ira', 'NULL', 'Salahudin', '083667063609');
INSERT INTO pengguna VALUES ('dartonositorus', 'sinagaelvin@example.com', '31ClQ^Kj)S', 'Eko', 'NULL', 'Mayasari', '084095557298');
INSERT INTO pengguna VALUES ('ega12', 'bagiyawinarno@example.net', '1TEVfcmh)M', 'Septi', 'NULL', 'Wacana', '081411402926');
INSERT INTO pengguna VALUES ('prayogakartika', 'kusmawatidarman@example.com', '&Py9#FHrhr', 'Pranawa', 'Opan', 'Siregar', '083953688181');
INSERT INTO pengguna VALUES ('bakiantokuswandari', 'prasetyasuwarno@example.net', 'ez7G0Kay)q', 'Malik', 'NULL', 'Zulaika', '087187727852');
INSERT INTO pengguna VALUES ('jaya34', 'gastirahmawati@example.com', 'Y_3T6keWs*', 'Okto', 'NULL', 'Wibowo', '086461985373');
INSERT INTO pengguna VALUES ('namagaamelia', 'langgengwibisono@example.com', '(322nLn69N', 'Nurul', 'NULL', 'Prayoga', '085760708673');
INSERT INTO pengguna VALUES ('kasiransusanti', 'jsaragih@example.com', '*5yHP@aPwv', 'Banara', 'NULL', 'Sitorus', '086347723745');
INSERT INTO pengguna VALUES ('cemplunk96', 'kasiyahsuryatmi@example.net', 'tV4J4Ofg8$', 'Bakda', 'NULL', 'Kuswoyo', '087928134810');

INSERT INTO pengunjung VALUES ('rajatacalista', 'Jalan Pasteur No. 949, Ambon, Jawa Tengah 90622', '1997-04-24');
INSERT INTO pengunjung VALUES ('nsihotang', 'Jl. Erlangga No. 73, Tangerang, Kalimantan Selatan 57458', '2004-05-14');
INSERT INTO pengunjung VALUES ('hestihassanah', 'Gang Cikutra Timur No. 619, Pematangsiantar, JB 26483', '1976-05-26');
INSERT INTO pengunjung VALUES ('atmajasuryatmi', 'Gang Sukabumi No. 0, Meulaboh, Papua Barat 89204', '2006-04-12');
INSERT INTO pengunjung VALUES ('catur59', 'Gg. Laswi No. 11, Bitung, SS 20333', '1970-10-14');
INSERT INTO pengunjung VALUES ('wijayacemplunk', 'Jl. Ahmad Dahlan No. 371, Bengkulu, SS 93898', '2006-07-28');
INSERT INTO pengunjung VALUES ('wijayaheru', 'Gang KH Amin Jasuta No. 9, Malang, NT 03738', '1978-09-28');
INSERT INTO pengunjung VALUES ('haryanticandrakanta', 'Gg. Waringin No. 944, Magelang, Maluku 91759', '2006-08-06');
INSERT INTO pengunjung VALUES ('zfirmansyah', 'Gg. Moch. Toha No. 742, Ternate, Jawa Tengah 85515', '1977-05-08');
INSERT INTO pengunjung VALUES ('awastuti', 'Gang Suniaraja No. 271, Sorong, Jawa Tengah 97529', '1974-06-04');
INSERT INTO pengunjung VALUES ('dartono24', 'Jl. Jamika No. 786, Bandung, MA 91511', '1997-12-12');
INSERT INTO pengunjung VALUES ('mandalagada', 'Jl. Rawamangun No. 94, Cilegon, Kalimantan Utara 98273', '1965-03-17');
INSERT INTO pengunjung VALUES ('liman61', 'Jl. Kutai No. 2, Bima, Kepulauan Riau 49794', '2003-09-01');
INSERT INTO pengunjung VALUES ('hpuspita', 'Jl. Cihampelas No. 554, Meulaboh, BA 33192', '1981-03-06');
INSERT INTO pengunjung VALUES ('pratamapadmi', 'Jalan Pasir Koja No. 98, Tarakan, Nusa Tenggara Barat 34174', '1980-06-07');
INSERT INTO pengunjung VALUES ('margana08', 'Gg. Ir. H. Djuanda No. 06, Banjarbaru, LA 79983', '1975-03-22');
INSERT INTO pengunjung VALUES ('pertiwicemeti', 'Gg. Pasir Koja No. 774, Blitar, Sumatera Barat 20354', '1971-09-30');
INSERT INTO pengunjung VALUES ('dwinarno', 'Gang Wonoayu No. 3, Padang Sidempuan, Jawa Barat 35772', '1988-05-27');
INSERT INTO pengunjung VALUES ('rikasinaga', 'Gang Indragiri No. 187, Bengkulu, AC 73616', '1968-03-17');
INSERT INTO pengunjung VALUES ('wijayatirtayasa', 'Gang Ahmad Dahlan No. 850, Ambon, JK 57335', '2003-03-15');
INSERT INTO pengunjung VALUES ('ghutasoit', 'Gg. Surapati No. 101, Tebingtinggi, KT 81841', '1971-04-12');
INSERT INTO pengunjung VALUES ('adiarjaputra', 'Jl. Jend. A. Yani No. 22, Kota Administrasi Jakarta Selatan, JI 90860', '1972-08-29');
INSERT INTO pengunjung VALUES ('galar62', 'Gg. Laswi No. 63, Sukabumi, Sumatera Selatan 26096', '2005-04-23');
INSERT INTO pengunjung VALUES ('prayogatirtayasa', 'Gang Waringin No. 7, Malang, Kepulauan Riau 23750', '1989-08-24');
INSERT INTO pengunjung VALUES ('nyanahariyah', 'Jl. Dr. Djunjunan No. 82, Meulaboh, NB 07677', '1989-05-03');
INSERT INTO pengunjung VALUES ('uli00', 'Jl. Rajiman No. 188, Singkawang, Kepulauan Riau 16087', '1987-08-20');
INSERT INTO pengunjung VALUES ('karimahnurdiyanti', 'Gang Cihampelas No. 8, Batam, Banten 56663', '1983-08-01');
INSERT INTO pengunjung VALUES ('azalea07', 'Gg. KH Amin Jasuta No. 72, Tangerang, SN 99478', '1989-06-20');
INSERT INTO pengunjung VALUES ('ekopertiwi', 'Gg. BKR No. 77, Batam, KI 36095', '1974-12-05');
INSERT INTO pengunjung VALUES ('pradiptarahmi', 'Jl. Jend. Sudirman No. 0, Sungai Penuh, Kalimantan Barat 86624', '1991-04-26');
INSERT INTO pengunjung VALUES ('mursitasantoso', 'Jl. Ronggowarsito No. 117, Tegal, MA 60945', '1995-09-14');
INSERT INTO pengunjung VALUES ('nurdiyantibakidin', 'Jalan Erlangga No. 4, Metro, DI Yogyakarta 00150', '1984-05-11');
INSERT INTO pengunjung VALUES ('daliminmangunsong', 'Jl. Wonoayu No. 292, Sungai Penuh, JK 08211', '1968-10-03');
INSERT INTO pengunjung VALUES ('onasyiah', 'Gg. Bangka Raya No. 177, Probolinggo, Gorontalo 56821', '2006-12-12');
INSERT INTO pengunjung VALUES ('cagermaryati', 'Gg. Soekarno Hatta No. 5, Lhokseumawe, Kalimantan Utara 29654', '1988-04-29');
INSERT INTO pengunjung VALUES ('emanpradipta', 'Jl. Ir. H. Djuanda No. 32, Binjai, SB 24420', '1976-01-11');
INSERT INTO pengunjung VALUES ('unainggolan', 'Jl. S. Parman No. 24, Depok, JA 56146', '2002-03-28');
INSERT INTO pengunjung VALUES ('nmansur', 'Jalan Suniaraja No. 684, Kota Administrasi Jakarta Selatan, BT 15604', '1979-09-28');
INSERT INTO pengunjung VALUES ('putiwijayanti', 'Jalan Jend. A. Yani No. 39, Padang Sidempuan, Lampung 40092', '1986-09-23');
INSERT INTO pengunjung VALUES ('mandasaricemani', 'Jl. BKR No. 8, Palu, Sulawesi Tengah 55106', '1989-01-22');
INSERT INTO pengunjung VALUES ('anastasia00', 'Gg. Kutisari Selatan No. 397, Tomohon, Riau 26673', '1981-07-04');
INSERT INTO pengunjung VALUES ('maliktarihoran', 'Gg. K.H. Wahid Hasyim No. 242, Kota Administrasi Jakarta Pusat, Sumatera Utara 58677', '1972-06-22');
INSERT INTO pengunjung VALUES ('budiwahyuni', 'Gang Peta No. 98, Payakumbuh, SS 64600', '1992-07-08');
INSERT INTO pengunjung VALUES ('dtarihoran', 'Jl. Yos Sudarso No. 6, Purwokerto, Sulawesi Utara 87929', '1966-01-05');
INSERT INTO pengunjung VALUES ('nainggolangambira', 'Gang Cikutra Timur No. 129, Sorong, JB 57274', '1997-09-28');
INSERT INTO pengunjung VALUES ('janesetiawan', 'Gg. Monginsidi No. 68, Lhokseumawe, JB 21530', '1966-02-23');
INSERT INTO pengunjung VALUES ('calista02', 'Jl. HOS. Cokroaminoto No. 7, Salatiga, BB 45275', '1967-03-22');
INSERT INTO pengunjung VALUES ('bahuwarnausamah', 'Jl. Rajawali Timur No. 4, Denpasar, AC 66316', '1982-06-20');
INSERT INTO pengunjung VALUES ('kamaria75', 'Gang Ir. H. Djuanda No. 36, Kota Administrasi Jakarta Timur, YO 75547', '1987-09-11');
INSERT INTO pengunjung VALUES ('nova94', 'Jalan Sadang Serang No. 721, Tegal, Maluku Utara 15245', '1972-03-31');

INSERT INTO dokter_hewan VALUES ('asman81', 'STR-1655-4503');
INSERT INTO dokter_hewan VALUES ('ogunawan', 'STR-4228-2731');
INSERT INTO dokter_hewan VALUES ('pertiwipadma', 'STR-8410-6167');
INSERT INTO dokter_hewan VALUES ('elma58', 'STR-7220-1216');
INSERT INTO dokter_hewan VALUES ('mamankusmawati', 'STR-9141-9913');
INSERT INTO dokter_hewan VALUES ('pardi35', 'STR-4628-7452');
INSERT INTO dokter_hewan VALUES ('mumpuni16', 'STR-6422-1385');
INSERT INTO dokter_hewan VALUES ('mutiayuniar', 'STR-7158-6470');
INSERT INTO dokter_hewan VALUES ('yuniarganda', 'STR-2527-3312');
INSERT INTO dokter_hewan VALUES ('ppuspasari', 'STR-7615-3152');
INSERT INTO dokter_hewan VALUES ('widiastutiendra', 'STR-3398-5759');
INSERT INTO dokter_hewan VALUES ('samosirkarimah', 'STR-7844-0992');
INSERT INTO dokter_hewan VALUES ('gsuryono', 'STR-4388-1472');
INSERT INTO dokter_hewan VALUES ('lasmonomaryati', 'STR-1078-8899');
INSERT INTO dokter_hewan VALUES ('carubhastuti', 'STR-8665-9535');

INSERT INTO spesialisasi VALUES ('pardi35', 'Neurologi');
INSERT INTO spesialisasi VALUES ('mumpuni16', 'Reproduksi');
INSERT INTO spesialisasi VALUES ('mutiayuniar', 'Kardiologi');
INSERT INTO spesialisasi VALUES ('yuniarganda', 'Penyakit Dalam');
INSERT INTO spesialisasi VALUES ('ppuspasari', 'Penyakit Dalam');
INSERT INTO spesialisasi VALUES ('widiastutiendra', 'Reproduksi');
INSERT INTO spesialisasi VALUES ('samosirkarimah', 'Onkologi');
INSERT INTO spesialisasi VALUES ('gsuryono', 'Dermatologi');
INSERT INTO spesialisasi VALUES ('lasmonomaryati', 'Ortopedi');
INSERT INTO spesialisasi VALUES ('carubhastuti', 'Kardiologi');

INSERT INTO penjaga_hewan VALUES ('jailanikenes', '99fb8a9d-66d8-4891-b7b2-449a63e589cb');
INSERT INTO penjaga_hewan VALUES ('pratiwicornelia', '21c8e648-b97f-440d-bf06-0b5cd941e898');
INSERT INTO penjaga_hewan VALUES ('limarmaryati', '522f6635-0fff-435e-ae0c-2af2e274ae26');
INSERT INTO penjaga_hewan VALUES ('omaryadi', 'b4455acd-1016-4d53-beea-2eaf43660f54');
INSERT INTO penjaga_hewan VALUES ('knababan', '16f05a6c-b489-4075-b003-3d5789e4e88d');
INSERT INTO penjaga_hewan VALUES ('rahmiardianto', 'fd93a8c8-517d-44c9-a37e-23d2ddaf2ecd');
INSERT INTO penjaga_hewan VALUES ('darmaji97', 'afd1fd19-45bb-4976-9793-115ea13edb44');
INSERT INTO penjaga_hewan VALUES ('aswanilazuardi', 'dffc274b-15e8-4b9b-a69e-210f318e8fa1');
INSERT INTO penjaga_hewan VALUES ('qhidayat', 'fedb2b27-87ec-47b7-bcc9-c6978125630f');
INSERT INTO penjaga_hewan VALUES ('ianhastuti', '3cc2fafb-c387-4105-92e2-e5c0ebbf4409');

INSERT INTO pelatih_hewan VALUES ('hutapeamaimunah', '1cfbdc7e-b079-49ee-b39e-ce6590a83877');
INSERT INTO pelatih_hewan VALUES ('randriani', '34359852-88ca-478a-ab46-2af1b64b413d');
INSERT INTO pelatih_hewan VALUES ('betaniasuryono', '5a57933d-813e-48be-aa26-a5935b719b63');
INSERT INTO pelatih_hewan VALUES ('jumarinovitasari', 'ac58e210-95d6-4eee-90de-7400105d2493');
INSERT INTO pelatih_hewan VALUES ('urajata', '458dd76e-e2e5-438c-9c28-04bea2aa7218');
INSERT INTO pelatih_hewan VALUES ('citra42', '710b9627-718d-48cf-b249-7a9929630133');
INSERT INTO pelatih_hewan VALUES ('dian28', '35502314-9c38-42b0-aa1e-bb51c2e2eaca');
INSERT INTO pelatih_hewan VALUES ('oni40', '1cb101a3-ed8f-4334-b4f7-70a28e75fc05');
INSERT INTO pelatih_hewan VALUES ('padmarahayu', '608b1e9a-6923-4c0f-b425-225f9abb5c93');
INSERT INTO pelatih_hewan VALUES ('kayun17', 'be1319d1-81ac-4775-8358-47534d97d9b0');

INSERT INTO staf_admin VALUES ('cici81', '1a2b3c4d-0001-0000-0000-000000000001');
INSERT INTO staf_admin VALUES ('iwaskita', '1a2b3c4d-0002-0000-0000-000000000002');
INSERT INTO staf_admin VALUES ('dartonositorus', '1a2b3c4d-0003-0000-0000-000000000003');
INSERT INTO staf_admin VALUES ('ega12', '1a2b3c4d-0004-0000-0000-000000000004');
INSERT INTO staf_admin VALUES ('prayogakartika', '1a2b3c4d-0005-0000-0000-000000000005');
INSERT INTO staf_admin VALUES ('bakiantokuswandari', '1a2b3c4d-0006-0000-0000-000000000006');
INSERT INTO staf_admin VALUES ('jaya34', '1a2b3c4d-0007-0000-0000-000000000007');
INSERT INTO staf_admin VALUES ('namagaamelia', '1a2b3c4d-0008-0000-0000-000000000008');
INSERT INTO staf_admin VALUES ('kasiransusanti', '1a2b3c4d-0009-0000-0000-000000000009');
INSERT INTO staf_admin VALUES ('cemplunk96', '1a2b3c4d-0010-0000-0000-000000000010');

INSERT INTO habitat VALUES ('Padang Pasir', 5000.00, 10, 'Aktif');
INSERT INTO habitat VALUES ('Sabana Afrika', 7500.50, 15, 'Aktif');
INSERT INTO habitat VALUES ('Hutan Hujan Tropis', 6200.75, 12, 'Renovasi');
INSERT INTO habitat VALUES ('Pegunungan Alpen', 4200.00, 8, 'Aktif');
INSERT INTO habitat VALUES ('Danau Arktik', 3100.30, 6, 'Aktif');
INSERT INTO habitat VALUES ('Lembah Amazon', 9100.00, 20, 'Aktif');
INSERT INTO habitat VALUES ('Hutan Bambu', 2800.20, 7, 'Penuh');
INSERT INTO habitat VALUES ('Rawa Kalimantan', 3900.00, 9, 'Aktif');

INSERT INTO hewan VALUES ('d84d43b2-441d-450d-b58e-12fbbf49c88c', 'Simba', 'Singa', 'Padang Pasir', '2017-03-12', 'Sehat', 'Padang Pasir', 'https://example.com/simba.jpg');
INSERT INTO hewan VALUES ('b2a95b99-5821-45b7-b493-17b79d914ef5', 'Luna', 'Kucing', 'Sabana Afrika', '2019-07-23', 'Sedang Sakit', 'Sabana Afrika', 'https://example.com/luna.jpg');
INSERT INTO hewan VALUES ('98b765a7-6a04-4b3d-b118-c8f26d72e433', 'Rex', 'Anjing', 'Pegunungan Alpen', '2018-01-09', 'Sehat', 'Pegunungan Alpen', 'https://example.com/rex.jpg');
INSERT INTO hewan VALUES ('b8c4d74f-239f-4e16-a109-f24b263eb4e5', 'Kiko', 'Kucing', 'Danau Arktik', '2020-04-10', 'Sehat', 'Danau Arktik', 'https://example.com/kiko.jpg');
INSERT INTO hewan VALUES ('cfbd3c9b-4733-4a9f-8a37-d85a1ea38d2b', 'Panda', 'Panda', 'Lembah Amazon', '2015-08-30', 'Sedang Sakit', 'Lembah Amazon', 'https://example.com/panda.jpg');
INSERT INTO hewan VALUES ('1787f195-1111-4e53-8a7d-dfded104abef', 'Rocky', 'Anjing', 'Rawa Kalimantan', '2016-11-12', 'Sehat', 'Rawa Kalimantan', 'https://example.com/rocky.jpg');
INSERT INTO hewan VALUES ('054e0e4d-9b2b-45ae-88d7-3cf983849953', 'Benny', 'Bebek', 'Sabana Afrika', '2020-02-25', 'Sehat', 'Sabana Afrika', 'https://example.com/benny.jpg');
INSERT INTO hewan VALUES ('003417f2-cf99-4dff-b42b-4167e5a09a31', 'Toby', 'Kelinci', 'Hutan Hujan Tropis', '2017-09-10', 'Sehat', 'Hutan Hujan Tropis', 'https://example.com/toby.jpg');
INSERT INTO hewan VALUES ('d3f0c021-bb7f-44e9-a31f-2304ef6b34a0', 'Zara', 'Kuda', 'Pegunungan Alpen', '2018-12-01', 'Sedang Sakit', 'Pegunungan Alpen', 'https://example.com/zara.jpg');
INSERT INTO hewan VALUES ('54dbb957-d7b1-4094-8084-9a2a33a4f7be', 'Max', 'Anjing', 'Rawa Kalimantan', '2019-06-15', 'Sehat', 'Rawa Kalimantan', 'https://example.com/max.jpg');
INSERT INTO hewan VALUES ('54dbb957-d7b1-4094-8084-9a2a33a4f7a1', 'Verstappen', 'Singa', 'Belanda', '2021-12-12', 'Sehat', 'Padang Pasir', 'https://ichef.bbci.co.uk/ace/standard/624/cpsprodpb/14F6/production/_122066350_verstappenwintitleafterlast-lapovertake.jpg.webp');
INSERT INTO hewan VALUES ('a7c32b91-5e4d-4c8f-9a76-82b4c1f6e0d7', 'Milo', 'Hamster', 'Hutan Bambu', '2021-05-20', 'Sehat', 'Hutan Bambu', 'https://example.com/milo.jpg');
INSERT INTO hewan VALUES ('f9e86b23-1d45-4a8c-b6d3-28e97f10a5c8', 'Bella', 'Kucing', 'Padang Pasir', '2019-11-08', 'Sehat', 'Padang Pasir', 'https://example.com/bella.jpg');
INSERT INTO hewan VALUES ('c4d82e7a-3b19-47f5-96a0-e81c5b7d2a09', 'Leo', 'Harimau', 'Hutan Hujan Tropis', '2016-07-14', 'Sedang Sakit', 'Hutan Hujan Tropis', 'https://example.com/leo.jpg');
INSERT INTO hewan VALUES ('e5f12a8b-9c34-48d6-b1e7-3a94c7d08f16', 'Coco', 'Burung', 'Lembah Amazon', '2020-09-03', 'Sehat', 'Lembah Amazon', 'https://example.com/coco.jpg');
INSERT INTO hewan VALUES ('7b13d6c9-e82f-4a05-93b8-562d1c48e0a5', 'Charlie', 'Kelinci', 'Sabana Afrika', '2018-03-27', 'Sehat', 'Sabana Afrika', 'https://example.com/charlie.jpg');
INSERT INTO hewan VALUES ('08f94d2e-7c51-4639-8a2b-5d31e9c0f7b4', 'Mochi', 'Hamster', 'Padang Pasir', '2022-01-15', 'Sehat', 'Padang Pasir', 'https://example.com/mochi.jpg');
INSERT INTO hewan VALUES ('3a6b8c1d-2e9f-40a7-b5d3-7c6e9a8f0d2b', 'Nala', 'Singa', 'Sabana Afrika', '2017-12-18', 'Sedang Sakit', 'Sabana Afrika', 'https://example.com/nala.jpg');
INSERT INTO hewan VALUES ('b5d9c7e6-0f4a-48b2-91c3-6e8d7a5f2c1b', 'Ollie', 'Burung Hantu', 'Hutan Bambu', '2019-02-11', 'Sehat', 'Hutan Bambu', 'https://example.com/ollie.jpg');
INSERT INTO hewan VALUES ('4f8e7d6c-5b9a-48c3-b1d2-e3f4a5b6c7d8', 'Buddy', 'Anjing', 'Pegunungan Alpen', '2016-05-22', 'Sehat', 'Pegunungan Alpen', 'https://example.com/buddy.jpg');
INSERT INTO hewan VALUES ('c9b8a7d6-e5f4-4321-b0a9-c8d7e6f5a4b3', 'Ruby', 'Ikan', 'Danau Arktik', '2020-08-14', 'Sehat', 'Danau Arktik', 'https://example.com/ruby.jpg');
INSERT INTO hewan VALUES ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Jasper', 'Kucing', 'Rawa Kalimantan', '2018-10-30', 'Sedang Sakit', 'Rawa Kalimantan', 'https://example.com/jasper.jpg');
INSERT INTO hewan VALUES ('7f6e5d4c-3b2a-1987-6543-2f1e0d9c8b7a', 'Daisy', 'Kelinci', 'Hutan Bambu', '2021-02-19', 'Sehat', 'Hutan Bambu', 'https://example.com/daisy.jpg');
INSERT INTO hewan VALUES ('a9b8c7d6-e5f4-3210-9876-5a4b3c2d1e0f', 'Thor', 'Anjing', 'Lembah Amazon', '2017-04-05', 'Sehat', 'Lembah Amazon', 'https://example.com/thor.jpg');
INSERT INTO hewan VALUES ('2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a', 'Ginger', 'Kucing', 'Sabana Afrika', '2019-09-22', 'Sehat', 'Sabana Afrika', 'https://example.com/ginger.jpg');
INSERT INTO hewan VALUES ('e483f973-6313-43f4-9b14-ad0c7244f906', 'Oscar', 'Burung', 'Padang Pasir', '2020-11-17', 'Sedang Sakit', 'Padang Pasir', 'https://example.com/oscar.jpg');
INSERT INTO hewan VALUES ('82c2489c-b578-40c5-8bc3-f5100d11077b', 'Honey', 'Hamster', 'Rawa Kalimantan', '2021-07-28', 'Sehat', 'Rawa Kalimantan', 'https://example.com/honey.jpg');
INSERT INTO hewan VALUES ('2558cd3c-77fa-49f5-8916-f16ca422256a', 'Shadow', 'Anjing', 'Pegunungan Alpen', '2016-08-09', 'Sehat', 'Pegunungan Alpen', 'https://example.com/shadow.jpg');
INSERT INTO hewan VALUES ('398638ba-97de-4950-83bb-1ec84321498a', 'Whiskers', 'Kucing', 'Danau Arktik', '2018-06-14', 'Sedang Sakit', 'Danau Arktik', 'https://example.com/whiskers.jpg');
INSERT INTO hewan VALUES ('c84949f2-643a-4441-b982-c9dae4915925', 'Pebbles', 'Ikan', 'Danau Arktik', '2022-03-05', 'Sehat', 'Danau Arktik', 'https://example.com/pebbles.jpg');
INSERT INTO hewan VALUES ('1423e956-7c56-468c-82b1-9bc09e09e7ba', 'Ziggy', 'Iguana', 'Hutan Hujan Tropis', '2017-10-26', 'Sehat', 'Hutan Hujan Tropis', 'https://example.com/ziggy.jpg');
INSERT INTO hewan VALUES ('9b8720a0-2f01-44ab-b1dc-77ecdd5f8cf4', 'Lily', 'Kelinci', 'Hutan Bambu', '2019-01-31', 'Sehat', 'Hutan Bambu', 'https://example.com/lily.jpg');
INSERT INTO hewan VALUES ('cbe5f585-2fbd-4028-b16e-50c09eea4f2e', 'Bruno', 'Beruang', 'Lembah Amazon', '2018-07-19', 'Sedang Sakit', 'Lembah Amazon', 'https://example.com/bruno.jpg');
INSERT INTO hewan VALUES ('c028299e-0d9d-4b4e-b74a-53d1d4844ba6', 'Chloe', 'Kucing', 'Padang Pasir', '2020-12-24', 'Sehat', 'Padang Pasir', 'https://example.com/chloe.jpg');
INSERT INTO hewan VALUES ('08eff11c-7274-42b3-8f86-0dcd6127bacd', 'Cooper', 'Anjing', 'Sabana Afrika', '2017-05-13', 'Sehat', 'Sabana Afrika', 'https://example.com/cooper.jpg');
INSERT INTO hewan VALUES ('1115b2b8-4864-48cd-98b6-626fc8a7c9f1', 'Oreo', 'Hamster', 'Hutan Hujan Tropis', '2021-09-08', 'Sedang Sakit', 'Hutan Hujan Tropis', 'https://example.com/oreo.jpg');
INSERT INTO hewan VALUES ('8dbc79e9-4060-48c7-b7c7-91f4a427aba3', 'Felix', 'Kucing', 'Rawa Kalimantan', '2019-04-17', 'Sehat', 'Rawa Kalimantan', 'https://example.com/felix.jpg');
INSERT INTO hewan VALUES ('ddd9fe0e-6542-4058-bf96-16108751990e', 'Molly', 'Ikan', 'Danau Arktik', '2020-10-11', 'Sehat', 'Danau Arktik', 'https://example.com/molly.jpg');
INSERT INTO hewan VALUES ('6c3c2960-72d7-425e-b758-6a936e1eb109', 'Rusty', 'Rubah', 'Hutan Hujan Tropis', '2018-02-28', 'Sehat', 'Hutan Hujan Tropis', 'https://example.com/rusty.jpg');
INSERT INTO hewan VALUES ('760b277e-5ea7-443c-aa84-0d9e0931d83a', 'Misty', 'Kucing', 'Lembah Amazon', '2019-08-07', 'Sedang Sakit', 'Lembah Amazon', 'https://example.com/misty.jpg');

INSERT INTO catatan_medis VALUES ('d84d43b2-441d-450d-b58e-12fbbf49c88c', 'asman81', '2023-10-05', 'Flu', 'Obat Penurun Panas', 'Sembuh', 'Periksa kembali dalam 1 bulan');
INSERT INTO catatan_medis VALUES ('b2a95b99-5821-45b7-b493-17b79d914ef5', 'ogunawan', '2023-09-22', 'Demam', 'Antibiotik', 'Sembuh', 'Periksa lagi dalam 2 minggu');
INSERT INTO catatan_medis VALUES ('98b765a7-6a04-4b3d-b118-c8f26d72e433', 'pertiwipadma', '2023-07-14', 'Sakit Perut', 'Obat Pencernaan', 'Sembuh', 'Tidak ada tindak lanjut');
INSERT INTO catatan_medis VALUES ('b8c4d74f-239f-4e16-a109-f24b263eb4e5', 'elma58', '2023-08-09', 'Radang Gusi', 'Obat Kumur', 'Sedang Sakit', 'Kontrol dalam 1 minggu');
INSERT INTO catatan_medis VALUES ('cfbd3c9b-4733-4a9f-8a37-d85a1ea38d2b', 'mamankusmawati', '2023-05-30', 'Infeksi Saluran Pernafasan', 'Obat Antibiotik', 'Sembuh', 'Periksa setiap 2 bulan');
INSERT INTO catatan_medis VALUES ('1787f195-1111-4e53-8a7d-dfded104abef', 'pardi35', '2023-12-01', 'Cacingan', 'Obat Cacing', 'Sembuh', 'Tidak ada tindak lanjut');
INSERT INTO catatan_medis VALUES ('054e0e4d-9b2b-45ae-88d7-3cf983849953', 'mumpuni16', '2023-06-18', 'Kutu', 'Obat Kutu', 'Sembuh', 'Periksa dalam 3 minggu');
INSERT INTO catatan_medis VALUES ('003417f2-cf99-4dff-b42b-4167e5a09a31', 'mutiayuniar', '2023-04-25', 'Sakit Kepala', 'Obat Penurun Panas', 'Sembuh', 'Kontrol dalam 1 bulan');
INSERT INTO catatan_medis VALUES ('d3f0c021-bb7f-44e9-a31f-2304ef6b34a0', 'yuniarganda', '2023-11-11', 'Muntah', 'Obat Pencernaan', 'Sembuh', 'Periksa dalam 2 minggu');
INSERT INTO catatan_medis VALUES ('54dbb957-d7b1-4094-8084-9a2a33a4f7be', 'ppuspasari', '2023-07-05', 'Gigi Sakit', 'Obat Kumur', 'Sembuh', 'Tidak ada tindak lanjut');

INSERT INTO pakan VALUES ('d84d43b2-441d-450d-b58e-12fbbf49c88c', '2023-10-01', 'Daging Sapi', 5, 'Tersedia');
INSERT INTO pakan VALUES ('b2a95b99-5821-45b7-b493-17b79d914ef5', '2023-09-22', 'Ikan', 3, 'Tersedia');
INSERT INTO pakan VALUES ('98b765a7-6a04-4b3d-b118-c8f26d72e433', '2023-08-30', 'Sayuran', 2, 'Tersedia');
INSERT INTO pakan VALUES ('b8c4d74f-239f-4e16-a109-f24b263eb4e5', '2023-09-05', 'Daging Ayam', 4, 'Tersedia');
INSERT INTO pakan VALUES ('cfbd3c9b-4733-4a9f-8a37-d85a1ea38d2b', '2023-07-20', 'Roti', 1, 'Tersedia');
INSERT INTO pakan VALUES ('1787f195-1111-4e53-8a7d-dfded104abef', '2023-12-01', 'Wortel', 3, 'Tersedia');
INSERT INTO pakan VALUES ('054e0e4d-9b2b-45ae-88d7-3cf983849953', '2023-11-20', 'Buah-buahan', 2, 'Tersedia');
INSERT INTO pakan VALUES ('003417f2-cf99-4dff-b42b-4167e5a09a31', '2023-10-15', 'Biji-bijian', 4, 'Tersedia');
INSERT INTO pakan VALUES ('d3f0c021-bb7f-44e9-a31f-2304ef6b34a0', '2023-09-18', 'Rumput Segar', 6, 'Tersedia');
INSERT INTO pakan VALUES ('54dbb957-d7b1-4094-8084-9a2a33a4f7be', '2023-08-22', 'Ikan Kecil', 3, 'Tersedia');

INSERT INTO memberi VALUES ('1787f195-1111-4e53-8a7d-dfded104abef', '2023-12-01 10:00:00', 'rahmiardianto');
INSERT INTO memberi VALUES ('054e0e4d-9b2b-45ae-88d7-3cf983849953', '2023-11-20 09:30:00', 'darmaji97');
INSERT INTO memberi VALUES ('003417f2-cf99-4dff-b42b-4167e5a09a31', '2023-10-15 07:45:00', 'aswanilazuardi');
INSERT INTO memberi VALUES ('d3f0c021-bb7f-44e9-a31f-2304ef6b34a0', '2023-09-18 08:15:00', 'qhidayat');
INSERT INTO memberi VALUES ('54dbb957-d7b1-4094-8084-9a2a33a4f7be', '2023-08-22 10:30:00', 'ianhastuti');
INSERT INTO memberi VALUES ('d84d43b2-441d-450d-b58e-12fbbf49c88c', '2023-10-01 08:00:00', 'jailanikenes');
INSERT INTO memberi VALUES ('b2a95b99-5821-45b7-b493-17b79d914ef5', '2023-09-22 07:00:00', 'pratiwicornelia');
INSERT INTO memberi VALUES ('98b765a7-6a04-4b3d-b118-c8f26d72e433', '2023-08-30 08:30:00', 'limarmaryati');
INSERT INTO memberi VALUES ('b8c4d74f-239f-4e16-a109-f24b263eb4e5', '2023-09-05 09:00:00', 'omaryadi');
INSERT INTO memberi VALUES ('cfbd3c9b-4733-4a9f-8a37-d85a1ea38d2b', '2023-07-20 08:45:00', 'knababan');

INSERT INTO fasilitas VALUES ('Kolam Renang', '10:00:00', 50);
INSERT INTO fasilitas VALUES ('Teater Satwa', '13:30:00', 100);
INSERT INTO fasilitas VALUES ('Zona Edukasi', '09:00:00', 30);
INSERT INTO fasilitas VALUES ('Panggung Musik', '16:00:00', 150);
INSERT INTO fasilitas VALUES ('Kebun Mini', '08:00:00', 20);
INSERT INTO fasilitas VALUES ('Galeri Satwa', '11:00:00', 40);
INSERT INTO fasilitas VALUES ('Taman Reptil', '14:00:00', 35);
INSERT INTO fasilitas VALUES ('Pojok Burung', '10:30:00', 25);
INSERT INTO fasilitas VALUES ('Zona Air', '12:00:00', 60);
INSERT INTO fasilitas VALUES ('Zona Tengah', '15:00:00', 80);
INSERT INTO fasilitas VALUES ('Zona Hutan', '09:30:00', 70);
INSERT INTO fasilitas VALUES ('Zona Tropis', '13:00:00', 40);
INSERT INTO fasilitas VALUES ('Zona Hiburan', '11:30:00', 90);

INSERT INTO atraksi VALUES ('Kolam Renang', 'Zona Air');
INSERT INTO atraksi VALUES ('Teater Satwa', 'Zona Edukasi');
INSERT INTO atraksi VALUES ('Zona Edukasi', 'Zona Tengah');
INSERT INTO atraksi VALUES ('Panggung Musik', 'Zona Hiburan');
INSERT INTO atraksi VALUES ('Kebun Mini', 'Zona Anak');
INSERT INTO atraksi VALUES ('Galeri Satwa', 'Zona Edukasi');
INSERT INTO atraksi VALUES ('Taman Reptil', 'Zona Tropis');
INSERT INTO atraksi VALUES ('Pojok Burung', 'Zona Hutan');

INSERT INTO berpartisipasi VALUES ('Kolam Renang', 'd84d43b2-441d-450d-b58e-12fbbf49c88c');
INSERT INTO berpartisipasi VALUES ('Zona Edukasi', 'b2a95b99-5821-45b7-b493-17b79d914ef5');
INSERT INTO berpartisipasi VALUES ('Panggung Musik', '98b765a7-6a04-4b3d-b118-c8f26d72e433');
INSERT INTO berpartisipasi VALUES ('Galeri Satwa', 'b8c4d74f-239f-4e16-a109-f24b263eb4e5');
INSERT INTO berpartisipasi VALUES ('Taman Reptil', 'cfbd3c9b-4733-4a9f-8a37-d85a1ea38d2b');
INSERT INTO berpartisipasi VALUES ('Pojok Burung', '1787f195-1111-4e53-8a7d-dfded104abef');
INSERT INTO berpartisipasi VALUES ('Teater Satwa', '054e0e4d-9b2b-45ae-88d7-3cf983849953');
INSERT INTO berpartisipasi VALUES ('Kebun Mini', '003417f2-cf99-4dff-b42b-4167e5a09a31');
INSERT INTO berpartisipasi VALUES ('Kolam Renang', 'd3f0c021-bb7f-44e9-a31f-2304ef6b34a0');
INSERT INTO berpartisipasi VALUES ('Zona Edukasi', '54dbb957-d7b1-4094-8084-9a2a33a4f7be');

INSERT INTO jadwal_pemeriksaan_kesehatan VALUES ('d84d43b2-441d-450d-b58e-12fbbf49c88c', '2024-06-01', 3);
INSERT INTO jadwal_pemeriksaan_kesehatan VALUES ('b2a95b99-5821-45b7-b493-17b79d914ef5', '2024-06-05', 6);
INSERT INTO jadwal_pemeriksaan_kesehatan VALUES ('98b765a7-6a04-4b3d-b118-c8f26d72e433', '2024-06-10', 4);
INSERT INTO jadwal_pemeriksaan_kesehatan VALUES ('b8c4d74f-239f-4e16-a109-f24b263eb4e5', '2024-06-12', 9);
INSERT INTO jadwal_pemeriksaan_kesehatan VALUES ('cfbd3c9b-4733-4a9f-8a37-d85a1ea38d2b', '2024-06-15', 3);
INSERT INTO jadwal_pemeriksaan_kesehatan VALUES ('1787f195-1111-4e53-8a7d-dfded104abef', '2024-06-17', 6);
INSERT INTO jadwal_pemeriksaan_kesehatan VALUES ('054e0e4d-9b2b-45ae-88d7-3cf983849953', '2024-06-19', 9);
INSERT INTO jadwal_pemeriksaan_kesehatan VALUES ('003417f2-cf99-4dff-b42b-4167e5a09a31', '2024-06-21', 4);
INSERT INTO jadwal_pemeriksaan_kesehatan VALUES ('d3f0c021-bb7f-44e9-a31f-2304ef6b34a0', '2024-06-23', 3);
INSERT INTO jadwal_pemeriksaan_kesehatan VALUES ('54dbb957-d7b1-4094-8084-9a2a33a4f7be', '2024-06-25', 6);

INSERT INTO jadwal_penugasan VALUES ('hutapeamaimunah', '2025-05-30 08:00:00', 'Kolam Renang');
INSERT INTO jadwal_penugasan VALUES ('randriani', '2025-06-01 09:00:00', 'Teater Satwa');
INSERT INTO jadwal_penugasan VALUES ('betaniasuryono', '2025-06-02 10:00:00', 'Zona Edukasi');
INSERT INTO jadwal_penugasan VALUES ('jumarinovitasari', '2025-06-02 13:00:00', 'Panggung Musik');
INSERT INTO jadwal_penugasan VALUES ('urajata', '2024-05-03 08:30:00', 'Kebun Mini');
INSERT INTO jadwal_penugasan VALUES ('citra42', '2024-05-03 11:00:00', 'Galeri Satwa');
INSERT INTO jadwal_penugasan VALUES ('dian28', '2024-05-04 09:30:00', 'Taman Reptil');
INSERT INTO jadwal_penugasan VALUES ('oni40', '2024-05-04 14:00:00', 'Pojok Burung');
INSERT INTO jadwal_penugasan VALUES ('padmarahayu', '2024-05-05 08:00:00', 'Kolam Renang');
INSERT INTO jadwal_penugasan VALUES ('kayun17', '2024-05-05 10:00:00', 'Teater Satwa');

INSERT INTO wahana VALUES ('Zona Air', 'Pengunjung dilarang berlari di area kolam renang.');
INSERT INTO wahana VALUES ('Zona Tengah', 'Dilarang membawa makanan dan minuman ke dalam kolam renang.');
INSERT INTO wahana VALUES ('Zona Hutan', 'Pengunjung dilarang merusak tanaman dan hewan di area hutan.');
INSERT INTO wahana VALUES ('Zona Tropis', 'Pengunjung dilarang memberi makan hewan di luar jam yang ditentukan.');
INSERT INTO wahana VALUES ('Zona Hiburan', 'Pengunjung dilarang merokok di area hiburan.');

INSERT INTO adopter VALUES ('rajatacalista', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 15000000);
INSERT INTO adopter VALUES ('nsihotang', 'c9bf9e57-1685-4c89-bafb-ff5af830be8a', 12500000);
INSERT INTO adopter VALUES ('atmajasuryatmi', '3c3bfa26-d88b-4ab1-998f-1b0d89a99f10', 10750000);
INSERT INTO adopter VALUES ('wijayacemplunk', 'b7b1a6a0-5a2e-4c68-8e37-8d80b5b09159', 8800000);
INSERT INTO adopter VALUES ('haryanticandrakanta', 'f3d3d1e6-0b3a-4b44-92c7-7d6f48a5f46c', 7500000);
INSERT INTO adopter VALUES ('zfirmansyah', 'ae0a5d64-0486-4cc9-850a-f75e3d4e223f', 6200000);
INSERT INTO adopter VALUES ('awastuti', 'b16b00b5-1234-4dbb-9f91-a1f9a1f9a1f9', 5500000);
INSERT INTO adopter VALUES ('dartono24', 'e743ed82-42a5-43a4-9e35-328cd7ff0e09', 4800000);
INSERT INTO adopter VALUES ('mandalagada', 'aab11cc7-317d-42e8-bb91-8fc64517efab', 3900000);
INSERT INTO adopter VALUES ('hpuspita', 'd111b1c5-8e1a-4c0f-bbcd-7f8ccfe7b3e3', 3200000);
INSERT INTO adopter VALUES ('margana08', '11d5b3ec-4513-476e-b5ee-7a9ecb2f13f2', 25000000);
INSERT INTO adopter VALUES ('dwinarno', '6de43d1c-c0c2-4375-8dbf-4e6e1bdfc7b1', 22000000);
INSERT INTO adopter VALUES ('rikasinaga', 'aa79a4e0-2045-4a94-a12e-99c6e2a57e89', 20500000);
INSERT INTO adopter VALUES ('ghutasoit', '3ee5fc0a-bf90-4e19-9a06-9b89cf3df23f', 18000000);
INSERT INTO adopter VALUES ('galar62', '7c57b71e-299f-42a1-8a6a-d0e7c9f4a9f3', 17000000);
INSERT INTO adopter VALUES ('prayogatirtayasa', '20c59ef7-b6a6-48c6-bb8f-98767a8a889f', 16000000);
INSERT INTO adopter VALUES ('uli00', 'ee5984cf-94de-4e7f-a5a6-06b486c9a7c4', 15500000);
INSERT INTO adopter VALUES ('azalea07', 'ff17cc69-d888-4d1b-9765-90ae08b23d85', 14000000);
INSERT INTO adopter VALUES ('ekopertiwi', 'dc21a9e0-3eab-463f-90d0-880f59e34a20', 120000000);
INSERT INTO adopter VALUES ('mursitasantoso', 'fbfd42e5-2b5e-4b8e-b4c1-2a7488c3cbf2', 100000000);

INSERT INTO individu VALUES ('3175091201010001', 'Prasetya Andriani', 'd290f1ee-6c54-4b01-90e6-d701748f0851');
INSERT INTO individu VALUES ('3276012202910002', 'Damar Thamrin', 'c9bf9e57-1685-4c89-bafb-ff5af830be8a');
INSERT INTO individu VALUES ('3402071307990003', 'Gading Nainggolan', '3c3bfa26-d88b-4ab1-998f-1b0d89a99f10');
INSERT INTO individu VALUES ('3578030312010004', 'Drajat Rahmi Nainggolan', 'b7b1a6a0-5a2e-4c68-8e37-8d80b5b09159');
INSERT INTO individu VALUES ('3674042005000005', 'Tira Jais Mangunsong', 'f3d3d1e6-0b3a-4b44-92c7-7d6f48a5f46c');
INSERT INTO individu VALUES ('3204051806880006', 'Praba Wulandari', 'ae0a5d64-0486-4cc9-850a-f75e3d4e223f');
INSERT INTO individu VALUES ('3301062401930007', 'Elon Budiman', 'b16b00b5-1234-4dbb-9f91-a1f9a1f9a1f9');
INSERT INTO individu VALUES ('3175091201010008', 'Silvia Nurdiyanti', 'e743ed82-42a5-43a4-9e35-328cd7ff0e09');
INSERT INTO individu VALUES ('3375060101900009', 'Pardi Lili Siregar', 'aab11cc7-317d-42e8-bb91-8fc64517efab');
INSERT INTO individu VALUES ('3174101012820010', 'Agus Januar', 'd111b1c5-8e1a-4c0f-bbcd-7f8ccfe7b3e3');

INSERT INTO organisasi VALUES ('ORG00001', 'Yayasan Margana Jaya', '11d5b3ec-4513-476e-b5ee-7a9ecb2f13f2');
INSERT INTO organisasi VALUES ('ORG00002', 'Lembaga Dwinarno Mandiri', '6de43d1c-c0c2-4375-8dbf-4e6e1bdfc7b1');
INSERT INTO organisasi VALUES ('ORG00003', 'Rika Sinaga Foundation', 'aa79a4e0-2045-4a94-a12e-99c6e2a57e89');
INSERT INTO organisasi VALUES ('ORG00004', 'Gereja Ghu Tasoit', '3ee5fc0a-bf90-4e19-9a06-9b89cf3df23f');
INSERT INTO organisasi VALUES ('ORG00005', 'Komunitas Galar Peduli', '7c57b71e-299f-42a1-8a6a-d0e7c9f4a9f3');
INSERT INTO organisasi VALUES ('ORG00006', 'Yayasan Tirtayasa Amanah', '20c59ef7-b6a6-48c6-bb8f-98767a8a889f');
INSERT INTO organisasi VALUES ('ORG00007', 'ULI Petcare Group', 'ee5984cf-94de-4e7f-a5a6-06b486c9a7c4');
INSERT INTO organisasi VALUES ('ORG00008', 'Azalea Foster House', 'ff17cc69-d888-4d1b-9765-90ae08b23d85');
INSERT INTO organisasi VALUES ('ORG00009', 'Ekopertiwi Foundation', 'dc21a9e0-3eab-463f-90d0-880f59e34a20');
INSERT INTO organisasi VALUES ('ORG00010', 'Santoso Animal Shelter', 'fbfd42e5-2b5e-4b8e-b4c1-2a7488c3cbf2');

INSERT INTO adopsi VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0851', '98b765a7-6a04-4b3d-b118-c8f26d72e433', 'Lunas', '2025-01-01', '2025-12-31', 1500000);
INSERT INTO adopsi VALUES ('c9bf9e57-1685-4c89-bafb-ff5af830be8a', 'b2a95b99-5821-45b7-b493-17b79d914ef5', 'Belum', '2025-02-01', '2025-12-31', 1250000);
INSERT INTO adopsi VALUES ('3c3bfa26-d88b-4ab1-998f-1b0d89a99f10', 'b8c4d74f-239f-4e16-a109-f24b263eb4e5', 'Lunas', '2025-03-01', '2025-12-31', 1075000);
INSERT INTO adopsi VALUES ('b7b1a6a0-5a2e-4c68-8e37-8d80b5b09159', 'cfbd3c9b-4733-4a9f-8a37-d85a1ea38d2b', 'Belum', '2025-04-01', '2025-12-31', 880000);
INSERT INTO adopsi VALUES ('f3d3d1e6-0b3a-4b44-92c7-7d6f48a5f46c', '1787f195-1111-4e53-8a7d-dfded104abef', 'Lunas', '2025-05-01', '2025-12-31', 750000);
INSERT INTO adopsi VALUES ('ae0a5d64-0486-4cc9-850a-f75e3d4e223f', '054e0e4d-9b2b-45ae-88d7-3cf983849953', 'Belum', '2025-06-01', '2025-12-31', 620000);
INSERT INTO adopsi VALUES ('b16b00b5-1234-4dbb-9f91-a1f9a1f9a1f9', '003417f2-cf99-4dff-b42b-4167e5a09a31', 'Lunas', '2025-07-01', '2025-12-31', 550000);
INSERT INTO adopsi VALUES ('e743ed82-42a5-43a4-9e35-328cd7ff0e09', 'd3f0c021-bb7f-44e9-a31f-2304ef6b34a0', 'Belum', '2025-08-01', '2025-12-31', 480000);
INSERT INTO adopsi VALUES ('aab11cc7-317d-42e8-bb91-8fc64517efab', '54dbb957-d7b1-4094-8084-9a2a33a4f7be', 'Lunas', '2025-09-01', '2025-12-31', 390000);
INSERT INTO adopsi VALUES ('d111b1c5-8e1a-4c0f-bbcd-7f8ccfe7b3e3', '54dbb957-d7b1-4094-8084-9a2a33a4f7a1', 'Belum', '2025-10-01', '2025-12-31', 320000);
INSERT INTO adopsi VALUES ('11d5b3ec-4513-476e-b5ee-7a9ecb2f13f2', 'a7c32b91-5e4d-4c8f-9a76-82b4c1f6e0d7', 'Lunas', '2025-11-01', '2025-12-31', 2500000);
INSERT INTO adopsi VALUES ('6de43d1c-c0c2-4375-8dbf-4e6e1bdfc7b1', 'f9e86b23-1d45-4a8c-b6d3-28e97f10a5c8', 'Belum', '2025-12-01', '2025-12-31', 2200000);
INSERT INTO adopsi VALUES ('aa79a4e0-2045-4a94-a12e-99c6e2a57e89', 'c4d82e7a-3b19-47f5-96a0-e81c5b7d2a09', 'Lunas', '2025-01-01', '2025-12-31', 2050000);
INSERT INTO adopsi VALUES ('3ee5fc0a-bf90-4e19-9a06-9b89cf3df23f', 'e5f12a8b-9c34-48d6-b1e7-3a94c7d08f16', 'Belum', '2025-02-01', '2025-12-31', 1800000);
INSERT INTO adopsi VALUES ('7c57b71e-299f-42a1-8a6a-d0e7c9f4a9f3', '7b13d6c9-e82f-4a05-93b8-562d1c48e0a5', 'Lunas', '2025-03-01', '2025-12-31', 1700000);
INSERT INTO adopsi VALUES ('20c59ef7-b6a6-48c6-bb8f-98767a8a889f', '08f94d2e-7c51-4639-8a2b-5d31e9c0f7b4', 'Belum', '2025-04-01', '2025-12-31', 1600000);
INSERT INTO adopsi VALUES ('ee5984cf-94de-4e7f-a5a6-06b486c9a7c4', '3a6b8c1d-2e9f-40a7-b5d3-7c6e9a8f0d2b', 'Lunas', '2025-05-01', '2025-12-31', 1550000);
INSERT INTO adopsi VALUES ('ff17cc69-d888-4d1b-9765-90ae08b23d85', 'b5d9c7e6-0f4a-48b2-91c3-6e8d7a5f2c1b', 'Belum', '2025-06-01', '2025-12-31', 1400000);
INSERT INTO adopsi VALUES ('dc21a9e0-3eab-463f-90d0-880f59e34a20', '4f8e7d6c-5b9a-48c3-b1d2-e3f4a5b6c7d8', 'Lunas', '2025-07-01', '2025-12-31', 12000000);
INSERT INTO adopsi VALUES ('fbfd42e5-2b5e-4b8e-b4c1-2a7488c3cbf2', 'c9b8a7d6-e5f4-4321-b0a9-c8d7e6f5a4b3', 'Belum', '2025-08-01', '2025-12-31', 10000000);
INSERT INTO adopsi VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0851', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Lunas', '2025-09-01', '2025-12-31', 1500000);
INSERT INTO adopsi VALUES ('c9bf9e57-1685-4c89-bafb-ff5af830be8a', '7f6e5d4c-3b2a-1987-6543-2f1e0d9c8b7a', 'Belum', '2025-10-01', '2025-12-31', 12000000);
INSERT INTO adopsi VALUES ('3c3bfa26-d88b-4ab1-998f-1b0d89a99f10', 'a9b8c7d6-e5f4-3210-9876-5a4b3c2d1e0f', 'Lunas', '2025-11-01', '2025-12-31', 950000);
INSERT INTO adopsi VALUES ('b7b1a6a0-5a2e-4c68-8e37-8d80b5b09159', '2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a', 'Belum', '2025-12-01', '2025-12-31', 870000);
INSERT INTO adopsi VALUES ('f3d3d1e6-0b3a-4b44-92c7-7d6f48a5f46c', 'e483f973-6313-43f4-9b14-ad0c7244f906', 'Lunas', '2025-01-01', '2025-12-31', 1000000);
INSERT INTO adopsi VALUES ('ae0a5d64-0486-4cc9-850a-f75e3d4e223f', '82c2489c-b578-40c5-8bc3-f5100d11077b', 'Belum', '2025-02-01', '2025-12-31', 900000);
INSERT INTO adopsi VALUES ('b16b00b5-1234-4dbb-9f91-a1f9a1f9a1f9', '2558cd3c-77fa-49f5-8916-f16ca422256a', 'Lunas', '2025-03-01', '2025-12-31', 800000);
INSERT INTO adopsi VALUES ('e743ed82-42a5-43a4-9e35-328cd7ff0e09', '398638ba-97de-4950-83bb-1ec84321498a', 'Belum', '2025-04-01', '2025-12-31', 700000);
INSERT INTO adopsi VALUES ('aab11cc7-317d-42e8-bb91-8fc64517efab', 'c84949f2-643a-4441-b982-c9dae4915925', 'Lunas', '2025-05-01', '2025-12-31', 650000);
INSERT INTO adopsi VALUES ('d111b1c5-8e1a-4c0f-bbcd-7f8ccfe7b3e3', '9b8720a0-2f01-44ab-b1dc-77ecdd5f8cf4', 'Belum', '2025-06-01', '2025-12-31', 600000);

INSERT INTO reservasi VALUES ('rajatacalista', 'Kolam Renang', '2025-11-01', 2, 'Aktif');
INSERT INTO reservasi VALUES ('nsihotang', 'Kolam Renang', '2025-11-01', 2, 'Aktif');
INSERT INTO reservasi VALUES ('rajatacalista', 'Zona Hutan', '2025-11-06', 2, 'Batal');
INSERT INTO reservasi VALUES ('rajatacalista', 'Zona Tropis', '2025-11-06', 3, 'Aktif');
INSERT INTO reservasi VALUES ('rajatacalista', 'Panggung Musik', '2025-11-02', 4, 'Batal');
INSERT INTO reservasi VALUES ('rajatacalista', 'Zona Edukasi', '2025-11-02', 2, 'Aktif');
