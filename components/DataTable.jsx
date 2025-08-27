"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

export default function DataTable({ data, title = "Data Table" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  // Extract columns from the first object
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    const firstItem = data[0];
    return Object.keys(firstItem).map((key) => ({
      key,
      label:
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
      type: typeof firstItem[key],
    }));
  }, [data]);

  // Initialize visible columns
  useEffect(() => {
    if (columns.length > 0) {
      setVisibleColumns(new Set(columns.map((col) => col.key)));
    }
  }, [columns]);

  // Filter and search data
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      // Search filter
      const searchMatch =
        searchTerm === "" ||
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Column filters
      const columnFilterMatch = Object.entries(columnFilters).every(
        ([column, filterValue]) => {
          if (!filterValue) return true;
          const itemValue = String(item[column]).toLowerCase();
          return itemValue.includes(filterValue.toLowerCase());
        }
      );

      return searchMatch && columnFilterMatch;
    });
  }, [data, searchTerm, columnFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Pagination info
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, sortedData.length);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleRowSelect = (index, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIndices = paginatedData.map(
        (_, index) => (currentPage - 1) * pageSize + index
      );
      setSelectedRows(new Set(allIndices));
    } else {
      setSelectedRows(new Set());
    }
  };

  const toggleColumnVisibility = (column) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(column)) {
      newVisible.delete(column);
    } else {
      newVisible.add(column);
    }
    setVisibleColumns(newVisible);
  };

  const renderCellValue = (value, type) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">null</span>;
    }

    if (type === "boolean") {
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "true" : "false"}
        </Badge>
      );
    }

    if (type === "number") {
      return <span className="font-mono">{value.toLocaleString()}</span>;
    }

    if (typeof value === "object") {
      return (
        <div className="max-w-xs">
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            {JSON.stringify(value)}
          </code>
        </div>
      );
    }

    return (
      <div className="max-w-xs truncate" title={String(value)}>
        {String(value)}
      </div>
    );
  };

  const exportToCSV = () => {
    if (!sortedData.length) return;

    const visibleCols = columns.filter((col) => visibleColumns.has(col.key));
    const csvContent = [
      // Header row
      visibleCols.map((col) => col.label).join(","),
      // Data rows
      ...sortedData.map((row) =>
        visibleCols
          .map((col) => {
            const value = row[col.key];
            if (typeof value === "object") {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "_")}_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const visibleCols = columns.filter((col) => visibleColumns.has(col.key));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {title}
            <Badge variant="outline">{sortedData.length} rows</Badge>
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={visibleColumns.has(column.key)}
                    onCheckedChange={() => toggleColumnVisibility(column.key)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Column Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4 border rounded-lg bg-muted/20">
              <div className="col-span-full mb-2">
                <h4 className="text-sm font-medium">Column Filters</h4>
              </div>
              {visibleCols.map((column) => (
                <div key={column.key} className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    {column.label}
                  </label>
                  <Input
                    placeholder={`Filter ${column.label.toLowerCase()}...`}
                    value={columnFilters[column.key] || ""}
                    onChange={(e) =>
                      setColumnFilters((prev) => ({
                        ...prev,
                        [column.key]: e.target.value,
                      }))
                    }
                    className="h-8"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          <div className="h-[600px] w-full overflow-scroll">
            <div className="min-w-max">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className={"overflow-x-scroll w-full"}>
                    <TableHead className="w-12 sticky left-0  z-10 border-r">
                      <Checkbox
                        checked={
                          selectedRows.size > 0 &&
                          selectedRows.size === paginatedData.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    {visibleCols.map((column, index) => (
                      <TableHead
                        key={column.key}
                        className="cursor-pointer hover:bg-muted/50 select-none min-w-[150px] whitespace-nowrap"
                        onClick={() => handleSort(column.key)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate pr-2">{column.label}</span>
                          <div className="flex flex-col flex-shrink-0">
                            <ChevronUp
                              className={`w-3 h-3 ${
                                sortConfig.key === column.key &&
                                sortConfig.direction === "asc"
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                            <ChevronDown
                              className={`w-3 h-3 -mt-1 ${
                                sortConfig.key === column.key &&
                                sortConfig.direction === "desc"
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row, index) => {
                    const globalIndex = (currentPage - 1) * pageSize + index;
                    return (
                      <TableRow
                        key={globalIndex}
                        className={
                          selectedRows.has(globalIndex) ? "bg-muted/50" : ""
                        }
                      >
                        <TableCell className="sticky left-0 bg-background z-10 border-r">
                          <Checkbox
                            checked={selectedRows.has(globalIndex)}
                            onCheckedChange={(checked) =>
                              handleRowSelect(globalIndex, checked)
                            }
                          />
                        </TableCell>
                        {visibleCols.map((column) => (
                          <TableCell
                            key={column.key}
                            className="min-w-[150px] max-w-[300px]"
                          >
                            {renderCellValue(row[column.key], column.type)}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Horizontal scroll indicator */}
          {visibleCols.length > 4 && (
            <div className="absolute bottom-0 right-2 bg-background/90 backdrop-blur-sm border rounded px-2 py-1 text-xs text-muted-foreground">
              ← Scroll horizontally to see more columns →
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-xs text-muted-foreground">
            Showing {startRow} to {endRow} of {sortedData.length} results
            {selectedRows.size > 0 && (
              <span> • {selectedRows.size} selected</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              <span className="text-sm">Page</span>
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value) || 1;
                  setCurrentPage(Math.max(1, Math.min(totalPages, page)));
                }}
                className="w-16 h-8 text-center text-xs"
              />
              <span className="text-sm">of {totalPages}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
