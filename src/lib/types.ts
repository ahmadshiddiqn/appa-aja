export interface EmployeeData {
  gajiPokok: number;
  status: 'TK' | 'K0' | 'K1' | 'K2' | 'K3';
  provinsi: string;
  tunjangan: {
    jabatan: number;
    transport: number;
    makan: number;
  };
  bpjs: {
    kesehatan: boolean;
    ketenagakerjaan: boolean;
  };
}

export interface BPJSDetails {
  kesehatan: number;
  jht: number;
  jp: number;
  total: number;
}

export interface CalculationResult {
  gajiKotor: number;
  totalPotongan: number;
  bpjs: BPJSDetails;
  pph21: number;
  gajiBersih: number;
  umkCheck: {
    provinsi: string;
    umk: number;
    isCompliant: boolean;
  };
}
