from app import create_app
from app.utils.database import db

app = create_app()

with app.app_context():
    result = db.engine.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    print("Tabelas encontradas:")
    for row in result:
        print(row[0])