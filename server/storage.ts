import { produtos, type Produto, type InsertProduto, type UpdateProduto, type QueryResult } from "@shared/schema";

export interface IStorage {
  getAllProdutos(): Promise<Produto[]>;
  getProdutoById(id: number): Promise<Produto | undefined>;
  createProduto(produto: InsertProduto): Promise<Produto>;
  updateProduto(produto: UpdateProduto): Promise<Produto | undefined>;
  deleteProduto(id: number): Promise<boolean>;
  executeQuery(query: string): Promise<QueryResult>;
}

export class MemStorage implements IStorage {
  private produtos: Map<number, Produto>;
  private currentId: number;

  constructor() {
    this.produtos = new Map();
    this.currentId = 1;
    
    // Initialize with the default data from the SQL example
    this.produtos.set(1, { id: 1, nome: 'BISCOITO', quantidade: 10 });
    this.produtos.set(2, { id: 2, nome: 'LEITE', quantidade: 5 });
    this.currentId = 3;
  }

  async getAllProdutos(): Promise<Produto[]> {
    return Array.from(this.produtos.values());
  }

  async getProdutoById(id: number): Promise<Produto | undefined> {
    return this.produtos.get(id);
  }

  async createProduto(produto: InsertProduto): Promise<Produto> {
    const id = produto.id || this.currentId++;
    const newProduto: Produto = { id, nome: produto.nome, quantidade: produto.quantidade };
    this.produtos.set(id, newProduto);
    if (produto.id && produto.id >= this.currentId) {
      this.currentId = produto.id + 1;
    }
    return newProduto;
  }

  async updateProduto(produto: UpdateProduto): Promise<Produto | undefined> {
    const existing = this.produtos.get(produto.id);
    if (!existing) return undefined;
    
    const updated: Produto = {
      ...existing,
      ...produto,
      id: produto.id
    };
    this.produtos.set(produto.id, updated);
    return updated;
  }

  async deleteProduto(id: number): Promise<boolean> {
    return this.produtos.delete(id);
  }

  async executeQuery(query: string): Promise<QueryResult> {
    const startTime = Date.now();
    const normalizedQuery = query.trim().toUpperCase();
    
    try {
      if (normalizedQuery.startsWith('SELECT')) {
        const data = await this.getAllProdutos();
        return {
          success: true,
          message: `Consulta executada com sucesso! ${data.length} registros encontrados.`,
          data,
          executedQuery: query,
          executionTime: Date.now() - startTime
        };
      } else if (normalizedQuery.startsWith('INSERT')) {
        // Parse INSERT statement (simplified)
        const match = normalizedQuery.match(/INSERT INTO PRODUTO.*VALUES\s*\(\s*(\d+)\s*,\s*'([^']+)'\s*,\s*(\d+)\s*\)/);
        if (match) {
          const [, idStr, nome, quantidadeStr] = match;
          const produto = await this.createProduto({
            id: parseInt(idStr),
            nome: nome,
            quantidade: parseInt(quantidadeStr)
          });
          return {
            success: true,
            message: `Produto "${produto.nome}" inserido com sucesso!`,
            data: await this.getAllProdutos(),
            executedQuery: query,
            executionTime: Date.now() - startTime
          };
        }
      } else if (normalizedQuery.startsWith('UPDATE')) {
        // Parse UPDATE statement (simplified)
        const match = normalizedQuery.match(/UPDATE PRODUTO SET QUANTIDADE\s*=\s*(\d+)\s*WHERE ID\s*=\s*(\d+)/);
        if (match) {
          const [, quantidadeStr, idStr] = match;
          const updated = await this.updateProduto({
            id: parseInt(idStr),
            quantidade: parseInt(quantidadeStr)
          });
          if (updated) {
            return {
              success: true,
              message: `Produto ID ${updated.id} atualizado com sucesso!`,
              data: await this.getAllProdutos(),
              executedQuery: query,
              executionTime: Date.now() - startTime
            };
          }
        }
      } else if (normalizedQuery.startsWith('DELETE')) {
        // Parse DELETE statement (simplified)
        const match = normalizedQuery.match(/DELETE FROM PRODUTO WHERE ID\s*=\s*(\d+)/);
        if (match) {
          const [, idStr] = match;
          const deleted = await this.deleteProduto(parseInt(idStr));
          if (deleted) {
            return {
              success: true,
              message: `Produto ID ${idStr} removido com sucesso!`,
              data: await this.getAllProdutos(),
              executedQuery: query,
              executionTime: Date.now() - startTime
            };
          }
        }
      }
      
      return {
        success: false,
        message: "Consulta não suportada ou formato inválido.",
        executedQuery: query,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao executar consulta: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        executedQuery: query,
        executionTime: Date.now() - startTime
      };
    }
  }
}

export const storage = new MemStorage();
