# # from django.urls import path

# # from .views import (
# #     RegisterView,
# #     LoginView,
# #     ProfileView,
# #     CategoryListCreateView,
# #     ProductListCreateView,
# #     ProductDetailView,
# #     CartView,
# #     CartItemCreateView,
# #     CartItemDetailView,
# #     OrderListView,
# #     OrderDetailView,
# #     CheckoutView,
# #     AdminOrderListView,
# #     AdminOrderDetailView,
# # )


# # urlpatterns = [

# #     # Authentication
# #     path(
# #         'register/',
# #         RegisterView.as_view(),
# #         name='register'
# #     ),

# #     path(
# #         'login/',
# #         LoginView.as_view(),
# #         name='login'
# #     ),

# #     path(
# #         'profile/',
# #         ProfileView.as_view(),
# #         name='profile'
# #     ),


# #     # Categories
# #     path(
# #         'categories/',
# #         CategoryListCreateView.as_view(),
# #         name='category-list-create'
# #     ),


# #     # Products
# #     path(
# #         'products/',
# #         ProductListCreateView.as_view(),
# #         name='product-list-create'
# #     ),

# #     path(
# #         'products/<int:pk>/',
# #         ProductDetailView.as_view(),
# #         name='product-detail'
# #     ),


# #     # Cart
# #     path(
# #         'cart/',
# #         CartView.as_view(),
# #         name='cart'
# #     ),

# #     path(
# #         'cart/items/',
# #         CartItemCreateView.as_view(),
# #         name='cart-item-create'
# #     ),

# #     path(
# #         'cart/items/<int:pk>/',
# #         CartItemDetailView.as_view(),
# #         name='cart-item-detail'
# #     ),

# #     path(
# #     'orders/',
# #     OrderListView.as_view(),
# #     name='order-list'
# # ),

# # path(
# #     'orders/<int:pk>/',
# #     OrderDetailView.as_view(),
# #     name='order-detail'
# # ),
# # path(
# #     'checkout/',
# #     CheckoutView.as_view(),
# #     name='checkout'
# # ),
# # path(
# #     'admin/orders/',
# #     AdminOrderListView.as_view(),
# #     name='admin-order-list'
# # ),

# # path(
# #     'admin/orders/<int:pk>/',
# #     AdminOrderDetailView.as_view(),
# #     name='admin-order-detail'
# # ),
# # ]


# from django.urls import path
# from .views import (
#     RegisterView,
#     LoginView,
#     ProfileView,
#     CategoryListCreateView,
#     ProductListCreateView,
#     ProductDetailView,
#     CartView,
#     CartItemCreateView,
#     CartItemDetailView,
#     OrderListView,
#     OrderDetailView,
#     CheckoutView,
#     AdminOrderListView,
#     AdminOrderDetailView,
#     CreatePaymentView,
#     VerifyPaymentView,
#     CategoryDetailView,
   
# )
# urlpatterns = [

#     path(
#         'register/',
#         RegisterView.as_view(),
#         name='register'
#     ),

#     path(
#         'login/',
#         LoginView.as_view(),
#         name='login'
#     ),

#     path(
#         'profile/',
#         ProfileView.as_view(),
#         name='profile'
#     ),

#     path(
#         'categories/',
#         CategoryListCreateView.as_view(),
#         name='category-list-create'
#     ),

#     path(
#         'products/',
#         ProductListCreateView.as_view(),
#         name='product-list-create'
#     ),

#     path(
#         'products/<int:pk>/',
#         ProductDetailView.as_view(),
#         name='product-detail'
#     ),

#     path(
#         'cart/',
#         CartView.as_view(),
#         name='cart'
#     ),

#     path(
#         'cart/items/',
#         CartItemCreateView.as_view(),
#         name='cart-item-create'
#     ),

#     path(
#         'cart/items/<int:pk>/',
#         CartItemDetailView.as_view(),
#         name='cart-item-detail'
#     ),

#     path(
#         'orders/',
#         OrderListView.as_view(),
#         name='order-list'
#     ),

#     path(
#         'orders/<int:pk>/',
#         OrderDetailView.as_view(),
#         name='order-detail'
#     ),

#     path(
#         'checkout/',
#         CheckoutView.as_view(),
#         name='checkout'
#     ),

#     # Admin Orders
#     path(
#         'admin/orders/',
#         AdminOrderListView.as_view(),
#         name='admin-order-list'
#     ),

#     path(
#         'admin/orders/<int:pk>/',
#         AdminOrderDetailView.as_view(),
#         name='admin-order-detail'
#     ),

#     path('payment/create/', CreatePaymentView.as_view(), name='create-payment'),
#     path(
#     'payment/verify/',
#     VerifyPaymentView.as_view(),
#     name='verify-payment'
# ),
# path(
#     'categories/<int:pk>/',
#     CategoryDetailView.as_view(),
#     name='category-detail'
# ),

# ]

from django.urls import path

from .views import (
    # Authentication
    RegisterView,
    LoginView,
    ProfileView,

    # Categories
    CategoryListCreateView,
    CategoryDetailView,

    # Products
    ProductListCreateView,
    ProductDetailView,

    # Cart
    CartView,
    CartItemCreateView,
    CartItemDetailView,

    # Orders
    OrderListView,
    OrderDetailView,
    CheckoutView,

    # Admin Orders
    AdminOrderListView,
    AdminOrderDetailView,

    # Admin Cart
    AdminCartListView,
    AdminCartItemListView,

    # Admin Order Items
    AdminOrderItemListView,

    # Admin Payments
    AdminPaymentListView,

    # Admin Users
    AdminUserListView,

    # Payments
    CreatePaymentView,
    VerifyPaymentView,
)


urlpatterns = [

    # ========================================================
    # AUTHENTICATION
    # ========================================================

    path(
        'register/',
        RegisterView.as_view(),
        name='register'
    ),

    path(
        'login/',
        LoginView.as_view(),
        name='login'
    ),

    path(
        'profile/',
        ProfileView.as_view(),
        name='profile'
    ),


    # ========================================================
    # CATEGORIES
    # ========================================================

    path(
        'categories/',
        CategoryListCreateView.as_view(),
        name='category-list-create'
    ),

    path(
        'categories/<int:pk>/',
        CategoryDetailView.as_view(),
        name='category-detail'
    ),


    # ========================================================
    # PRODUCTS
    # ========================================================

    path(
        'products/',
        ProductListCreateView.as_view(),
        name='product-list-create'
    ),

    path(
        'products/<int:pk>/',
        ProductDetailView.as_view(),
        name='product-detail'
    ),


    # ========================================================
    # CART
    # ========================================================

    path(
        'cart/',
        CartView.as_view(),
        name='cart'
    ),

    path(
        'cart/items/',
        CartItemCreateView.as_view(),
        name='cart-item-create'
    ),

    path(
        'cart/items/<int:pk>/',
        CartItemDetailView.as_view(),
        name='cart-item-detail'
    ),


    # ========================================================
    # USER ORDERS
    # ========================================================

    path(
        'orders/',
        OrderListView.as_view(),
        name='order-list'
    ),

    path(
        'orders/<int:pk>/',
        OrderDetailView.as_view(),
        name='order-detail'
    ),


    # ========================================================
    # CHECKOUT
    # ========================================================

    path(
        'checkout/',
        CheckoutView.as_view(),
        name='checkout'
    ),


    # ========================================================
    # ADMIN - ORDERS
    # ========================================================

    path(
        'admin/orders/',
        AdminOrderListView.as_view(),
        name='admin-order-list'
    ),

    path(
        'admin/orders/<int:pk>/',
        AdminOrderDetailView.as_view(),
        name='admin-order-detail'
    ),


    # ========================================================
    # ADMIN - CARTS
    # ========================================================

    path(
        'admin/carts/',
        AdminCartListView.as_view(),
        name='admin-cart-list'
    ),


    # ========================================================
    # ADMIN - CART ITEMS
    # ========================================================

    path(
        'admin/cart-items/',
        AdminCartItemListView.as_view(),
        name='admin-cart-item-list'
    ),


    # ========================================================
    # ADMIN - ORDER ITEMS
    # ========================================================

    path(
        'admin/order-items/',
        AdminOrderItemListView.as_view(),
        name='admin-order-item-list'
    ),


    # ========================================================
    # ADMIN - PAYMENTS
    # ========================================================

    path(
        'admin/payments/',
        AdminPaymentListView.as_view(),
        name='admin-payment-list'
    ),


    # ========================================================
    # ADMIN - USERS
    # ========================================================

    path(
        'admin/users/',
        AdminUserListView.as_view(),
        name='admin-user-list'
    ),


    # ========================================================
    # RAZORPAY PAYMENT
    # ========================================================

    path(
        'payment/create/',
        CreatePaymentView.as_view(),
        name='create-payment'
    ),

    path(
        'payment/verify/',
        VerifyPaymentView.as_view(),
        name='verify-payment'
    ),
]