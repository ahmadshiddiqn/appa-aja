<script lang="ts">
  import { calculateSalary } from '$lib/calculator';
  import type { CalculationResult, EmployeeData } from '$lib/types';
  
  let gajiPokok = $state(13000000);
  let status = $state<'TK' | 'K0' | 'K1' | 'K2' | 'K3'>('K0');
  let provinsi = $state('Jawa Barat');
  let tunjanganJabatan = $state(0);
  let tunjanganTransport = $state(0);
  let tunjanganMakan = $state(0);
  let bpjsKesehatan = $state(true);
  let bpjsKetenagakerjaan = $state(true);
  
  let result = $state<CalculationResult | null>(null);
  let showDetails = $state(false);
  
  function hitung() {
    const data: EmployeeData = {
      gajiPokok,
      status,
      provinsi,
      tunjangan: {
        jabatan: tunjanganJabatan,
        transport: tunjanganTransport,
        makan: tunjanganMakan
      },
      bpjs: {
        kesehatan: bpjsKesehatan,
        ketenagakerjaan: bpjsKetenagakerjaan
      }
    };
    result = calculateSalary(data);
  }
  
  $effect(() => {
    hitung();
  });
</script>

<svelte:head>
  <title>💰 GajiBener - Kalkulator Gaji Indonesia</title>
  <meta name="description" content="Kalkulator Gaji Indonesia 2026 - Hitung gaji bersih, PPh 21 TER, dan BPJS dengan akurat" />
</svelte:head>

<div class="max-w-4xl mx-auto p-4">
  <div class="hero bg-base-100 rounded-box shadow-xl mb-8">
    <div class="hero-content text-center py-12">
      <div>
        <h1 class="text-5xl font-bold mb-4">💰 GajiBener</h1>
        <p class="text-xl text-gray-600 mb-2">Kalkulator Gaji Indonesia</p>
        <p class="text-sm text-gray-500">Sesuai aturan 2026 • PPh 21 TER • BPJS</p>
      </div>
    </div>
  </div>
  
  <div class="tabs tabs-boxed justify-center mb-8 bg-base-100 p-2 rounded-box">
    <button class="tab tab-active">👤 Mode Pekerja</button>
    <button class="tab">🏢 Mode Employer (Segera)</button>
  </div>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-6">📋 Data Gaji</h2>
        
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Gaji Pokok</span>
              <span class="label-text-alt">per bulan</span>
            </label>
            <input 
              type="number" 
              bind:value={gajiPokok}
              class="input input-bordered input-lg"
              placeholder="13000000"
              oninput={hitung}
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Status PTKP</span>
              <a href="https://pajak.go.id/id/ptkp" target="_blank" class="label-text-alt link link-primary">ℹ️ Info</a>
            </label>
            <select bind:value={status} class="select select-bordered" onchange={hitung}>
              <option value="TK">TK - Tidak Kawin</option>
              <option value="K0">K0 - Kawin, 0 Tanggungan</option>
              <option value="K1">K1 - Kawin, 1 Tanggungan</option>
              <option value="K2">K2 - Kawin, 2 Tanggungan</option>
              <option value="K3">K3 - Kawin, 3 Tanggungan</option>
            </select>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Provinsi</span>
              <span class="label-text-alt">untuk cek UMK</span>
            </label>
            <select bind:value={provinsi} class="select select-bordered" onchange={hitung}>
              <option value="Jakarta">DKI Jakarta</option>
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Jawa Tengah">Jawa Tengah</option>
              <option value="Jawa Timur">Jawa Timur</option>
              <option value="Banten">Banten</option>
              <option value="Yogyakarta">DI Yogyakarta</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          
          <div class="divider">Tunjangan (Opsional)</div>
          
          <div class="grid grid-cols-3 gap-2">
            <div class="form-control">
              <label class="label"><span class="label-text text-xs">Jabatan</span></label>
              <input type="number" bind:value={tunjanganJabatan} class="input input-bordered input-sm" oninput={hitung} />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text text-xs">Transport</span></label>
              <input type="number" bind:value={tunjanganTransport} class="input input-bordered input-sm" oninput={hitung} />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text text-xs">Makan</span></label>
              <input type="number" bind:value={tunjanganMakan} class="input input-bordered input-sm" oninput={hitung} />
            </div>
          </div>
          
          <div class="divider">BPJS</div>
          
          <div class="flex gap-4">
            <label class="label cursor-pointer gap-2">
              <input type="checkbox" bind:checked={bpjsKesehatan} class="checkbox" onchange={hitung} />
              <span class="label-text">Kesehatan</span>
            </label>
            <label class="label cursor-pointer gap-2">
              <input type="checkbox" bind:checked={bpjsKetenagakerjaan} class="checkbox" onchange={hitung} />
              <span class="label-text">Ketenagakerjaan</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-6">📊 Hasil Perhitungan</h2>
        
        {#if result}
          <div class="stats bg-primary text-primary-content shadow mb-6">
            <div class="stat">
              <div class="stat-title">Gaji Bersih</div>
              <div class="stat-value text-3xl">Rp {result.gajiBersih.toLocaleString('id-ID')}</div>
              <div class="stat-desc">Yang diterima per bulan</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-success/10 rounded-lg">
              <span class="font-medium">💰 Gaji Kotor</span>
              <span class="font-bold text-lg">Rp {result.gajiKotor.toLocaleString('id-ID')}</span>
            </div>
            
            <div class="flex justify-between items-center p-3 bg-error/10 rounded-lg">
              <span class="font-medium">📉 Total Potongan</span>
              <span class="font-bold text-lg">Rp {result.totalPotongan.toLocaleString('id-ID')}</span>
            </div>
            
            {#if result.umkCheck}
              <div class="flex justify-between items-center p-3 {result.umkCheck.isCompliant ? 'bg-success/10' : 'bg-warning/10'} rounded-lg">
                <span class="font-medium">✅ Cek UMK {result.umkCheck.provinsi}</span>
                <span class="font-bold text-lg {result.umkCheck.isCompliant ? 'text-success' : 'text-warning'}">
                  {result.umkCheck.isCompliant ? 'Lulus' : 'Di bawah UMK'}
                </span>
              </div>
            {/if}
          </div>
          
          <div class="mt-6">
            <button class="btn btn-outline w-full" onclick={() => showDetails = !showDetails}>
              {showDetails ? '🔼 Sembunyikan Detail' : '🔽 Lihat Detail'}
            </button>
          </div>
          
          {#if showDetails}
            <div class="mt-4 space-y-2">
              <h3 class="font-bold text-lg">📋 Rincian Potongan</h3>
              
              {#if result.bpjs.kesehatan > 0}
                <div class="flex justify-between text-sm">
                  <span>BPJS Kesehatan (1%)</span>
                  <span>Rp {result.bpjs.kesehatan.toLocaleString('id-ID')}</span>
                </div>
              {/if}
              
              {#if result.bpjs.jht > 0}
                <div class="flex justify-between text-sm">
                  <span>JHT (2%)</span>
                  <span>Rp {result.bpjs.jht.toLocaleString('id-ID')}</span>
                </div>
              {/if}
              
              {#if result.bpjs.jp > 0}
                <div class="flex justify-between text-sm">
                  <span>JP (1%)</span>
                  <span>Rp {result.bpjs.jp.toLocaleString('id-ID')}</span>
                </div>
              {/if}
              
              <div class="flex justify-between text-sm font-semibold border-t pt-2">
                <span>PPh 21 (TER)</span>
                <span>Rp {result.pph21.toLocaleString('id-ID')}</span>
              </div>
              
              <div class="alert alert-info mt-4 text-xs">
                <p>📖 Kalkulasi berdasarkan:</p>
                <ul class="list-disc ml-4 mt-1">
                  <li>PER-16/PJ/2023 (PPh 21 TER)</li>
                  <li>BPJS Ketenagakerjaan 2026</li>
                  <li>UMK 2026 per daerah</li>
                </ul>
                <p class="mt-2">⚠️ Cek dengan HR jika ada ketidaksesuaian</p>
              </div>
            </div>
          {/if}
        {:else}
          <div class="alert alert-info">
            <span>Masukkan data gaji untuk melihat hasil</span>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
