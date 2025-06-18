import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Database, Circle } from "lucide-react";
import DatabaseSchema from "@/components/database-schema";
import SQLQueryEditor from "@/components/sql-query-editor";
import CrudOperations from "@/components/crud-operations";
import ResultsDisplay from "@/components/results-display";
import QueryExamples from "@/components/query-examples";
import type { Produto, QueryResult } from "@shared/schema";

export default function SQLEducation() {
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);

  const { data: produtos = [], refetch } = useQuery<Produto[]>({
    queryKey: ["/api/produtos"],
  });

  const handleQueryResult = (result: QueryResult) => {
    setQueryResult(result);
    if (result.success) {
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Interface SQL Educativa</h1>
                <p className="text-gray-600">Demonstração de Operações CRUD - Database LOJA</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                <Circle className="w-2 h-2 mr-2 fill-current" />
                Conectado
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Database Schema */}
        <DatabaseSchema />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* SQL Query Editor */}
          <SQLQueryEditor onQueryResult={handleQueryResult} />

          {/* CRUD Operations */}
          <CrudOperations onQueryResult={handleQueryResult} />
        </div>

        {/* Results Display */}
        <ResultsDisplay queryResult={queryResult} produtos={produtos} />

        {/* Query Examples */}
        <QueryExamples onQueryResult={handleQueryResult} />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Interface educativa para demonstração de operações SQL
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Database: <strong>LOJA</strong></span>
              <span>Tabela: <strong>PRODUTO</strong></span>
              <span>Registros: <strong>{produtos.length}</strong></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
