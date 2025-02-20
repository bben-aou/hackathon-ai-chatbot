
export interface LoanSuggestion {
  borrowingCapacity: number
  eligibilityDurationInMonths: number
}


type TLoansSuggestionProps = {
  loanSuggestions: LoanSuggestion[];
};
const LoansSuggestion = (props: TLoansSuggestionProps) => {
  const { loanSuggestions } = props;
  const formatDuration = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths
      ? `${years} ans et ${remainingMonths} mois`
      : `${years} ans`;
  };
  
  const formatCurrency = (amount:number) => {
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
    {loanSuggestions.map((item, index) => (
      <div
        key={index}
        className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2"
      >
        <span className="bg-[#83c9bd] text-white px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
          📅 {formatDuration(item.eligibilityDurationInMonths)}
        </span>
        <p className="text-2xl font-semibold text-gray-900">
          {formatCurrency(item.borrowingCapacity)}
        </p>
      </div>
    ))}
  </div>
  );
};

export default LoansSuggestion;
