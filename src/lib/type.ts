export type Seller = {
    id: string; // MongoDB ObjectId
    name: string;
    email: string;
    contact?: string | null; // Optional contact info
    googleId: string; // Unique Google ID
    products: Product[]; // List of products sold by this seller
};


export type Product = {
    id: string; // MongoDB ObjectId
    name: string;
    description?: string | null; // Optional description
    price: number; // Product price
    totalQuantity: number; // Available quantity, default is 0
    status: ProductStatus; // Enum for status: active, inactive, etc.
    images: string[]; // Array of image URLs
    isDeleted: boolean; // Indicates if the product is deleted
    isPublished: boolean; // Indicates if the product is published
    variants: Variant[]; // Variants of the product
    discountPercent?: string;
    isFeatured?: boolean;
    slug?: string;
    // Relations
    categoryId: string; // Category the product belongs to
    category: Category; // Related category object
    sellerId: string; // Seller who owns the product
    seller: Seller; // Related seller object

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
};


export type Category = {
    id: string; // MongoDB ObjectId
    name: string;
    description?: string | null; // Optional description
    parentId?: string | null; // ID of the parent category (if exists)
    parent?: Category | null; // Parent category object
    subcategories: Category[]; // List of subcategories
    products?: Product[]; // List of products under this category
};


export type Variant = {
    id: string; // MongoDB ObjectId
    color: string; // Color of the variant
    images: string[]; // Images specific to this variant
    attributes: Attribute[]; // Attributes (e.g., size, stock)
    productId: string; // ID of the related product
    product: Product; // Related product object
    createdAt: Date;
    updatedAt: Date;
};


export type Attribute = {
    id: string; // MongoDB ObjectId
    size: string; // Size of the variant
    stock: number; // Stock level for this size
    price?: number | null; // Optional price override
    sku?: string | null; // Optional SKU for inventory tracking
    variantId: string; // ID of the related variant
    variant: Variant; // Related variant object
};


export enum ProductStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    OUT_OF_STOCK = "out_of_stock",
    DISCONTINUED = "discontinued",
}



// User type
export type User = {
    id: string;
    name: string;
    email: string;
    addresses?: Address[];
    orders?: Order[];
}

// Address type
export type Address = {
    id: string;
    userId: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    createdAt?: string;
    updatedAt?: string;
}

// Order type
export type Order = {
    id: string;
    userId: string;
    paymentMethod: PaymentMethod;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    status: OrderStatus;
    totalAmount: number;
    orderItems: OrderItem[];
    deliveryStatus: DeliveryStatus;
    shippingAddressId: string;
    shippingAddress: ShippingAddress;
    createdAt: string;
    updatedAt: string;
}

// OrderItem type
export type OrderItem = {
    id: string;
    orderId: string;
    productId: string;
    product: Product;
    quantity: number;
    price: number;
    createdAt: string;
    variant?: Variant;
    attribute?: Attribute;
    updatedAt: string;
    order: Order
}

// ShippingAddress type
export type ShippingAddress = {
    id: string;
    email: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
}



export enum PaymentMethod {
    COD = "COD",
    ONLINE = "ONLINE",
}

// Enum for order status
export enum OrderStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    PROCESSING = 'PROCESSING",
}

export enum DeliveryStatus {
    PENDING = "PENDING",
    SHIPPED = 'SHIPPED',
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
}
