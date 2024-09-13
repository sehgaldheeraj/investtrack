export const users = [
    {
      fullName: 'Alice Johnson',
      phone: 1234567890,
      email: 'alice@example.com',
      kycStatus: false,
      planDetails: [
        {
          queryDate: new Date('2024-01-01'),
          planTitle: 'Investment A',
          planStartDate: new Date('2024-01-01'),
          planEndDate: new Date('2025-07-01'),
          amountInvested: 1000,
          planInterestRate: 5,
          planDuration: 700,
          withdrawal: false,
          approved: false
        },
        {
          queryDate: new Date('2024-02-01'),
          planTitle: 'Investment B',
          planStartDate: new Date('2024-02-01'),
          planEndDate: new Date('2025-08-01'),
          amountInvested: 2000,
          planInterestRate: 7,
          planDuration: 700,
          withdrawal: false,
          approved: true
        }
      ]
    },
    {
      fullName: 'Bob Smith',
      phone: 2345678901,
      email: 'bob@example.com',
      kycStatus: true,
      planDetails: [
        {
          queryDate: new Date('2024-03-01'),
          planTitle: 'Investment C',
          planStartDate: new Date('2024-03-01'),
          planEndDate: new Date('2025-09-01'),
          amountInvested: 1500,
          planInterestRate: 6,
          planDuration: 700,
          withdrawal: false,
          approved: false
        },
        {
          queryDate: new Date('2024-04-01'),
          planTitle: 'Investment D',
          planStartDate: new Date('2024-04-01'),
          planEndDate: new Date('2025-10-01'),
          amountInvested: 2500,
          planInterestRate: 8,
          planDuration: 700,
          withdrawal: false,
          approved: true
        }
      ]
    },
    {
      fullName: 'Charlie Brown',
      phone: 3456789012,
      email: 'charlie@example.com',
      kycStatus: false,
      planDetails: [
        {
          queryDate: new Date('2024-05-01'),
          planTitle: 'Investment E',
          planStartDate: new Date('2024-05-01'),
          planEndDate: new Date('2025-11-01'),
          amountInvested: 3000,
          planInterestRate: 9,
          planDuration: 700,
          withdrawal: false,
          approved: false
        },
        {
          queryDate: new Date('2024-06-01'),
          planTitle: 'Investment F',
          planStartDate: new Date('2024-06-01'),
          planEndDate: new Date('2025-12-01'),
          amountInvested: 3500,
          planInterestRate: 10,
          planDuration: 700,
          withdrawal: false,
          approved: true
        },
        {
          queryDate: new Date('2024-07-01'),
          planTitle: 'Investment G',
          planStartDate: new Date('2024-07-01'),
          planEndDate: new Date('2026-01-01'),
          amountInvested: 4000,
          planInterestRate: 11,
          planDuration: 700,
          withdrawal: false,
          approved: false
        }
      ]
    }
  ];