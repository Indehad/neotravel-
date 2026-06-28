"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadFormSchema, type LeadFormData } from "../../lib/schema";
import { Input } from "../ui/input";

export function LeadForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LeadFormData>({
    resolver: zodResolver(LeadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    const res = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) alert("Demande envoyée !");
    else alert("Erreur serveur.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("name")} placeholder="Nom complet" />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      
      <Input {...register("email")} placeholder="Email" />
      <Input {...register("departure")} placeholder="Départ" />
      <Input {...register("destination")} placeholder="Destination" />
      <Input {...register("distance")} type="number" placeholder="Distance (km)" />
      <Input {...register("passengers")} type="number" placeholder="Passagers" />

      <button type="submit" disabled={isSubmitting} className="w-full bg-olive text-navy p-3 rounded-lg font-bold hover:bg-white">
        {isSubmitting ? "En cours..." : "Recevoir mon devis"}
      </button>
    </form>
  );
}