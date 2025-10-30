import { Parser } from "json2csv";

export function exportToCSV(rows, res, filename = "data.csv") {
    if (!rows || rows.length === 0) {
        return res.status(404).send("No data found");
    }
    try {
        const parser = new Parser();
        const csv = parser.parse(rows);

        res.header("Content-Type", "text/csv");
        res.attachment(filename);
        res.send(csv);
    } catch (err) {
        console.error("CSV Export Error:", err);
        res.status(500).send("Error generating CSV");
    }
}
