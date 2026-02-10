import { collection, getDocs, query, where, orderBy, limit, updateDoc, doc, addDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

/* ========================================
   DASHBOARD STATS
   ======================================== */

export async function getDashboardStats() {
  try {
    // Get all orders
    const ordersSnapshot = await getDocs(collection(db, "orders"))
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Get all products
    const productsSnapshot = await getDocs(collection(db, "products"))
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Calculate real revenue from orders
    const totalRevenue = orders.reduce((sum, order: any) => {
      return sum + (order.total || 0)
    }, 0)

    // Count orders by status
    const pendingOrders = orders.filter((order: any) => 
      order.status === "pending"
    ).length

    const deliveredOrders = orders.filter((order: any) => 
      order.status === "delivered"
    ).length

    const processingOrders = orders.filter((order: any) => 
      order.status === "processing"
    ).length

    // Calculate total stock across all products
    const totalStock = products.reduce((sum, product: any) => {
      return sum + (product.stock || 0)
    }, 0)

    // Calculate total items sold from orders
    const soldItems = orders.reduce((sum, order: any) => {
      if (order.items && Array.isArray(order.items)) {
        return sum + order.items.reduce((itemSum: number, item: any) => {
          return itemSum + (item.quantity || 0)
        }, 0)
      }
      return sum
    }, 0)

    return {
      totalOrders: orders.length,
      totalRevenue: Math.round(totalRevenue), // Round to remove decimals
      totalProducts: products.length,
      pendingOrders,
      deliveredOrders,
      processingOrders,
      totalStock,
      sold: soldItems
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      processingOrders: 0,
      totalStock: 0,
      sold: 0
    }
  }
}

/* ========================================
   ORDERS
   ======================================== */

export async function getOrders(limitCount?: number) {
  try {
    const ordersRef = collection(db, "orders")
    
    let q = query(
      ordersRef,
      orderBy("createdAt", "desc")
    )

    if (limitCount) {
      q = query(q, limit(limitCount))
    }

    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

export async function getRecentOrders(days: number = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const ordersRef = collection(db, "orders")
    const q = query(
      ordersRef,
      where("createdAt", ">=", startDate),
      orderBy("createdAt", "desc")
    )

    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    // Fallback: get all orders if date query fails
    return getOrders(100)
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await updateDoc(doc(db, "orders", id), { 
      status,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

/* ========================================
   REVENUE & ANALYTICS
   ======================================== */

// Get revenue by date for charts
export async function getRevenueByDate(days: number = 30) {
  try {
    const orders = await getRecentOrders(days)
    
    // Group orders by date
    const revenueMap = new Map<string, number>()

    orders.forEach((order: any) => {
      if (order.createdAt && order.total) {
        const date = order.createdAt.toDate 
          ? order.createdAt.toDate() 
          : new Date(order.createdAt.seconds * 1000)
        
        const dateKey = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })

        const currentRevenue = revenueMap.get(dateKey) || 0
        revenueMap.set(dateKey, currentRevenue + order.total)
      }
    })

    // Convert to array and sort by date
    const revenueData = Array.from(revenueMap.entries()).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue)
    }))

    return revenueData
  } catch (error) {
    console.error("Error getting revenue by date:", error)
    return []
  }
}

/* ========================================
   PRODUCTS
   ======================================== */

export async function addProduct(data: any) {
  try {
    await addDoc(collection(db, "products"), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error("Error adding product:", error)
    throw error
  }
}

// Get top selling products
export async function getTopProducts(limitCount: number = 10) {
  try {
    const productsRef = collection(db, "products")
    const q = query(
      productsRef,
      orderBy("orders", "desc"),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error fetching top products:", error)
    return []
  }
}

// Get low stock products
export async function getLowStockProducts(threshold: number = 10) {
  try {
    const productsRef = collection(db, "products")
    const q = query(
      productsRef,
      where("stock", "<=", threshold),
      orderBy("stock", "asc")
    )

    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error fetching low stock products:", error)
    return []
  }
}