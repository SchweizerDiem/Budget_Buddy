from app import create_app
from flask import Flask, render_template

print("Aplicação criada com sucesso!")  # Se esta linha executar, o erro está resolvido
app = create_app()

@app.route('/')  # Rota raiz
def home():
    return "Bem-vindo ao BudgetBuddy! Acesse /api/categories ou /api/auth para usar a API."  # Ou retorne um HTML

if __name__ == '__main__':
    app.run()