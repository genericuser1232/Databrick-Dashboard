"use client";

export type TableRow = Record<string, string | number | boolean | null | undefined>;

type ExportCsvButtonProps = {
  rows: TableRow[];
  fileName?: string;
  className?: string;
};

const convertToCSV = (rows: TableRow[]): string => {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);

  const escapeCSV = (value: TableRow[string]) => {
    const str = String(value ?? "");
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headerRow = headers.map((h) => escapeCSV(h)).join(",");
  const dataRows = rows.map((row) =>
    headers.map((header) => escapeCSV(row[header])).join(",")
  );

  return [headerRow, ...dataRows].join("\n");
};

const handleExportCSV = (rows: TableRow[], fileName: string) => {
  const csv = convertToCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
};

export default function ExportCsvButton({
  rows,
  fileName = "table-data.csv",
  className = "btn",
}: ExportCsvButtonProps) {
  return (
    <button className={className} onClick={() => handleExportCSV(rows, fileName)}>
      Export CSV
    </button>
  );
}
