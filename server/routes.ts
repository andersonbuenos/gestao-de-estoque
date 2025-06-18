import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProdutoSchema, updateProdutoSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all produtos
  app.get("/api/produtos", async (req, res) => {
    try {
      const produtos = await storage.getAllProdutos();
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar produtos" });
    }
  });

  // Get produto by ID
  app.get("/api/produtos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const produto = await storage.getProdutoById(id);
      if (!produto) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      res.json(produto);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar produto" });
    }
  });

  // Create produto
  app.post("/api/produtos", async (req, res) => {
    try {
      const validatedData = insertProdutoSchema.parse(req.body);
      const produto = await storage.createProduto(validatedData);
      res.status(201).json(produto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar produto" });
    }
  });

  // Update produto
  app.put("/api/produtos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateProdutoSchema.parse({ ...req.body, id });
      const produto = await storage.updateProduto(validatedData);
      if (!produto) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      res.json(produto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao atualizar produto" });
    }
  });

  // Delete produto
  app.delete("/api/produtos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduto(id);
      if (!deleted) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      res.json({ message: "Produto removido com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao remover produto" });
    }
  });

  // Execute SQL query
  app.post("/api/execute-query", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query SQL é obrigatória" });
      }
      
      const result = await storage.executeQuery(query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Erro interno do servidor",
        executedQuery: req.body.query || "",
        executionTime: 0
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
