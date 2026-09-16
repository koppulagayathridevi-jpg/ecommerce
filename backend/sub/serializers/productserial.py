from rest_framework import serializers
from ..models import Category, Product


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = [
            'id',
            'category',
            'name',
            'description',
            'price',
            'stock',
            'image',
            'available',
            'created_at',
            'updated_at'
        ]