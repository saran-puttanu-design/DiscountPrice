export interface DataRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
  department: string;
  salary: number;
}

export const initialData: DataRow[] = [
  {
    id: '1',
    name: 'Somchai Jai-dee',
    email: 'somchai@example.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2023-10-25T09:00:00Z',
    department: 'Sales',
    salary: 55000,
  },
  {
    id: '2',
    name: 'Somsri Rak-ngan',
    email: 'somsri@example.com',
    role: 'Developer',
    status: 'Active',
    lastLogin: '2023-10-26T10:30:00Z',
    department: 'IT',
    salary: 45000,
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Designer',
    status: 'Pending',
    lastLogin: '2023-10-24T14:15:00Z',
    department: 'Marketing',
    salary: 40000,
  },
  {
    id: '4',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'HR',
    status: 'Inactive',
    lastLogin: '2023-09-15T08:45:00Z',
    department: 'Human Resources',
    salary: 35000,
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    role: 'Developer',
    status: 'Active',
    lastLogin: '2023-10-27T11:20:00Z',
    department: 'IT',
    salary: 48000,
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    role: 'Sales',
    status: 'Active',
    lastLogin: '2023-10-26T16:00:00Z',
    department: 'Sales',
    salary: 32000,
  },
  {
    id: '7',
    name: 'David Wilson',
    email: 'david.w@example.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2023-10-25T13:45:00Z',
    department: 'Marketing',
    salary: 60000,
  },
  {
    id: '8',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'Designer',
    status: 'Pending',
    lastLogin: '2023-10-23T09:30:00Z',
    department: 'Marketing',
    salary: 42000,
  },
  {
    id: '9',
    name: 'Robert Taylor',
    email: 'robert.t@example.com',
    role: 'Developer',
    status: 'Inactive',
    lastLogin: '2023-08-10T10:00:00Z',
    department: 'IT',
    salary: 46000,
  },
  {
    id: '10',
    name: 'Jennifer White',
    email: 'jennifer.w@example.com',
    role: 'HR',
    status: 'Active',
    lastLogin: '2023-10-27T08:15:00Z',
    department: 'Human Resources',
    salary: 38000,
  },
];
