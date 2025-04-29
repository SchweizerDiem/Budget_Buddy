from datetime import datetime
import uuid

class user:
    def __init__ (self):
        self.id = str(uuid.uuid4())  # Generate unique ID for transaction
        self.category = []
        self.transactions = []


    def add_category(self, name_of_category: str):
        self.category.append(name_of_category)

    def del_category(self, name_of_category: str):
        self.category.pop(self.category.index(name_of_category))

    def edit_category(self, name_of_category: str, new_name: str):
        list = self.category
        list[list.index(name_of_category)] = new_name
        print(self.category)

    # NOTE: TRANSACTIONS
    def add_transaction(self, amount: float, tipo: str, category: str,
                        date=datetime.now().strftime("%d-%m-%Y"),
                        description=None):

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
    
    def get_expenses(self):
        expense_list = []
        for i in self.transactions:
            if i[2] == 'expense':
                expense_list.append(i[0])

    def get_categories(self):
        categories = set()
        for transaction in self.transactions:
            categories.add(transaction[2])
        return categories

    def get_amounts(self):

        # Create empty set that will hold both the type of transaction and the 
        # amount of the payment.
        tipo_sums = {}
        for row in self.transactions:
            # Depackaging the elements of transaction[i]
            amount, description, tipo, category, date = row
            if tipo not in tipo_sums:
                tipo_sums[tipo] = 0
            tipo_sums[tipo] += amount

        # Return only the values of the hashtable `tipo_sums`.
        result = list(tipo_sums.values())

        # Order? There's no need to worry about the order in which the types are
        # gonna be placed since both the get_categories() and this function are
        # using sets that take the first occurency of the type. This means that
        # both functions are organizing the order using the same method.
        return result


usr = user()
usr.add_category("Vendas")
usr.add_category("Compra")
usr.add_category("Circo")
usr.add_transaction(130, "expense", "Vendas")
usr.add_transaction(142, "income", "Compra")
usr.add_transaction(100, "income", "Compra")
# print(usr.transactions)
usr.get_amounts()
