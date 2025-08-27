import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth ,db} from "../database/databaseHook";

export interface CartItem {
    selected?: boolean;
    id?: string|undefined;
    productName: string;
    price: number;
    imageUrl:string;
    quantity: number;

}

interface Order extends CartItem {
    date: Date;
}

interface UserDataContextType {
    cart: CartItem[];
    orders: Order[];
    addToCart: (item: CartItem) => Promise<void>;
    placeOrder: (item: Order) => Promise<void>;
    refreshData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchData(user.uid);
            } else {
                setUserId(null);
                setCart([]);
                setOrders([]);
            }
        });
        return () => unsub();
    }, []);

    const fetchData = async (uid: string) => {
        const userRef = doc(db, "users", uid);

        // fetch cart
        const cartSnap = await getDocs(collection(userRef, "cart"));
        setCart(cartSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CartItem[]);

        // fetch orders
        const ordersSnap = await getDocs(collection(userRef, "orders"));
        setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]);
    };

    const addToCart = async (item: CartItem) => {
        if (!userId) return;
        const userRef = doc(db, "users", userId);
        await addDoc(collection(userRef, "cart"), item);
        fetchData(userId);
    };

    const placeOrder = async (item: Order) => {
        if (!userId) return;
        const userRef = doc(db, "users", userId);
        await addDoc(collection(userRef, "orders"), item);
        fetchData(userId);
    };

    const refreshData = async () => {
        if (userId) await fetchData(userId);
    };

    return (
        <UserDataContext.Provider value={{ cart, orders, addToCart, placeOrder, refreshData }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData must be used within UserDataProvider");
    }
    return context;
};
