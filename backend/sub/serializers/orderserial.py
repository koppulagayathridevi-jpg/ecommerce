from rest_framework import serializers

from ..models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )

    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'price',
            'total_price',
        ]

        read_only_fields = [
            'price',
            'total_price',
        ]

    def get_total_price(self, obj):
        return obj.price * obj.quantity


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'username',
            'items',
            'total_amount',
            'status',
            'address',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'user',
            'username',
            'items',
            'total_amount',
            'created_at',
            'updated_at',
        ]