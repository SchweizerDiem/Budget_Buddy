from enum import Enum
from typing import Dict, List, Optional
import os

class CategoryType(Enum):
    INCOME = "Receita"
    EXPENSE = "Despesa"

class CategoryManager:
    def __init__(self):
        self.categories: Dict[int, Dict] = {}
        self.next_id = 1
        self._add_predefined_categories()

    def _add_predefined_categories(self):
        predefined = [
            ("Restauração", CategoryType.EXPENSE),
            ("Combustível", CategoryType.EXPENSE),
            ("Educação", CategoryType.EXPENSE),
            ("Fardas", CategoryType.EXPENSE),
            ("Salários", CategoryType.EXPENSE),
            ("Vendas", CategoryType.INCOME)
        ]
        for name, cat_type in predefined:
            self.create(name, cat_type)

    def create(self, name: str, cat_type: CategoryType) -> Dict:
        if any(c["name"].lower() == name.lower() for c in self.categories.values()):
            raise ValueError("Categoria já existe!")
        new_id = self.next_id
        self.categories[new_id] = {"id": new_id, "name": name, "type": cat_type}
        self.next_id += 1
        return self.categories[new_id]

    def update(self, cat_id: int, new_name: str, new_type: CategoryType) -> Dict:
        cat = self.categories.get(cat_id)
        if not cat:
            raise ValueError("Categoria não encontrada!")

        if new_name.lower() != cat["name"].lower():
            if any(c["name"].lower() == new_name.lower() 
                    for c in self.categories.values() 
                    if c["id"] != cat_id):
                raise ValueError("Já existe outra categoria com este nome!")

        cat["name"] = new_name
        cat["type"] = new_type
        
        return cat

    def delete(self, cat_id: int) -> None:
        if cat_id not in self.categories:
            raise ValueError("Categoria não encontrada!")
        del self.categories[cat_id]

    def list_by_type(self, cat_type: CategoryType) -> List[Dict]:
        return [c for c in self.categories.values() if c["type"] == cat_type]

def print_categories(categories: List[Dict], category_type: str):
    """Formata a exibição das categorias de forma legível"""
    print(f"\n=== {category_type.upper()} ===")
    if not categories:
        print("  Nenhuma categoria encontrada")
        return
    
    for cat in categories:
        print(f"  ID {cat['id']:2} → {cat['name']}")

def cls():
    os.system('cls' if os.name=='nt' else 'clear')

def main():
    manager = CategoryManager()
    while True:
        print("\n" + "=" * 30)
        print("MENU PRINCIPAL".center(30))
        print("=" * 30)
        print("1. Listar categorias")
        print("2. Criar nova categoria")
        print("3. Editar categoria")
        print("4. Excluir categoria")
        print("5. Sair")
        
        op = input("\nOpção: ").strip()

        try:
            if op == "1":
                print_categories(manager.list_by_type(CategoryType.EXPENSE), "Despesas")
                print_categories(manager.list_by_type(CategoryType.INCOME), "Receitas")

            elif op == "2":
                nome = input("Nome: ").strip()
                tipo_choice = input("Tipo (1-Despesa, 2-Receita): ").strip()
                tipo = CategoryType.EXPENSE if tipo_choice == "1" else CategoryType.INCOME
                manager.create(nome, tipo)
                print("\nCategoria criada com sucesso!")

            elif op == "3":
                cat_id = int(input("ID da categoria: ").strip())
                novo_nome = input("Novo nome: ").strip()
                tipo_choice = input("Tipo (1-Despesa, 2-Receita): ").strip()
                tipo = CategoryType.EXPENSE if tipo_choice == "1" else CategoryType.INCOME
                manager.update(cat_id, novo_nome, tipo)
                print("\nCategoria atualizada!")

            elif op == "4":
                cat_id = int(input("ID da categoria: ").strip())
                manager.delete(cat_id)
                print("\nCategoria excluída!")

            elif op == "5":
                print("\nAté logo! ")
                break

            else:
                print("\n Opção inválida!")

        except ValueError as e:
            print(f"\nErro: {e}")
        except Exception as e:
            print(f"\n‼Erro inesperado: {str(e)}")

        input("\nPressione Enter para continuar...")
        cls()
        

if __name__ == "__main__":
    main()
