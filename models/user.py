from datetime import datetime
import uuid

class user:
    def __init__ (self):
        self.id = str(uuid.uuid4())  # Generate unique ID for transaction
        self.category = []
        self.transactions = []


    # NOTE: TRANSACTIONS
    def add_category(self, name_of_category: str):
        self.category.append(name_of_category)

    def add_transaction(self, amount, tipo, category, date=datetime.now().strftime("%d-%m-%Y"), description=None):
        if category in self.category:
            self.transactions.append([amount, description, tipo, category, date])

    # NOTE: DEL
    def del_transaction(self):
        for i, tra in enumerate(self.transactions):
            print(f"{i} {tra}")
        self.transactions.pop(int(input("Type the index: ")))

    # NOTE: EDIT
    def edit_transaction(self):
        for i, tra in enumerate(self.transactions):
            print(f"{i} {tra}")
        trans = int(input("Select transaction: "))
        while True:
            print("1. Amount")
            print("2. Description")
            print("3. Type")
            print("4. Category")
            print("5. Date")
            option = int(input("Select field: "))

            match option:
                case 1:
                    self.transactions[trans][0] = int(input("New Amount: "))
                    print("Edited ", self.transactions[trans][0])
                    print(self.transactions[trans])
                case 1:
                    self.transactions[trans][1] = input("New Description: ")
                    print("Edited ", self.transactions[trans][1])
                    print(self.transactions[trans])
                case 1:
                    self.transactions[trans][2] = input("New type: ")
                    print("Edited ", self.transactions[trans][2])
                    print(self.transactions[trans])
                case 1:
                    self.transactions[trans][3] = input("New Category: ")
                    print("Edited ", self.transactions[trans][3])
                    print(self.transactions[trans])
                case 1:
                    self.transactions[trans][4] = input("New Date (%d-%m-%Y): ")
                    print("Edited ", self.transactions[trans][4])
                    print(self.transactions[trans])
                case _:
                    print("Not a valid option!!")

    def __str__(self) -> str:
        return f"{self.id}\n{self.transactions}"

usr = user()
usr.add_category("Vendas")
usr.add_category("Compra")
usr.add_transaction(130, "expense", "Vendas")
usr.add_transaction(142, "income", "Compra")
print("######")
usr.edit_transaction()
