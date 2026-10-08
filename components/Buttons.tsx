// components/Buttons.ts
export type TableRow = Record<string, string | number | boolean | null | undefined>;

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

export const handleExportCSV = (rows: TableRow[], fileName = "table-data.csv"): void => {
  const csv = convertToCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
};
