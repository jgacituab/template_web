import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

type Role = 'Admin' | 'User' | 'Auditor';
type Status = 'Active' | 'Blocked';

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
};

@Component({
  selector: 'app-users-transposed',
  standalone: true,
  imports: [
    CommonModule,
    LayoutModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './users-transposed.component.html',
  styleUrls: ['./users-transposed.component.scss'],
})
export class UsersTransposedComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['name', 'email', 'role', 'status', 'actions'];

  /** Fuente “real” de datos (no se muta para ordenar móvil) */
  private rawData: User[] = [
    { id: 1, name: 'Ana Pérez', email: 'ana@demo.cl', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jorge Gacitua', email: 'jorge@demo.cl', role: 'User', status: 'Active' },
    { id: 3, name: 'Mario Soto', email: 'mario@demo.cl', role: 'Auditor', status: 'Blocked' },
  ];

  dataSource = new MatTableDataSource<User>(this.rawData);

  isMobile = false;
  query = '';

  /** Sort “canónico” (lo compartimos entre móvil y desktop) */
  sortState: { field: keyof User; dir: SortDirection } = { field: 'name', dir: 'asc' };

  constructor(private breakpoint: BreakpointObserver) {
    // Filtro compartido (desktop lo usa MatTableDataSource; móvil lo usa mobileData)
    this.dataSource.filterPredicate = (row, filter) => this.matchesFilter(row, filter);

    // Breakpoint (sincroniza sort al cambiar de modo)
    this.breakpoint
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe(r => {
        const prev = this.isMobile;
        this.isMobile = r.matches;

        if (prev !== this.isMobile) {
          // cuando cambiamos modo, sincronizamos el sort
          // (si aún no existe MatSort, lo aplicaremos en ngAfterViewInit)
          this.syncSortBetweenModes();
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // aplica sort “canónico” al iniciar (si estamos en desktop)
    if (!this.isMobile) {
      this.applySortStateToDesktop();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ----------------------------
  // FILTER
  // ----------------------------
  applyFilter(value: string) {
    this.query = value ?? '';
    this.dataSource.filter = this.query.trim().toLowerCase();

    // si cambias filtro, vuelve a la primera página en desktop
    if (this.paginator) this.paginator.firstPage();
  }

  private matchesFilter(row: User, filterRaw: string): boolean {
    const f = (filterRaw ?? '').trim().toLowerCase();
    if (!f) return true;

    return (
      row.name.toLowerCase().includes(f) ||
      row.email.toLowerCase().includes(f) ||
      row.role.toLowerCase().includes(f) ||
      row.status.toLowerCase().includes(f)
    );
  }

  /** ✅ Para tu vista móvil: usa esto en el *ngFor */
  get mobileData(): User[] {
    const filter = this.query.trim().toLowerCase();

    // 1) Filtrar desde la fuente real
    let rows = this.rawData.filter(r => this.matchesFilter(r, filter));

    // 2) Ordenar por sortState (sin tocar dataSource.data)
    const { field, dir } = this.sortState;
    const mult = dir === 'desc' ? -1 : 1;

    rows = [...rows].sort((a, b) => {
      const av = a[field];
      const bv = b[field];

      // números (id)
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mult;

      // strings (name, email, role, status)
      return String(av).toLowerCase().localeCompare(String(bv).toLowerCase()) * mult;
    });

    return rows;
  }

  // ----------------------------
  // SORT (Desktop)
  // ----------------------------
  /** Llama esto desde (matSortChange) en la tabla desktop */
  onDesktopSortChange(s: Sort) {
    const active = (s.active || 'name') as keyof User;
    const dir: SortDirection = s.direction || 'asc';

    this.sortState = { field: active, dir };

    // en desktop, MatTableDataSource ya reordena solo
    // pero guardamos el estado para móvil / cambios de modo
  }

  private applySortStateToDesktop() {
    if (!this.sort) return;

    this.sort.active = this.sortState.field as string;
    this.sort.direction = this.sortState.dir;

    // fuerza a MatTableDataSource a re-ejecutar el sort
    this.sort.sortChange.emit({
      active: this.sort.active,
      direction: this.sort.direction,
    });
  }

  // ----------------------------
  // SORT (Mobile)
  // ----------------------------
  /** ✅ Úsalo desde tu menú/botones en móvil */
  setMobileSort(field: keyof User, dir: SortDirection) {
    this.sortState = { field, dir };

    // Si estás en desktop al mismo tiempo (por pruebas/responsive),
    // también aplicamos al MatSort para mantener coherencia visual.
    if (!this.isMobile) {
      this.applySortStateToDesktop();
    }
  }

  // ----------------------------
  // MODE SWITCH SYNC
  // ----------------------------
  private syncSortBetweenModes() {
    // Si pasamos a desktop: aplica el sortState al MatSort
    if (!this.isMobile) {
      this.applySortStateToDesktop();
      return;
    }

    // Si pasamos a móvil: “captura” el sort actual de desktop si existiera
    if (this.sort?.active) {
      const field = this.sort.active as keyof User;
      const dir: SortDirection = this.sort.direction || 'asc';
      this.sortState = { field, dir };
    }
  }

  // ----------------------------
  // UI HELPERS
  // ----------------------------
  roleChipColor(role: Role): 'primary' | 'accent' | 'warn' {
    if (role === 'Admin') return 'warn';
    if (role === 'Auditor') return 'accent';
    return 'primary';
  }

  statusChipColor(status: Status): 'primary' | 'accent' | 'warn' {
    return status === 'Active' ? 'primary' : 'warn';
  }

  view(u: User) {
    console.log('view', u);
  }
  edit(u: User) {
    console.log('edit', u);
  }
  remove(u: User) {
    console.log('remove', u);
  }

  initials(name: string) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase())
      .join('');
  }
}
