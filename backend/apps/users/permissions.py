from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'super_admin'


class IsAdminOrAbove(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['super_admin', 'admin']


class IsEditorOrAbove(BasePermission):
    ALLOWED = ['super_admin', 'admin', 'marketing', 'editor']

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in self.ALLOWED


class IsSalesOrAbove(BasePermission):
    ALLOWED = ['super_admin', 'admin', 'sales']

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in self.ALLOWED


class IsAgentOrAbove(BasePermission):
    ALLOWED = ['super_admin', 'admin', 'sales', 'agent']

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in self.ALLOWED
