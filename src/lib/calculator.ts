import type { EmployeeData, CalculationResult } from './types';

const UMK_DATA: Record<string, number> = {
  'Jakarta': 5389600,
  'Jawa Barat': 2122918,
  'Jawa Tengah': 2053995,
  'Jawa Timur': 2280000,
  'Banten': 2492250,
  'Yogyakarta': 2048316,
  'Lainnya': 2000000
};

const PTKP_RATES: Record<string, number> = {
  'TK': 54000000,
  'K0': 58500000,
  'K1': 63000000,
  'K2': 67500000,
  'K3': 72000000
};

const ANNUAL_BENEFITS = 0; // Tunjangan lain per tahun (jika ada)

export function calculateSalary(data: EmployeeData): CalculationResult {
  // Monthly base salary
  const monthlySalary = data.gajiPokok;
  
  // Monthly allowances
  const totalMonthlyAllowances = 
    data.tunjangan.jabatan + 
    data.tunjangan.transport + 
    data.tunjangan.makan;
  
  // Gross monthly income (pre-BPJS)
  const grossMonthly = monthlySalary + totalMonthlyAllowances;
  
  // Annual gross
  const grossAnnual = (grossMonthly * 12) + ANNUAL_BENEFITS;
  
  // BPJS Calculation (monthly)
  const bpjsKesehatanRate = 0.01; // 1% employee contribution
  const bpjsJhtRate = 0.02; // 2% JHT employee contribution  
  const bpjsJpRate = 0.01; // 1% JP employee contribution
  
  const bpjsKesehatan = data.bpjs.kesehatan ? Math.min(grossMonthly * bpjsKesehatanRate, 120000) : 0;
  const bpjsJht = data.bpjs.ketenagakerjaan ? grossMonthly * bpjsJhtRate : 0;
  const bpjsJp = data.bpjs.ketenagakerjaan ? grossMonthly * bpjsJpRate : 0;
  
  const totalBpjsMonthly = bpjsKesehatan + bpjsJht + bpjsJp;
  const totalBpjsAnnual = totalBpjsMonthly * 12;
  
  // Net annual income for tax
  const netAnnualIncome = grossAnnual - totalBpjsAnnual - 0; // biaya pensiun jika ada
  
  // PTKP (Penghasilan Tidak Kena Pajak)
  const ptkp = PTKP_RATES[data.status] || PTKP_RATES['TK'];
  
  // Taxable income
  const taxableAnnual = Math.max(0, netAnnualIncome - ptkp);
  
  // PPh 21 annual (progressive rates)
  const taxAnnual = calculateProgressiveTax(taxableAnnual);
  
  // PPh 21 monthly (using TER method)
  const pph21Monthly = Math.round(taxAnnual / 12);
  
  // Total monthly deductions
  const totalMonthlyDeductions = totalBpjsMonthly + pph21Monthly;
  
  // Take-home pay
  const takeHomeMonthly = grossMonthly - totalMonthlyDeductions;
  
  // UMK Check
  const umk = UMK_DATA[data.provinsi] || UMK_DATA['Lainnya'];
  
  return {
    gajiKotor: Math.round(grossMonthly),
    totalPotongan: Math.round(totalMonthlyDeductions),
    bpjs: {
      kesehatan: Math.round(bpjsKesehatan),
      jht: Math.round(bpjsJht),
      jp: Math.round(bpjsJp),
      total: Math.round(totalBpjsMonthly)
    },
    pph21: Math.round(pph21Monthly),
    gajiBersih: Math.round(Math.max(0, takeHomeMonthly)),
    umkCheck: {
      provinsi: data.provinsi,
      umk: umk,
      isCompliant: grossMonthly >= umk
    }
  };
}

function calculateProgressiveTax(taxableIncome: number): number {
  // Indonesia 2024-2025 PPh 21 progressive rates
  let tax = 0;
  
  if (taxableIncome <= 60000000) {
    tax = taxableIncome * 0.05;
  } else if (taxableIncome <= 250000000) {
    tax = 60000000 * 0.05 + (taxableIncome - 60000000) * 0.15;
  } else if (taxableIncome <= 500000000) {
    tax = 60000000 * 0.05 + (250000000 - 60000000) * 0.15 + (taxableIncome - 250000000) * 0.25;
  } else {
    tax = 60000000 * 0.05 + (250000000 - 60000000) * 0.15 + (500000000 - 250000000) * 0.25 + (taxableIncome - 500000000) * 0.30;
  }
  
  return Math.round(tax);
}
