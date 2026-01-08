import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { User } from '../../core/models/user.interface';
import {
  SmartTableComponent,
  ColumnDef,
  RowAction
} from '../../shared/components/smart-table/smart-table.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, SmartTableComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {

  users: User[] = [
    { id: 1, name: 'Ana Soto',  email: 'ana@empresa.cl',  role: 'ADMIN', status: 'ACTIVE',   createdAt: '2026-01-01' },
    { id: 2, name: 'Luis Pérez', email: 'luis@empresa.cl', role: 'USER',  status: 'INACTIVE', createdAt: '2026-01-02' },
    { id: 3, name: 'Carla Díaz', email: 'carla@empresa.cl',role: 'GUEST', status: 'ACTIVE',   createdAt: '2026-01-03' },
  ];

  columns: ColumnDef<User>[] = [
    { key: 'name', header: 'Nombre', value: 'name', mobile: true, sortable: true },
    { key: 'email', header: 'Email', value: 'email', mobile: true, sortable: true, monospace: true },
    { key: 'id', header: 'ID', value: (u) => `#${u.id}`, mobile: true, monospace: true, sortable: true },


    {
      key: 'role',
      header: 'Rol',
      value: 'role',
      mobile: true,
      type: 'chip',
      chipColor: (v) => (v === 'ADMIN' ? 'primary' : v === 'USER' ? 'accent' : undefined),
    },
    {
      key: 'status',
      header: 'Estado',
      value: 'status',
      mobile: true,
      type: 'chip',
      chipColor: (v) => (v === 'ACTIVE' ? 'primary' : 'warn'),
    },

    {
      key: 'createdAt',
      header: 'Creado',
      value: (u) => new Date(u.createdAt).toLocaleDateString(),
      sortable: true,
    },

    { key: 'actions', header: 'Acciones', type: 'actions', sortable: false },
  ];

  actions: RowAction<User>[] = [
    { key: 'view', label: 'Ver', icon: 'visibility', onClick: (u) => console.log('Ver', u) },
    { key: 'edit', label: 'Editar', icon: 'edit', onClick: (u) => console.log('Editar', u) },
    { key: 'delete', label: 'Eliminar', icon: 'delete', onClick: (u) => console.log('Eliminar', u), show: (u) => u.role !== 'ADMIN' },
  ];
}
