# from django.contrib import admin

# from .models import (
#     Category,
#     Product,
#     Cart,
#     CartItem,
#     Order,
#     OrderItem,
# )


# @admin.register(Order)
# class OrderAdmin(admin.ModelAdmin):
# # 
#     list_display = [
#         'id',
#         'user',
#         'total_amount',
#         'status',
#         'created_at',
#     ]

#     list_filter = [
#         'status',
#         'created_at',
#     ]

#     search_fields = [
#         'user__username',
#     ]


# @admin.register(OrderItem)
# class OrderItemAdmin(admin.ModelAdmin):

#     list_display = [
#         'id',
#         'order',
#         'product',
#         'quantity',
#         'price',
#     ]


from django.contrib import admin

from .models import (
    Category,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Payment,
    
)


# =========================================================
# CATEGORY
# =========================================================

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'name',
        'description',
    ]

    search_fields = [
        'name',
        'description',
    ]

    ordering = [
        'name',
    ]


# =========================================================
# PRODUCT
# =========================================================

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'name',
        'category',
        'price',
        'stock',
        'available',
        'created_at',
        'updated_at',
    ]

    list_filter = [
        'category',
        'available',
        'created_at',
    ]

    search_fields = [
        'name',
        'description',
        'category__name',
    ]

    ordering = [
        '-created_at',
    ]

    list_editable = [
        'price',
        'stock',
        'available',
    ]

    readonly_fields = [
        'created_at',
        'updated_at',
    ]

    fieldsets = (
        (
            'Product Information',
            {
                'fields': (
                    'name',
                    'category',
                    'description',
                    'image',
                )
            },
        ),
        (
            'Inventory & Pricing',
            {
                'fields': (
                    'price',
                    'stock',
                    'available',
                )
            },
        ),
        (
            'Timestamps',
            {
                'fields': (
                    'created_at',
                    'updated_at',
                )
            },
        ),
    )


# =========================================================
# CART ITEM INLINE
# =========================================================

class CartItemInline(admin.TabularInline):

    model = CartItem

    extra = 0

    fields = [
        'product',
        'get_product_price',
        'quantity',
        'get_total_price',
        'added_at',
    ]

    readonly_fields = [
        'get_product_price',
        'get_total_price',
        'added_at',
    ]

    ordering = [
        '-added_at',
    ]

    def get_product_price(self, obj):

        if obj.product:
            return obj.product.price

        return 0

    get_product_price.short_description = 'Product Price'

    def get_total_price(self, obj):

        if obj.product:
            return obj.product.price * obj.quantity

        return 0

    get_total_price.short_description = 'Total Price'


# =========================================================
# CART
# =========================================================

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'user',
        'get_item_count',
        'get_cart_total',
        'created_at',
        'updated_at',
    ]

    search_fields = [
        'user__username',
        'user__email',
    ]

    ordering = [
        '-created_at',
    ]

    readonly_fields = [
        'created_at',
        'updated_at',
        'get_item_count',
        'get_cart_total',
    ]

    fields = [
        'user',
        'get_item_count',
        'get_cart_total',
        'created_at',
        'updated_at',
    ]

    inlines = [
        CartItemInline,
    ]

    def get_item_count(self, obj):

        return obj.items.count()

    get_item_count.short_description = 'Items'

    def get_cart_total(self, obj):

        total = 0

        for item in obj.items.select_related('product'):
            total += item.product.price * item.quantity

        return total

    get_cart_total.short_description = 'Cart Total'


# =========================================================
# CART ITEM
# =========================================================

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'cart',
        'get_username',
        'product',
        'get_product_price',
        'quantity',
        'get_total_price',
        'added_at',
    ]

    list_filter = [
        'added_at',
    ]

    search_fields = [
        'cart__user__username',
        'cart__user__email',
        'product__name',
    ]

    ordering = [
        '-added_at',
    ]

    readonly_fields = [
        'get_username',
        'get_product_price',
        'get_total_price',
        'added_at',
    ]

    def get_username(self, obj):

        return obj.cart.user.username

    get_username.short_description = 'User'

    def get_product_price(self, obj):

        return obj.product.price

    get_product_price.short_description = 'Product Price'

    def get_total_price(self, obj):

        return obj.product.price * obj.quantity

    get_total_price.short_description = 'Total Price'


# =========================================================
# ORDER ITEM INLINE
# =========================================================

class OrderItemInline(admin.TabularInline):

    model = OrderItem

    extra = 0

    fields = [
        'product',
        'quantity',
        'price',
        'get_total_price',
    ]

    readonly_fields = [
        'get_total_price',
    ]

    ordering = [
        'id',
    ]

    def get_total_price(self, obj):

        return obj.price * obj.quantity

    get_total_price.short_description = 'Total Price'


# =========================================================
# ORDER
# =========================================================

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'user',
        'total_amount',
        'status',
        'get_item_count',
        'address',
        'created_at',
        'updated_at',
    ]

    list_filter = [
        'status',
        'created_at',
        'updated_at',
    ]

    search_fields = [
        'user__username',
        'user__email',
        'address',
    ]

    ordering = [
        '-created_at',
    ]

    readonly_fields = [
        'created_at',
        'updated_at',
        'get_item_count',
    ]

    fields = [
        'user',
        'total_amount',
        'status',
        'address',
        'get_item_count',
        'created_at',
        'updated_at',
    ]

    inlines = [
        OrderItemInline,
    ]

    def get_item_count(self, obj):

        return obj.items.count()

    get_item_count.short_description = 'Items'


# =========================================================
# ORDER ITEM
# =========================================================

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'order',
        'get_username',
        'product',
        'quantity',
        'price',
        'get_total_price',
    ]

    search_fields = [
        'order__user__username',
        'order__user__email',
        'product__name',
    ]

    list_filter = [
        'product',
    ]

    ordering = [
        '-id',
    ]

    readonly_fields = [
        'get_username',
        'get_total_price',
    ]

    def get_username(self, obj):

        return obj.order.user.username

    get_username.short_description = 'User'

    def get_total_price(self, obj):

        return obj.price * obj.quantity

    get_total_price.short_description = 'Total Price'


# =========================================================
# PAYMENT
# =========================================================

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'order',
        'get_username',
        'razorpay_order_id',
        'razorpay_payment_id',
        'amount',
        'status',
        'created_at',
        'updated_at',
    ]

    list_filter = [
        'status',
        'created_at',
        'updated_at',
    ]

    search_fields = [
        'razorpay_order_id',
        'razorpay_payment_id',
        'order__user__username',
        'order__user__email',
    ]

    ordering = [
        '-created_at',
    ]

    readonly_fields = [
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
        'amount',
        'created_at',
        'updated_at',
    ]

    fieldsets = (
        (
            'Payment Information',
            {
                'fields': (
                    'order',
                    'amount',
                    'status',
                )
            },
        ),
        (
            'Razorpay Information',
            {
                'fields': (
                    'razorpay_order_id',
                    'razorpay_payment_id',
                    'razorpay_signature',
                )
            },
        ),
        (
            'Timestamps',
            {
                'fields': (
                    'created_at',
                    'updated_at',
                )
            },
        ),
    )

    def get_username(self, obj):

        return obj.order.user.username

    get_username.short_description = 'User'

