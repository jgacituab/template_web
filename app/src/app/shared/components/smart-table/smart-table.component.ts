import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  OnChanges
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

export type ColumnType = 'text' | 'chip' | 'actions';

export interface ColumnDef<T> {
  key: string;
  header: string;
  value?: string | ((row: T) => any);
  sortable?: boolean;
  mobile?: boolean;
  type?: ColumnType;
  chipColor?: (value: any, row: T) => string | undefined;
  monospace?: boolean;
}

export interface RowAction<T> {
  key: string;
  label: string;
  icon: string;
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
}

@Component({
  selector: 'app-smart-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent<T extends Record<string, any>>
  implements AfterViewInit, OnChanges {

  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) columns: ColumnDef<T>[] = [];

  @Input() title = 'Listado';
  @Input() searchPlaceholder = 'Buscar...';
  @Input() rowActions: RowAction<T>[] = [];

  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];
  isMobile = false;
  query = '';

  mobileData: T[] = [];
  sortState: { field: string; dir: 'asc' | 'desc' } = { field: '', dir: 'asc' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private bp: BreakpointObserver) {
    this.bp.observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .subscribe(r => {
        this.isMobile = r.matches;
        this.buildMobileData();
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (row, filter) => {
      const q = filter.toLowerCase();
      return this.columns
        .filter(c => c.type !== 'actions')
        .some(c =>
          String(this.getValue(c, row) ?? '')
            .toLowerCase()
            .includes(q)
        );
    };

    this.ensureDefaultSort();   // ✅ NUEVO
    this.refresh();
  }

  ngOnChanges(): void {
    this.refresh();
  }

  refresh(): void {
    this.displayedColumns = this.columns.map(c => c.key);
    this.dataSource.data = this.data;
    this.ensureDefaultSort();     // ✅ NUEVO
    this.applyFilter(this.query);
    this.buildMobileData();
  }

  applyFilter(value: string): void {
    this.query = value;
    this.dataSource.filter = value.trim().toLowerCase();
    this.buildMobileData();
  }

  onDesktopSort(sort: Sort): void {
    if (!sort.direction) return;
    this.sortState = { field: sort.active, dir: sort.direction as any };
    this.buildMobileData();
  }

  setMobileSort(field: string, dir: 'asc' | 'desc'): void {
    this.sortState = { field, dir };
    this.buildMobileData();
  }

  buildMobileData(): void {
    let rows = [...this.dataSource.filteredData];

    if (this.sortState) {
      const col = this.columns.find(c => c.key === this.sortState!.field);
      if (col) {
        rows.sort((a, b) => {
          const av = String(this.getValue(col, a) ?? '');
          const bv = String(this.getValue(col, b) ?? '');
          return this.sortState!.dir === 'asc'
            ? av.localeCompare(bv)
            : bv.localeCompare(av);
        });
      }
    }

    this.mobileData = rows;
  }

  getValue(col: ColumnDef<T>, row: T): any {
    if (!col.value) return row[col.key];
    if (typeof col.value === 'function') return col.value(row);
    return col.value.split('.').reduce((o, k) => o?.[k], row as any);
  }

  mobileColumns(): ColumnDef<T>[] {
  const skipKeys = new Set<string>([
    this.columns[0]?.key,
    this.columns[1]?.key,
  ].filter(Boolean) as string[]);

  return this.columns.filter(c =>
    c.mobile &&
    c.type !== 'actions' &&
    !skipKeys.has(c.key)
  );
}

  visibleActions(row: T): RowAction<T>[] {
    return this.rowActions.filter(a => a.show ? a.show(row) : true);
  }

  initials(text: string): string {
    return (text ?? '')
      .split(' ')
      .map(p => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  private ensureDefaultSort(): void {
    // Si ya hay sort, no hacer nada
    if (this.sortState.field) return;

    // Buscar primera columna ordenable (que no sea actions)
    const firstSortable = this.columns.find(c =>
      (c.sortable !== false) && (c.type !== 'actions')
    );

    if (firstSortable) {
      this.sortState = { field: firstSortable.key, dir: 'asc' };
    }
  }

  sortLabel(): string {
    const col = this.columns.find(c => c.key === this.sortState.field);
    return col?.header ?? this.sortState.field;
  }

}
