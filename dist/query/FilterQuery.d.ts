import { Case } from 'src/laporan/entities/case.enum';
import { category } from 'src/laporan/entities/category.enum';
export interface LaporanQueryFilter {
    jenisLaporan?: Case;
    Category?: category;
    statusClear: boolean;
    sortDirection: 'ASC' | 'DESC';
    page: number;
    limit: number;
}
