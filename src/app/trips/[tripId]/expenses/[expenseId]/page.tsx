import { TripHeader } from "@/components/trips/trip-header";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { DEMO_EXPENSES } from "@/mocks/demo-trip";

export default async function EditExpensePage({
  params,
}: PageProps<"/trips/[tripId]/expenses/[expenseId]">) {
  const { expenseId } = await params;
  const expense = DEMO_EXPENSES.find((e) => e.id === expenseId) ?? DEMO_EXPENSES[0];

  return (
    <>
      <TripHeader title={expense.title} />
      <div className="mx-auto max-w-lg p-4 md:p-6">
        <ExpenseForm initialExpense={expense} />
      </div>
    </>
  );
}
