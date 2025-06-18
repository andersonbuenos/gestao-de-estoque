import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Code, Play, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { QueryResult } from "@shared/schema";

interface SQLQueryEditorProps {
  onQueryResult: (result: QueryResult) => void;
}

export default function SQLQueryEditor({ onQueryResult }: SQLQueryEditorProps) {
  const [query, setQuery] = useState("SELECT * FROM PRODUTO;");
  const { toast } = useToast();

  const executeQueryMutation = useMutation({
    mutationFn: async (sqlQuery: string) => {
      const response = await apiRequest("POST", "/api/execute-query", { query: sqlQuery });
      return response.json() as Promise<QueryResult>;
    },
    onSuccess: (result) => {
      onQueryResult(result);
      if (result.success) {
        toast({
          title: "Sucesso",
          description: result.message,
        });
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao executar consulta",
        variant: "destructive",
      });
    },
  });

  const handleExecute = () => {
    if (!query.trim()) {
      toast({
        title: "Aviso",
        description: "Digite uma consulta SQL primeiro",
        variant: "destructive",
      });
      return;
    }
    executeQueryMutation.mutate(query);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-xl">
        <h2 className="text-xl font-semibold flex items-center">
          <Code className="mr-3" />
          Editor de Consultas SQL
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-2">
              Digite sua consulta SQL:
            </Label>
            <Textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="SELECT * FROM PRODUTO;"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleExecute}
              disabled={executeQueryMutation.isPending}
              className="flex-1 min-w-32 sql-primary font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <Play className="mr-2 w-4 h-4" />
              {executeQueryMutation.isPending ? "Executando..." : "Executar"}
            </Button>
            <Button 
              onClick={handleClear}
              variant="secondary"
              className="flex-1 min-w-32 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              <Eraser className="mr-2 w-4 h-4" />
              Limpar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
