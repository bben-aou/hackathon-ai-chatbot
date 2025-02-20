
export type LoanOption = {
  years: number;
  rate: number;
  monthlyPayment: number;
};

type TMonthlyPaymentSuggestionProps = {
  monthlyPaymentSuggestions: LoanOption[];
};
const MonthlyPaymentSuggestion = (props: TMonthlyPaymentSuggestionProps) => {
  const { monthlyPaymentSuggestions } = props;
  const formatDuration = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths
      ? `${years} ans et ${remainingMonths} mois`
      : `${years} ans`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("MAD", "DH");
  };
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {monthlyPaymentSuggestions.map((item, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2"
        >
          <span className="bg-[#22826e] text-white px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-3">
            <span>📅 {formatDuration(item.years * 12)}</span>
            <span>{item.rate}％</span>
          </span>

          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(item.monthlyPayment)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MonthlyPaymentSuggestion;
