# from django.db import transaction
# from django.conf import settings
# from rest_framework import generics
# from rest_framework.permissions import IsAdminUser

# from rest_framework import generics, status
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework.response import Response

# from rest_framework.filters import SearchFilter, OrderingFilter
# from django_filters.rest_framework import DjangoFilterBackend


# import razorpay

# from .models import (
#     Category,
#     Product,
#     Cart,
#     CartItem,
#     Order,
#     OrderItem,
#     Payment,
# )

# from .permissions import (
#     IsAdminOrReadOnly,
#     IsAdmin,
# )

# from .serializers.registerserial import RegisterSerializer
# from .serializers.loginserial import LoginSerializer
# from .serializers.profileserial import ProfileSerializer

# from .serializers.productserial import (
#     CategorySerializer,
#     ProductSerializer,
# )

# from .serializers.cartserial import (
#     CartSerializer,
#     CartItemSerializer,
# )

# from .serializers.orderserial import (
#     OrderSerializer,
#     OrderItemSerializer,
# )


# # =========================================================
# # AUTHENTICATION
# # =========================================================

# class RegisterView(generics.CreateAPIView):
#     serializer_class = RegisterSerializer
#     permission_classes = [AllowAny]


# class LoginView(generics.GenericAPIView):
#     serializer_class = LoginSerializer
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = self.get_serializer(data=request.data)

#         serializer.is_valid(raise_exception=True)

#         return Response(
#             serializer.validated_data,
#             status=status.HTTP_200_OK
#         )


# class ProfileView(generics.RetrieveAPIView):
#     serializer_class = ProfileSerializer
#     permission_classes = [IsAuthenticated]

#     def get_object(self):
#         return self.request.user


# # =========================================================
# # CATEGORY
# # =========================================================

# class CategoryListCreateView(generics.ListCreateAPIView):

#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer
#     permission_classes = [IsAdminOrReadOnly]



# class CategoryDetailView(
#     generics.RetrieveUpdateDestroyAPIView
# ):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer
#     permission_classes = [IsAdminUser]



# # =========================================================
# # PRODUCT
# # =========================================================

# # =========================================================
# # PRODUCT
# # =========================================================

# class ProductListCreateView(generics.ListCreateAPIView):

#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer
#     permission_classes = [IsAdminOrReadOnly]

#     filter_backends = [
#         DjangoFilterBackend,
#         SearchFilter,
#         OrderingFilter,
#     ]

#     # SEARCH
#     search_fields = [
#         'name',
#         'description',
#     ]

#     # FILTER
#     filterset_fields = [
#         'category',
#         'available',
#     ]

#     # ORDERING
#     ordering_fields = [
#         'name',
#         'price',
#         'stock',
#         'created_at',
#     ]

#     ordering = ['-created_at']


# class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):

#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer
#     permission_classes = [IsAdminOrReadOnly]





# # =========================================================
# # CART
# # =========================================================

# class CartView(generics.RetrieveAPIView):

#     serializer_class = CartSerializer
#     permission_classes = [IsAuthenticated]

#     def get_object(self):

#         cart, created = Cart.objects.get_or_create(
#             user=self.request.user
#         )

#         return cart


# class CartItemCreateView(generics.CreateAPIView):
#     serializer_class = CartItemSerializer
#     permission_classes = [IsAuthenticated]

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         cart, created = Cart.objects.get_or_create(
#             user=request.user
#         )

#         product = serializer.validated_data["product"]
#         quantity = serializer.validated_data.get("quantity", 1)

#         cart_item = CartItem.objects.filter(
#             cart=cart,
#             product=product
#         ).first()

#         if cart_item:
#             cart_item.quantity += quantity
#             cart_item.save(update_fields=["quantity"])
#         else:
#             cart_item = CartItem.objects.create(
#                 cart=cart,
#                 product=product,
#                 quantity=quantity
#             )

#         response_serializer = self.get_serializer(cart_item)

#         return Response(
#             response_serializer.data,
#             status=status.HTTP_201_CREATED
#         )
# class CartItemDetailView(
#     generics.RetrieveUpdateDestroyAPIView
# ):

#     serializer_class = CartItemSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):

#         cart, created = Cart.objects.get_or_create(
#             user=self.request.user
#         )

#         return CartItem.objects.filter(
#             cart=cart
#         )


# # =========================================================
# # ORDERS - USER
# # =========================================================

# class OrderListView(generics.ListAPIView):

#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):

#         return Order.objects.filter(
#             user=self.request.user
#         ).order_by('-created_at')


# class OrderDetailView(generics.RetrieveAPIView):

#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):

#         return Order.objects.filter(
#             user=self.request.user
#         )


# # =========================================================
# # CHECKOUT
# # =========================================================

# class CheckoutView(generics.GenericAPIView):

#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated]

#     @transaction.atomic
#     def post(self, request):

#         # ---------------------------------------------
#         # Get user's cart
#         # ---------------------------------------------

#         try:

#             cart = Cart.objects.get(
#                 user=request.user
#             )

#         except Cart.DoesNotExist:

#             return Response(
#                 {
#                     'error': 'Cart is empty'
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # ---------------------------------------------
#         # Get cart items
#         # ---------------------------------------------

#         cart_items = cart.items.select_related(
#             'product'
#         )

#         if not cart_items.exists():

#             return Response(
#                 {
#                     'error': 'Cart is empty'
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # ---------------------------------------------
#         # Validate products and stock
#         # ---------------------------------------------

#         for item in cart_items:

#             product = item.product

#             if not product.available:

#                 return Response(
#                     {
#                         'error': (
#                             f'{product.name} '
#                             f'is not available'
#                         )
#                     },
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             if item.quantity > product.stock:

#                 return Response(
#                     {
#                         'error': (
#                             f'Only {product.stock} '
#                             f'{product.name} available'
#                         )
#                     },
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#         # ---------------------------------------------
#         # Get address
#         # ---------------------------------------------

#         address = request.data.get('address')

#         if not address:

#             return Response(
#                 {
#                     'error': 'Address is required'
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # ---------------------------------------------
#         # Calculate total amount
#         # ---------------------------------------------

#         total_amount = sum(
#             item.product.price * item.quantity
#             for item in cart_items
#         )

#         # ---------------------------------------------
#         # Create order
#         # ---------------------------------------------

#         order = Order.objects.create(
#             user=request.user,
#             total_amount=total_amount,
#             address=address,
#             status='pending'
#         )

#         # ---------------------------------------------
#         # Create order items
#         # ---------------------------------------------

#         for item in cart_items:

#             product = item.product

#             OrderItem.objects.create(
#                 order=order,
#                 product=product,
#                 quantity=item.quantity,
#                 price=product.price
#             )

#             # Reduce product stock
#             product.stock -= item.quantity

#             product.save(
#                 update_fields=['stock']
#             )

#         # ---------------------------------------------
#         # Clear cart
#         # ---------------------------------------------

#         cart.items.all().delete()

#         # ---------------------------------------------
#         # Return order
#         # ---------------------------------------------

#         serializer = OrderSerializer(order)

#         return Response(
#             serializer.data,
#             status=status.HTTP_201_CREATED
#         )


# # =========================================================
# # ADMIN - ORDERS
# # =========================================================

# class AdminOrderListView(generics.ListAPIView):

#     queryset = Order.objects.all().order_by(
#         '-created_at'
#     )

#     serializer_class = OrderSerializer
#     permission_classes = [IsAdmin]


# class AdminOrderDetailView(
#     generics.RetrieveUpdateAPIView
# ):

#     queryset = Order.objects.all()

#     serializer_class = OrderSerializer

#     permission_classes = [IsAdmin]


# # =========================================================
# # RAZORPAY PAYMENT
# # =========================================================

# class CreatePaymentView(generics.GenericAPIView):

#     permission_classes = [IsAuthenticated]

#     def post(self, request):

#         # ---------------------------------------------
#         # Get order ID
#         # ---------------------------------------------

#         order_id = request.data.get('order_id')

#         if not order_id:

#             return Response(
#                 {
#                     'error': 'order_id is required'
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # ---------------------------------------------
#         # Get user's order
#         # ---------------------------------------------

#         try:

#             order = Order.objects.get(
#                 id=order_id,
#                 user=request.user
#             )

#         except Order.DoesNotExist:

#             return Response(
#                 {
#                     'error': 'Order not found'
#                 },
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         # ---------------------------------------------
#         # Check order status
#         # ---------------------------------------------

#         if order.status != 'pending':

#             return Response(
#                 {
#                     'error': (
#                         'Payment can only be made '
#                         'for pending orders'
#                     )
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # ---------------------------------------------
#         # Check Razorpay credentials
#         # ---------------------------------------------

#         if not settings.RAZORPAY_KEY_ID:
#             return Response(
#                 {
#                     'error': 'Razorpay Key ID is not configured'
#                 },
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

#         if not settings.RAZORPAY_KEY_SECRET:
#             return Response(
#                 {
#                     'error': 'Razorpay Key Secret is not configured'
#                 },
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

#         # ---------------------------------------------
#         # Create Razorpay client
#         # ---------------------------------------------

#         client = razorpay.Client(
#             auth=(
#                 settings.RAZORPAY_KEY_ID,
#                 settings.RAZORPAY_KEY_SECRET
#             )
#         )

#         # ---------------------------------------------
#         # Create Razorpay order
#         # ---------------------------------------------

#         razorpay_order = client.order.create(
#             {
#                 'amount': int(
#                     order.total_amount * 100
#                 ),
#                 'currency': 'INR',
#                 'receipt': f'order_{order.id}',
#             }
#         )

#         # ---------------------------------------------
#         # Save payment in database
#         # ---------------------------------------------

#         payment = Payment.objects.create(
#             order=order,
#             razorpay_order_id=razorpay_order['id'],
#             amount=order.total_amount,
#             status='created'
#         )

#         # ---------------------------------------------
#         # Return payment information
#         # ---------------------------------------------

#         return Response(
#             {
#                 'payment_id': payment.id,
#                 'order_id': order.id,
#                 'razorpay_order_id': (
#                     razorpay_order['id']
#                 ),
#                 'amount': order.total_amount,
#                 'currency': 'INR',
#                 'razorpay_key_id': (
#                     settings.RAZORPAY_KEY_ID
#                 ),
#             },
#             status=status.HTTP_201_CREATED
#         )


# class VerifyPaymentView(generics.GenericAPIView):

#     permission_classes = [IsAuthenticated]

#     def post(self, request):

#         razorpay_order_id = request.data.get(
#             'razorpay_order_id'
#         )

#         razorpay_payment_id = request.data.get(
#             'razorpay_payment_id'
#         )

#         razorpay_signature = request.data.get(
#             'razorpay_signature'
#         )

#         if not all([
#             razorpay_order_id,
#             razorpay_payment_id,
#             razorpay_signature
#         ]):

#             return Response(
#                 {
#                     'error': 'Payment details are required'
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:

#             payment = Payment.objects.get(
#                 razorpay_order_id=razorpay_order_id,
#                 order__user=request.user
#             )

#         except Payment.DoesNotExist:

#             return Response(
#                 {
#                     'error': 'Payment record not found'
#                 },
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         client = razorpay.Client(
#             auth=(
#                 settings.RAZORPAY_KEY_ID,
#                 settings.RAZORPAY_KEY_SECRET
#             )
#         )

#         try:

#             client.utility.verify_payment_signature(
#                 {
#                     'razorpay_order_id': razorpay_order_id,
#                     'razorpay_payment_id': razorpay_payment_id,
#                     'razorpay_signature': razorpay_signature,
#                 }
#             )

#         except razorpay.errors.SignatureVerificationError:

#             payment.status = 'failed'
#             payment.save(
#                 update_fields=['status']
#             )

#             return Response(
#                 {
#                     'error': 'Payment verification failed'
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # Payment verified successfully

#         payment.razorpay_payment_id = (
#             razorpay_payment_id
#         )

#         payment.razorpay_signature = (
#             razorpay_signature
#         )

#         payment.status = 'paid'

#         payment.save()

#         # Confirm order

#         payment.order.status = 'confirmed'

#         payment.order.save(
#             update_fields=['status']
#         )

#         return Response(
#             {
#                 'message': 'Payment verified successfully',
#                 'payment_id': payment.id,
#                 'order_id': payment.order.id,
#                 'status': payment.status,
#                 'order_status': payment.order.status,
#             },
#             status=status.HTTP_200_OK
#         )


from django.conf import settings
from django.db import transaction
from django.contrib.auth.models import User

import razorpay

from rest_framework import generics, status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser,
)
from rest_framework.response import Response
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import (
    Category,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Payment,
)

from .permissions import IsAdminOrReadOnly, IsAdmin

from .serializers.registerserial import RegisterSerializer
from .serializers.loginserial import LoginSerializer
from .serializers.profileserial import ProfileSerializer
from .serializers.productserial import (
    CategorySerializer,
    ProductSerializer,
)
from .serializers.cartserial import (
    CartSerializer,
    CartItemSerializer,
)
from .serializers.orderserial import (
    OrderSerializer,
    OrderItemSerializer,
)


# ============================================================
# REGISTER
# ============================================================

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


# ============================================================
# LOGIN
# ============================================================

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        return Response(
            serializer.validated_data,
            status=status.HTTP_200_OK
        )


# ============================================================
# USER PROFILE
# ============================================================

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# ============================================================
# CATEGORIES
# ============================================================

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]


# ============================================================
# PRODUCTS
# ============================================================

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "name",
        "description",
    ]

    filterset_fields = [
        "category",
        "available",
    ]

    ordering_fields = [
        "name",
        "price",
        "stock",
        "created_at",
    ]

    ordering = ["-created_at"]


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]


# ============================================================
# CART
# ============================================================

class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(
            user=self.request.user
        )

        return cart


# ============================================================
# CART ITEMS
# ============================================================

class CartItemCreateView(generics.CreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        product = serializer.validated_data["product"]

        quantity = serializer.validated_data.get(
            "quantity",
            1
        )

        cart_item = CartItem.objects.filter(
            cart=cart,
            product=product
        ).first()

        if cart_item:

            cart_item.quantity += quantity

            cart_item.save(
                update_fields=["quantity"]
            )

        else:

            cart_item = CartItem.objects.create(
                cart=cart,
                product=product,
                quantity=quantity
            )

        response_serializer = self.get_serializer(
            cart_item
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )


class CartItemDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        cart, created = Cart.objects.get_or_create(
            user=self.request.user
        )

        return CartItem.objects.filter(
            cart=cart
        )


# ============================================================
# ORDERS - NORMAL USER
# ============================================================

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Order.objects.filter(
            user=self.request.user
        ).order_by("-created_at")


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Order.objects.filter(
            user=self.request.user
        )


# ============================================================
# CHECKOUT
# ============================================================

class CheckoutView(generics.GenericAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        try:

            cart = Cart.objects.get(
                user=request.user
            )

        except Cart.DoesNotExist:

            return Response(
                {
                    "error": "Cart is empty"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_items = cart.items.select_related(
            "product"
        )

        if not cart_items.exists():

            return Response(
                {
                    "error": "Cart is empty"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # Check stock
        # ----------------------------------------------------

        for item in cart_items:

            product = item.product

            if not product.available:

                return Response(
                    {
                        "error": (
                            f"{product.name} "
                            "is not available"
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if item.quantity > product.stock:

                return Response(
                    {
                        "error": (
                            f"Only {product.stock} "
                            f"{product.name} available"
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        # ----------------------------------------------------
        # Address
        # ----------------------------------------------------

        address = request.data.get("address")

        if not address:

            return Response(
                {
                    "error": "Address is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # Calculate total
        # ----------------------------------------------------

        total_amount = sum(
            item.product.price * item.quantity
            for item in cart_items
        )

        # ----------------------------------------------------
        # Create order
        # ----------------------------------------------------

        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            address=address,
            status="pending"
        )

        # ----------------------------------------------------
        # Create order items + reduce stock
        # ----------------------------------------------------

        for item in cart_items:

            product = item.product

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item.quantity,
                price=product.price
            )

            product.stock -= item.quantity

            product.save(
                update_fields=["stock"]
            )

        # ----------------------------------------------------
        # Clear cart
        # ----------------------------------------------------

        cart.items.all().delete()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


# ============================================================
# ADMIN - ORDERS
# ============================================================

class AdminOrderListView(generics.ListAPIView):

    queryset = Order.objects.all().order_by(
        "-created_at"
    )

    serializer_class = OrderSerializer

    permission_classes = [IsAdmin]


class AdminOrderDetailView(
    generics.RetrieveUpdateAPIView
):

    queryset = Order.objects.all()

    serializer_class = OrderSerializer

    permission_classes = [IsAdmin]


# ============================================================
# ADMIN - CARTS
# ============================================================

class AdminCartListView(generics.ListAPIView):

    queryset = Cart.objects.all().select_related(
        "user"
    )

    serializer_class = CartSerializer

    permission_classes = [IsAdmin]


# ============================================================
# ADMIN - CART ITEMS
# ============================================================

class AdminCartItemListView(generics.ListAPIView):

    queryset = CartItem.objects.all().select_related(
        "cart",
        "cart__user",
        "product"
    )

    serializer_class = CartItemSerializer

    permission_classes = [IsAdmin]


# ============================================================
# ADMIN - ORDER ITEMS
# ============================================================

class AdminOrderItemListView(generics.ListAPIView):

    queryset = OrderItem.objects.all().select_related(
        "order",
        "order__user",
        "product"
    )

    serializer_class = OrderItemSerializer

    permission_classes = [IsAdmin]


# ============================================================
# PAYMENT - SERIALIZER
# ============================================================

from rest_framework import serializers


class PaymentSerializer(serializers.ModelSerializer):

    class Meta:

        model = Payment

        fields = "__all__"


# ============================================================
# ADMIN - PAYMENTS
# ============================================================

# class AdminPaymentListView(generics.ListAPIView):

#     queryset = Payment.objects.all().select_related(
#         "order",
#         "order__user"
#     )

#     serializer_class = PaymentSerializer

#     permission_classes = [IsAdmin]

class AdminPaymentListView(generics.ListAPIView):
    queryset = Payment.objects.all().select_related(
        "order", "order__user"
    ).order_by("-id")

    serializer_class = PaymentSerializer
    permission_classes = [IsAdmin]

# ============================================================
# ADMIN - USERS
# ============================================================

class AdminUserSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "is_superuser",
            "date_joined",
        ]


class AdminUserListView(generics.ListAPIView):

    queryset = User.objects.all().order_by(
        "-date_joined"
    )

    serializer_class = AdminUserSerializer

    permission_classes = [IsAdmin]


# ============================================================
# CREATE RAZORPAY PAYMENT
# ============================================================

class CreatePaymentView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        order_id = request.data.get(
            "order_id"
        )

        if not order_id:

            return Response(
                {
                    "error": "order_id is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            order = Order.objects.get(
                id=order_id,
                user=request.user
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "error": "Order not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ----------------------------------------------------
        # Order status
        # ----------------------------------------------------

        if order.status != "pending":

            return Response(
                {
                    "error": (
                        "Payment can only be made "
                        "for pending orders"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # Razorpay configuration
        # ----------------------------------------------------

        if not settings.RAZORPAY_KEY_ID:

            return Response(
                {
                    "error": (
                        "Razorpay Key ID "
                        "is not configured"
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if not settings.RAZORPAY_KEY_SECRET:

            return Response(
                {
                    "error": (
                        "Razorpay Key Secret "
                        "is not configured"
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # ----------------------------------------------------
        # Razorpay client
        # ----------------------------------------------------

        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET
            )
        )

        # ----------------------------------------------------
        # Create Razorpay order
        # ----------------------------------------------------

        razorpay_order = client.order.create(
            {
                "amount": int(
                    order.total_amount * 100
                ),
                "currency": "INR",
                "receipt": f"order_{order.id}",
            }
        )

        # ----------------------------------------------------
        # Save payment
        # ----------------------------------------------------

        payment = Payment.objects.create(
            order=order,
            razorpay_order_id=razorpay_order["id"],
            amount=order.total_amount,
            status="created"
        )

        return Response(
            {
                "payment_id": payment.id,
                "order_id": order.id,
                "razorpay_order_id": (
                    razorpay_order["id"]
                ),
                "amount": order.total_amount,
                "currency": "INR",
                "razorpay_key_id": (
                    settings.RAZORPAY_KEY_ID
                ),
            },
            status=status.HTTP_201_CREATED
        )


# ============================================================
# VERIFY RAZORPAY PAYMENT
# ============================================================

class VerifyPaymentView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        razorpay_order_id = request.data.get(
            "razorpay_order_id"
        )

        razorpay_payment_id = request.data.get(
            "razorpay_payment_id"
        )

        razorpay_signature = request.data.get(
            "razorpay_signature"
        )

        # ----------------------------------------------------
        # Validate payment data
        # ----------------------------------------------------

        if not all(
            [
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            ]
        ):

            return Response(
                {
                    "error": (
                        "Payment details are required"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # Find payment
        # ----------------------------------------------------

        try:

            payment = Payment.objects.get(
                razorpay_order_id=razorpay_order_id,
                order__user=request.user
            )

        except Payment.DoesNotExist:

            return Response(
                {
                    "error": (
                        "Payment record not found"
                    )
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ----------------------------------------------------
        # Razorpay client
        # ----------------------------------------------------

        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET
            )
        )

        # ----------------------------------------------------
        # Verify signature
        # ----------------------------------------------------

        try:

            client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": (
                        razorpay_order_id
                    ),
                    "razorpay_payment_id": (
                        razorpay_payment_id
                    ),
                    "razorpay_signature": (
                        razorpay_signature
                    ),
                }
            )

        except razorpay.errors.SignatureVerificationError:

            payment.status = "failed"

            payment.save(
                update_fields=["status"]
            )

            return Response(
                {
                    "error": (
                        "Payment verification failed"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # Payment successful
        # ----------------------------------------------------

        payment.razorpay_payment_id = (
            razorpay_payment_id
        )

        payment.razorpay_signature = (
            razorpay_signature
        )

        payment.status = "paid"

        payment.save()

        # ----------------------------------------------------
        # Confirm order
        # ----------------------------------------------------

        payment.order.status = "confirmed"

        payment.order.save(
            update_fields=["status"]
        )

        return Response(
            {
                "message": (
                    "Payment verified successfully"
                ),
                "payment_id": payment.id,
                "order_id": payment.order.id,
                "status": payment.status,
                "order_status": (
                    payment.order.status
                ),
            },
            status=status.HTTP_200_OK
        )
