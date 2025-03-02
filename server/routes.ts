import type { Express } from "express";
import { createServer } from "http";
import { taxCalculationSchema } from "@shared/schema";
import { calculateTax } from "./storage";

export async function registerRoutes(app: Express) {
  app.post("/api/calculate-tax", async (req, res) => {
    try {
      const data = taxCalculationSchema.parse(req.body);
      const result = calculateTax(data);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
