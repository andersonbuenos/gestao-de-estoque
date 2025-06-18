import { useMutation } from "@tanstack/react-query";
import { Lightbulb, Code, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { QueryResult } from "@shared/schema";

interface QueryExamplesProps {
  onQueryResult: (result: QueryResult) => void;
}

const examples = [
  {
    title: "Consultar todos os produtos",
    query: "SELECT * FROM PRODUTO;",
    icon: Code,
    color: "sql-primary"
  },
  {
    title: "Inserir novo produto",
    query: "INSERT INTO PRODUTO (ID, NOME, QUANTIDADE) VALUES (3, 'CAFÉ', 8);",
    icon: Plus,
    color: "sql-success"
  },
  {
    title: "Atualizar quantidade",
    query: "UPDATE PRODUTO SET QUANTIDADE = 15 WHERE ID = 1;",
    icon: Edit,
    color: "sql-accent"
  },
  {
    title: "Remover produto",
    query: "DELETE FROM PRODUTO WHERE ID = 2;",
    icon: Trash2,
    color: "sql-error"
  }
];

export default function QueryExamples({ onQueryResult }: QueryExamplesProps) {
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

  const handleLoadExample = (query: string) => {
    executeQueryMutation.mutate(query);
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-xl">
        <h2 className="text-xl font-semibold flex items-center">
          <Lightbulb className="mr-3" />
          Exemplos de Consultas SQL
        </h2>
      </div>
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {examples.map((example, index) => (
            <Card key={index} className="bg-gray-50 border">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <example.icon className={`mr-2 w-5 h-5 ${
                    example.color === 'sql-primary' ? 'text-blue-600' :
                    example.color === 'sql-success' ? 'text-green-600' :
                    example.color === 'sql-accent' ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                  {example.title}
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="font-mono text-sm bg-white p-3 rounded border">
                  {example.query}
                </div>
                <Button 
                  onClick={() => handleLoadExample(example.query)}
                  disabled={executeQueryMutation.isPending}
                  className={`w-full ${example.color} font-medium py-2 px-4 rounded transition-all`}
                >
                  {executeQueryMutation.isPending ? "Executando..." : "Carregar Exemplo"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
