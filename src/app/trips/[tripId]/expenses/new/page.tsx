import { TripHeader } from "@/components/trips/trip-header";
import { ExpenseForm } from "@/components/expenses/expense-form";

export default function NewExpensePage() {
  return (
    <>
      <TripHeader title="Новый расход" />
      <div className="mx-auto max-w-lg p-4 md:p-6">
        <ExpenseForm />
      </div>
    </>
  );
}
