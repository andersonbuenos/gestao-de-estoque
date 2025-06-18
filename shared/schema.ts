import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const produtos = pgTable("produto", {
  id: integer("id").primaryKey(),
  nome: text("nome").notNull(),
  quantidade: integer("quantidade").notNull(),
});

export const insertProdutoSchema = createInsertSchema(produtos);
export const updateProdutoSchema = createInsertSchema(produtos).partial().extend({
  id: z.number().min(1)
});

export type Produto = typeof produtos.$inferSelect;
export type InsertProduto = z.infer<typeof insertProdutoSchema>;
export type UpdateProduto = z.infer<typeof updateProdutoSchema>;

// Query execution result interface
export interface QueryResult {
  success: boolean;
  message: string;
  data?: Produto[];
  executedQuery: string;
  executionTime: number;
}
