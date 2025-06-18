import { BarChart, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Produto, QueryResult } from "@shared/schema";

interface ResultsDisplayProps {
  queryResult: QueryResult | null;
  produtos: Produto[];
}

export default function ResultsDisplay({ queryResult, produtos }: ResultsDisplayProps) {
  const formatExecutionTime = (time: number) => {
    return `${(time / 1000).toFixed(3)}s`;
  };

  const getQuantityBadgeVariant = (quantidade: number) => {
    if (quantidade >= 10) return "default";
    if (quantidade >= 5) return "secondary";
    return "destructive";
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 rounded-t-xl">
        <h2 className="text-xl font-semibold flex items-center justify-between">
          <span className="flex items-center">
            <BarChart className="mr-3" />
            Resultados da Consulta
          </span>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Tempo: {queryResult ? formatExecutionTime(queryResult.executionTime) : "0.000s"}
          </span>
        </h2>
      </div>
      <div className="p-6">
        {/* Status Message */}
        {queryResult && (
          <div className={`mb-4 p-4 border-l-4 rounded-lg ${
            queryResult.success 
              ? "bg-green-50 border-green-500" 
              : "bg-red-50 border-red-500"
          }`}>
            <div className="flex items-center">
              {queryResult.success ? (
                <CheckCircle className="text-green-500 mr-3" />
              ) : (
                <XCircle className="text-red-500 mr-3" />
              )}
              <span className={`font-medium ${
                queryResult.success ? "text-green-700" : "text-red-700"
              }`}>
                {queryResult.message}
              </span>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">NOME</TableHead>
                <TableHead className="font-semibold text-gray-700">QUANTIDADE</TableHead>
                <TableHead className="font-semibold text-gray-700">AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                produtos.map((produto) => (
                  <TableRow key={produto.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-mono text-gray-900">{produto.id}</TableCell>
                    <TableCell className="text-gray-900 font-medium">{produto.nome}</TableCell>
                    <TableCell>
                      <Badge variant={getQuantityBadgeVariant(produto.quantidade)}>
                        {produto.quantidade} unidades
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* SQL Query Display */}
        {queryResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
              <span className="text-sm font-semibold text-gray-700">Consulta Executada:</span>
            </div>
            <div className="font-mono text-sm text-gray-800 bg-white p-3 rounded border">
              {queryResult.executedQuery}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
