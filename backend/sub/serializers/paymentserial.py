# # from rest_framework import serializers
# # from ..models import Payment


# # class PaymentSerializer(serializers.ModelSerializer):
# #     username = serializers.CharField(
# #     source="user.username",
# #     read_only=True
# # )
# #     class Meta:
# #         model = Payment
# #         fields = [
# #             'id',
# #             'order',
# #             'user',
# #             'razorpay_order_id',
# #             'razorpay_payment_id',
# #             'razorpay_signature',
# #             'amount',
# #             'status',
# #             'created_at',
# #             'updated_at',
# #         ]

# #         read_only_fields = [
# #             'id',
# #             'razorpay_order_id',
# #             'razorpay_payment_id',
# #             'razorpay_signature',
# #             'amount',
# #             'status',
# #             'created_at',
# #             'updated_at',
# #         ]

# from rest_framework import serializers
# from ..models import Payment


# class PaymentSerializer(serializers.ModelSerializer):

#     username = serializers.CharField(
#         source="user.username",
#         read_only=True
#     )

#     class Meta:
#         model = Payment

#         fields = [
#             'id',
#             'order',
#             'user',
#             'username',  # ✅ ADD THIS
#             'razorpay_order_id',
#             'razorpay_payment_id',
#             'razorpay_signature',
#             'amount',
#             'status',
#             'created_at',
#             'updated_at',
#         ]

#         read_only_fields = [
#             'id',
#             'username',
#             'razorpay_order_id',
#             'razorpay_payment_id',
#             'razorpay_signature',
#             'amount',
#             'status',
#             'created_at',
#             'updated_at',
#         ]

# ============================================================
# PAYMENT - SERIALIZER
# ============================================================

from rest_framework import serializers


class PaymentSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:
        model = Payment

        fields = [
            "id",
            "order",
            "user",
            "username",
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
            "amount",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "username",
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
            "amount",
            "status",
            "created_at",
            "updated_at",
        ]