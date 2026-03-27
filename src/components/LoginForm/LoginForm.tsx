import { useForm } from "react-hook-form";

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ email: string; password: string }>();

    const onSubmit = (data: { email: string; password: string }) => {
        console.log("Form ma'lumotlari:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Kirish</h2>
            <input {...register("email", { required: true })} placeholder="Email" className="p-2 border border-gray-300 rounded" />
            {errors.email && <p className="text-red-500">Email talab qilinadi!</p>}

            <input {...register("password", { required: true })} type="password" placeholder="Parol" className="p-2 border border-gray-300 rounded" />
            {errors.password && <p className="text-red-500">Parol talab qilinadi!</p>}

            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Kirish!</button>
        </form>
    );
}