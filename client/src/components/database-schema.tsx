import { Table } from "lucide-react";

export default function DatabaseSchema() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
        <h2 className="text-xl font-semibold flex items-center">
          <Table className="mr-3" />
          Esquema do Banco de Dados - LOJA
        </h2>
      </div>
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
          <div className="text-gray-600 mb-2">-- Estrutura da Tabela PRODUTO</div>
          <div className="text-blue-600 font-medium">CREATE TABLE PRODUTO (</div>
          <div className="ml-4 space-y-1">
            <div>ID <span className="text-yellow-600">INT</span>,</div>
            <div>NOME <span className="text-yellow-600">VARCHAR(50)</span>,</div>
            <div>QUANTIDADE <span className="text-yellow-600">INT</span></div>
          </div>
          <div className="text-blue-600 font-medium">);</div>
        </div>
      </div>
    </div>
  );
}
