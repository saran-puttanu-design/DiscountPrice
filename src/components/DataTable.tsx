import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MoreHorizontal,
  ArrowUpDown,
  Search,
  Plus,
  Trash2,
  Download,
  Filter,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { DataRow } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: DataRow[];
  onUpdate: (updatedData: DataRow[]) => void;
}

type SortConfig = {
  key: keyof DataRow | null;
  direction: 'asc' | 'desc';
};

export function DataTable({ data, onUpdate }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DataRow>>({});

  // Sorting Logic
  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // Filtering Logic
  const filteredData = useMemo(() => {
    return sortedData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [sortedData, filterText]);

  const requestSort = (key: keyof DataRow) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map((row) => row.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const startEditing = (row: DataRow) => {
    setEditingId(row.id);
    setEditForm(row);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = () => {
    if (editingId && editForm) {
      const updatedData = data.map((row) =>
        row.id === editingId ? { ...row, ...editForm } : row
      );
      onUpdate(updatedData as DataRow[]);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleInputChange = (key: keyof DataRow, value: any) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const deleteSelected = () => {
    const updatedData = data.filter((row) => !selectedRows.has(row.id));
    onUpdate(updatedData);
    setSelectedRows(new Set());
  };

  const deleteRow = (id: string) => {
    const updatedData = data.filter((row) => row.id !== id);
    onUpdate(updatedData);
  };

  const addNewRow = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newRow: DataRow = {
      id: newId,
      name: 'New User',
      email: '',
      role: 'User',
      status: 'Pending',
      lastLogin: new Date().toISOString(),
      department: 'General',
      salary: 0,
    };
    onUpdate([newRow, ...data]);
    setEditingId(newId);
    setEditForm(newRow);
  };

  const exportCSV = () => {
    const rows = selectedRows.size > 0 ? data.filter((r) => selectedRows.has(r.id)) : filteredData;
    const headers = ['id','name','email','role','status','lastLogin','department','salary'];
    const csvRows = [headers.join(',')];
    for (const r of rows) {
      const vals = headers.map((h) => {
        const v = (r as any)[h];
        return typeof v === 'string' ? `"${String(v).replace(/"/g, '""')}"` : String(v);
      });
      csvRows.push(vals.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `data-export-${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search data..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-all"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {selectedRows.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteSelected}
              className="animate-in fade-in zoom-in duration-200"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedRows.size})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={addNewRow} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('name')}>
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('email')}>
                  <div className="flex items-center">
                    Email
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('role')}>
                  <div className="flex items-center">
                    Role
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('department')}>
                  <div className="flex items-center">
                    Department
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('status')}>
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('salary')}>
                  <div className="flex items-center justify-end">
                    Salary
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted",
                      editingId === row.id && "bg-muted/50"
                    )}
                    data-state={selectedRows.has(row.id) ? "selected" : undefined}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onCheckedChange={() => toggleSelectRow(row.id)}
                        aria-label="Select row"
                      />
                    </TableCell>
                    
                    {/* Name Cell */}
                    <TableCell className="font-medium">
                      {editingId === row.id ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="h-8 w-full"
                        />
                      ) : (
                        row.name
                      )}
                    </TableCell>

                    {/* Email Cell */}
                    <TableCell>
                      {editingId === row.id ? (
                        <Input
                          value={editForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="h-8 w-full"
                        />
                      ) : (
                        <span className="text-muted-foreground">{row.email}</span>
                      )}
                    </TableCell>

                    {/* Role Cell */}
                    <TableCell>
                      {editingId === row.id ? (
                        <Input
                          value={editForm.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          className="h-8 w-full"
                        />
                      ) : (
                        row.role
                      )}
                    </TableCell>

                    {/* Department Cell */}
                    <TableCell>
                      {editingId === row.id ? (
                        <Input
                          value={editForm.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="h-8 w-full"
                        />
                      ) : (
                        row.department
                      )}
                    </TableCell>

                    {/* Status Cell */}
                    <TableCell>
                      {editingId === row.id ? (
                        <Select
                          value={editForm.status}
                          onValueChange={(val) => handleInputChange('status', val)}
                        >
                          <SelectTrigger className="h-8 w-[100px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            row.status === 'Active' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                            row.status === 'Inactive' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                            row.status === 'Pending' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          )}
                        >
                          {row.status}
                        </span>
                      )}
                    </TableCell>

                    {/* Salary Cell */}
                    <TableCell className="text-right">
                      {editingId === row.id ? (
                        <Input
                          type="number"
                          value={editForm.salary}
                          onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                          className="h-8 w-full text-right"
                        />
                      ) : (
                        new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(row.salary)
                      )}
                    </TableCell>

                    {/* Actions Cell */}
                    <TableCell>
                      {editingId === row.id ? (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100" onClick={saveEditing}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100" onClick={cancelEditing}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.id)}>
                              Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => startEditing(row)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteRow(row.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="text-xs text-muted-foreground text-center">
        Showing {filteredData.length} of {data.length} records
      </div>
    </div>
  );
}
