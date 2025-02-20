import { generateUUID } from '@/lib/utils';
import { DataStreamWriter, tool } from 'ai';
import { Session } from 'next-auth';
import { z } from 'zod';

interface CreateDocumentProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const propertyTypes = ['VILLA', 'FLAT'] as const;

export type LoanOption = {
  years: number;
  rate: number;
  monthlyPayment: number;
};

function calculateLoanPayments(loanAmount: number): LoanOption[] {
  const options = [
    { years: 7, rate: 4.2 },
    { years: 15, rate: 4.5 },
    { years: 25, rate: 4.75 },
    { years: 30, rate: 4.75 },
  ];

  return options.map(option => {
    const monthlyRate = option.rate / 100 / 12;
    const totalMonths = option.years * 12;
    const monthlyPayment = 
      (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));

    return { 
      ...option, 
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)) // Rounds to 2 decimals
    };
  });
}

export const getMonthlyPaymentSuggestions = () =>
  tool({
    description:
      'Get Monthly Payment Suggestions, based on the requested loan amount. The proposed loans include the life insurance and multi risk insurance.',
    parameters: z.object({
      desiredLoanAmount: z.number(),
      propertyPrice: z.number().optional(),
    }),
    execute: async (res) => {

      return {
        id: generateUUID(),
        monthlyPaymentSuggestions: calculateLoanPayments(res.desiredLoanAmount),
      };
    },
  });
