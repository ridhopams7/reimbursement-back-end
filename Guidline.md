GUIDELINE

1. repository akan di letakkan di gitlab.playcourt.id dan akan dibuatkan group repository nya 
2. kepada developer dan  maintainer bisa daftar di gitlab.playcourt.id terleih dahulu 
3. ada 3 branch yang akan digunakan yaitu : develop (untuk development), release (untuk UAT), master (untuk production)
4. diharapkan menuliskan informasi mengenai apps yang dibuat di dalam README di setiap repository
5. dari ke 3 branch tersebut akan masuk kedalam pipeline dan akan di deploy lansung ke project sesuai dengan stage nya (Development, UAT, Production)
6. untuk dockerfile, boleh langsung di buat oleh developer, atau bisa kami bantu dengan catatan README yang sudah lengkap. 
7. Untuk masuk ke stage production, harus melewati sonarqube analisis, beberapa kriteria nanti bisa di liat pada saat proses development berjalan.

beberapa syarat bisa masuk ke production:

1. harus lulus sonar scan
2. repo yang di gunakan harus sama dari development - production
3. mempersiapkan struktur dan query database (untuk pembuatan database production)
4. project (openshift) production tidak boleh sama dengan development
5. repo yang digunakan harus di dalam group repo (minimal di dalam telkomdev /  telkomdds bila belum ada group)