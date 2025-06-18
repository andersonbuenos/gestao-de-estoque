import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Settings, Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { QueryResult } from "@shared/schema";

interface CrudOperationsProps {
  onQueryResult: (result: QueryResult) => void;
}

interface FormData {
  id: string;
  nome: string;
  quantidade: string;
}

export default function CrudOperations({ onQueryResult }: CrudOperationsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ id: "", nome: "", quantidade: "" });
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
        setIsCreateOpen(false);
        setIsUpdateOpen(false);
        setIsDeleteOpen(false);
        setFormData({ id: "", nome: "", quantidade: "" });
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleRead = () => {
    executeQueryMutation.mutate("SELECT * FROM PRODUTO;");
  };

  const handleCreate = () => {
    if (!formData.id || !formData.nome || !formData.quantidade) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    const query = `INSERT INTO PRODUTO (ID, NOME, QUANTIDADE) VALUES (${formData.id}, '${formData.nome}', ${formData.quantidade});`;
    executeQueryMutation.mutate(query);
  };

  const handleUpdate = () => {
    if (!formData.id || !formData.quantidade) {
      toast({
        title: "Erro",
        description: "ID e Quantidade são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    const query = `UPDATE PRODUTO SET QUANTIDADE = ${formData.quantidade} WHERE ID = ${formData.id};`;
    executeQueryMutation.mutate(query);
  };

  const handleDelete = () => {
    if (!formData.id) {
      toast({
        title: "Erro",
        description: "ID é obrigatório",
        variant: "destructive",
      });
      return;
    }
    const query = `DELETE FROM PRODUTO WHERE ID = ${formData.id};`;
    executeQueryMutation.mutate(query);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-t-xl">
          <h2 className="text-xl font-semibold flex items-center">
            <Settings className="mr-3" />
            Operações CRUD
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* CREATE */}
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="sql-success font-semibold py-4 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg h-auto flex-col"
            >
              <Plus className="text-lg mb-2" />
              <span className="text-sm">CREATE</span>
              <div className="text-xs opacity-80 mt-1">Inserir Produto</div>
            </Button>

            {/* READ */}
            <Button 
              onClick={handleRead}
              disabled={executeQueryMutation.isPending}
              className="sql-primary font-semibold py-4 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg h-auto flex-col"
            >
              <Search className="text-lg mb-2" />
              <span className="text-sm">READ</span>
              <div className="text-xs opacity-80 mt-1">Consultar Dados</div>
            </Button>

            {/* UPDATE */}
            <Button 
              onClick={() => setIsUpdateOpen(true)}
              className="sql-accent font-semibold py-4 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg h-auto flex-col"
            >
              <Edit className="text-lg mb-2" />
              <span className="text-sm">UPDATE</span>
              <div className="text-xs opacity-80 mt-1">Atualizar Produto</div>
            </Button>

            {/* DELETE */}
            <Button 
              onClick={() => setIsDeleteOpen(true)}
              className="sql-error font-semibold py-4 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg h-auto flex-col"
            >
              <Trash2 className="text-lg mb-2" />
              <span className="text-sm">DELETE</span>
              <div className="text-xs opacity-80 mt-1">Remover Produto</div>
            </Button>
          </div>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inserir Novo Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-id">ID</Label>
              <Input
                id="create-id"
                type="number"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="Ex: 3"
              />
            </div>
            <div>
              <Label htmlFor="create-nome">Nome</Label>
              <Input
                id="create-nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: CAFÉ"
              />
            </div>
            <div>
              <Label htmlFor="create-quantidade">Quantidade</Label>
              <Input
                id="create-quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                placeholder="Ex: 8"
              />
            </div>
            <Button onClick={handleCreate} disabled={executeQueryMutation.isPending} className="w-full sql-success">
              {executeQueryMutation.isPending ? "Inserindo..." : "Inserir Produto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="update-id">ID do Produto</Label>
              <Input
                id="update-id"
                type="number"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="Ex: 1"
              />
            </div>
            <div>
              <Label htmlFor="update-quantidade">Nova Quantidade</Label>
              <Input
                id="update-quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                placeholder="Ex: 15"
              />
            </div>
            <Button onClick={handleUpdate} disabled={executeQueryMutation.isPending} className="w-full sql-accent">
              {executeQueryMutation.isPending ? "Atualizando..." : "Atualizar Produto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="delete-id">ID do Produto</Label>
              <Input
                id="delete-id"
                type="number"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="Ex: 2"
              />
            </div>
            <Button onClick={handleDelete} disabled={executeQueryMutation.isPending} className="w-full sql-error">
              {executeQueryMutation.isPending ? "Removendo..." : "Remover Produto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
