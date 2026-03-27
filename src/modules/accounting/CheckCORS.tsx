import { useState } from "react";
import axiosInstance from "@/api/axiosInstance";

const CheckCORS = () => {
    const [message, setMessage] = useState("Tekshirilmoqda...");

    const checkCORS = async () => {
        try {
            await axiosInstance.get("/customusers/");
            setMessage("CORS muammo yo‘q! ✅");
        } catch (error) {
            if (error.response) {
                setMessage("Server javob qaytardi, lekin CORS muammo bo‘lishi mumkin. ⚠️");
            } else if (error.request) {
                setMessage("CORS bloklangan! ❌");
            } else {
                setMessage("Xatolik yuz berdi: " + error.message);
            }
        }
    };

    return (
        <div className="p-4 text-center">
            <h2 className="text-xl font-bold">CORS Tekshiruvi</h2>
            <button
                onClick={checkCORS}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Tekshirish
            </button>
            <p className="mt-4">{message}</p>
        </div>
    );
};

export default CheckCORS;
