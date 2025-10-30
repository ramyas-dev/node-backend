import db from "../models/index.js";
import bcrypt from "bcrypt";
import fs from 'fs';
import { parse } from "json2csv";
import path from "path";
import { fileURLToPath } from "url";
import { exportToCSV } from "../utils/csvExporter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const { User, Role } = db


export const createUser = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ ...rest, password: hashedPassword });
        const csvDir = path.join(__dirname, "..", "data");


        const csvFilePath = path.join(csvDir, "users.csv");

        if (!fs.existsSync(csvDir)) {
            fs.mkdirSync(csvDir, { recursive: true });
        }
        const { password: _, ...csvData } = req.body;

        if (!fs.existsSync(csvFilePath)) {
            const csvWithHeader = parse([req.body], { header: true });
            fs.writeFileSync(csvFilePath, csvWithHeader + "\n");
        } else {
            const csvRow = parse([req.body], { header: false });
            fs.appendFileSync(csvFilePath, csvRow + "\n");
        }

        res.status(201).json({
            message: "User saved successfully!",
            user: newUser,
        });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ error: "Failed to save user" });
    }
};
export const getUsers = async (req, res) => {
    try {
        const usersList = await User.findAll(
            {
                include: [
                    {
                        model: Role,
                        as: "roleInfo",
                        attributes: ["id", "role"]
                    }
                ],
                order: [["id", "ASC"]],
            }
        );
        const userWithRoleName = usersList.map((user) => ({
            ...user.toJSON(),
            userRoleName: user.roleInfo?.role || null
        }));
        return res.status(200).json(userWithRoleName);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ err: "Failed to fetch users" });
    }
}

export const downloadUsers = async (req, res) => {
    try {
        const { table, columns } = req.query;

        const allowedTables = {
            users: db.User,
        };

        if (!table || !allowedTables[table]) {
            return res.status(400).send("Invalid table name");
        }

        const model = allowedTables[table];

        let attrs;
        if (columns) {
            const requestedColumns = columns.split(",").map(c => c.trim());
            const validColumns = Object.keys(model.rawAttributes);
            attrs = requestedColumns.filter(c => validColumns.includes(c));
        }

        const rows = await model.findAll({
            raw: true,
            ...(attrs ? { attributes: attrs } : {})
        });

        exportToCSV(rows, res, `${table}.csv`);

    } catch (err) {
        console.error("Download error:", err);
        res.status(500).send("DB Error");
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        await User.destroy({
            where: { id: id }
        });
        return res.status(200).json({ message: "User deleted Successfully" });
    } catch (error) {
        console.log("Error deleting user:", error)
        res.status(500).json({ message: "Failed to delete the user" });
    }
}

