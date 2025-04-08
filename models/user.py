from enum import Enum


class Role(Enum):
    MANAGEMENT = "management"
    SALES = "sales"


class User:
    def __init__(self, user_id, name, role, store_id):
        self.user_id = user_id
        self.name = name
        self.role = role
        self.store_id = store_id

    def __str__(self):
        return f"User(ID: {self.user_id}, Name: {self.name}, Role: {self.role.value}, Store ID: {self.store_id})"

    def is_management(self):
        return self.role == Role.MANAGEMENT

    def is_sales(self):
        return self.role == Role.SALES

    def has_permission(self, action):

        # Dictionary which holds a list of permissions for each role
        permissions = {
            Role.MANAGEMENT: ["view_reports", "manage_users", "approve_transactions"],
            Role.SALES: ["record_sales", "view_inventory"]
        }
        return action in permissions[self.role]
