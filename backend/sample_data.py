from app import app, db, User, Budget, Expense
from datetime import datetime, timedelta
import random

def create_sample_data():
    with app.app_context():
        # Get the existing user named 'gabriel'
        user = User.query.filter_by(name="gabriel").first()
        if not user:
            print("User 'gabriel' not found!")
            return

        # Create the three specific budgets
        budgets = [
            {
                "name": "Loja do Chico",
                "amount": 5000.00,
                "color": "45 65% 50%",
                "categories": ["Alimentos", "Bebidas", "Limpeza", "Higiene", "Outros"]
            },
            {
                "name": "Loja da Fé",
                "amount": 4000.00,
                "color": "120 65% 50%",
                "categories": ["Alimentos", "Bebidas", "Produtos Religiosos", "Decoração", "Outros"]
            },
            {
                "name": "Boteco",
                "amount": 6000.00,
                "color": "200 65% 50%",
                "categories": ["Bebidas", "Petiscos", "Alimentos", "Entretenimento", "Outros"]
            }
        ]

        created_budgets = []
        for budget_data in budgets:
            budget = Budget(
                name=budget_data["name"],
                amount=budget_data["amount"],
                color=budget_data["color"],
                categories=','.join(budget_data["categories"]),
                user_id=user.id
            )
            db.session.add(budget)
            created_budgets.append(budget)
        db.session.commit()

        # Sample expense categories and their typical amounts for each store
        loja_chico_samples = [
            ("Arroz", "Alimentos", 50.00),
            ("Feijão", "Alimentos", 30.00),
            ("Café", "Alimentos", 25.00),
            ("Refrigerante", "Bebidas", 8.00),
            ("Detergente", "Limpeza", 15.00),
            ("Sabonete", "Higiene", 5.00),
            ("Papel Higiênico", "Higiene", 12.00),
            ("Água Mineral", "Bebidas", 4.00),
            ("Farinha", "Alimentos", 20.00),
            ("Açúcar", "Alimentos", 15.00)
        ]

        loja_fe_samples = [
            ("Vela", "Produtos Religiosos", 10.00),
            ("Imagem", "Decoração", 50.00),
            ("Terço", "Produtos Religiosos", 25.00),
            ("Bíblia", "Produtos Religiosos", 80.00),
            ("Água Benta", "Produtos Religiosos", 15.00),
            ("Café", "Alimentos", 25.00),
            ("Biscoito", "Alimentos", 8.00),
            ("Refrigerante", "Bebidas", 8.00),
            ("Quadro Religioso", "Decoração", 120.00),
            ("Rosário", "Produtos Religiosos", 35.00)
        ]

        boteco_samples = [
            ("Cerveja", "Bebidas", 8.00),
            ("Porção de Batata", "Petiscos", 25.00),
            ("Porção de Pastéis", "Petiscos", 30.00),
            ("Cachaça", "Bebidas", 15.00),
            ("Refrigerante", "Bebidas", 8.00),
            ("Porção de Coxinha", "Petiscos", 28.00),
            ("Porção de Calabresa", "Petiscos", 35.00),
            ("Água", "Bebidas", 4.00),
            ("Porção de Mandioca", "Petiscos", 20.00),
            ("Porção de Frango", "Petiscos", 40.00)
        ]

        # Create expenses for the last 3 months for each store
        for i in range(90):  # 90 days of data
            date = datetime.now() - timedelta(days=i)
            
            # Add 3-5 expenses per day for each store
            for store_idx, store_samples in enumerate([loja_chico_samples, loja_fe_samples, boteco_samples]):
                for _ in range(random.randint(3, 5)):
                    expense_name, category, base_amount = random.choice(store_samples)
                    # Add some randomness to the amount (±20%)
                    amount = base_amount * random.uniform(0.8, 1.2)
                    
                    expense = Expense(
                        name=expense_name,
                        amount=-amount,  # Negative for expenses
                        type="expense",
                        category=category,
                        created_at=date,
                        budget_id=created_budgets[store_idx].id
                    )
                    db.session.add(expense)

            # Add income entries (daily for each store)
            for store_idx, store_name in enumerate(["Loja do Chico", "Loja da Fé", "Boteco"]):
                # Different base amounts for each store
                base_amounts = [2000.00, 1500.00, 3000.00]  # Daily income targets
                amount = base_amounts[store_idx] * random.uniform(0.7, 1.3)  # ±30% variation
                
                income = Expense(
                    name=f"Vendas do dia - {store_name}",
                    amount=amount,  # Positive for income
                    type="income",
                    category="Vendas",
                    created_at=date,
                    budget_id=created_budgets[store_idx].id
                )
                db.session.add(income)

        db.session.commit()
        print("Sample data created successfully!")

if __name__ == "__main__":
    create_sample_data() 