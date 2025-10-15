import * as React from "react"

const Table = ({ children, className }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full text-sm text-left border-collapse ${className || ""}`}>
      {children}
    </table>
  </div>
)
Table.displayName = "Table"

const TableHeader = ({ children, className }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={`bg-muted ${className || ""}`}>{children}</thead>
)
TableHeader.displayName = "TableHeader"

const TableBody = ({ children, className }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={className}>{children}</tbody>
)
TableBody.displayName = "TableBody"

const TableRow = ({ children, className }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`border-b hover:bg-muted/50 ${className || ""}`}>{children}</tr>
)
TableRow.displayName = "TableRow"

const TableHead = ({ children, className }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={`px-4 py-2 font-medium text-muted-foreground ${className || ""}`}>{children}</th>
)
TableHead.displayName = "TableHead"

const TableCell = ({ children, className }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`px-4 py-2 ${className || ""}`}>{children}</td>
)
TableCell.displayName = "TableCell"

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
