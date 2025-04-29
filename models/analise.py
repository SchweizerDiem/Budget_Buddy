from user import user
import pandas as pd
import matplotlib.pyplot as plt

class Analise:
    def __init__(self, user) -> None:
        self.user = user
        # print(self.user.get_categories())

    def plot_wheel(self):
        # Gathering data properly
        data = {'Category': list(self.user.get_categories()),
                'Values': self.user.get_amounts()}

        # Creating a DataFrame
        df = pd.DataFrame(data)

        # Plot a pie chart
        df.plot(kind='pie', y='Values', labels=df['Category'], autopct='%1.1f%%', legend=False)
        plt.title('Expense Distribution')
        plt.show()

# Assuming `user` class is defined with methods to get category and transaction data
usr = user()
usr.add_category("Vendas")
usr.add_category("Compra")
usr.add_transaction(130, "expense", "Vendas")
usr.add_transaction(142, "income", "Compra")
#
# print("#####")
# usr.edit_category("Vendas", "NovaVenda")

# print(usr.get_categories())
# print(usr.get_transactions())

# Analyze and plot
analysis = Analise(usr)
analysis.plot_wheel()
