declare module '@paystack/inline-js' {
  type CheckoutOptions = {
    key: string
    email: string
    amount: number
    currency?: string
    firstName?: string
    planInterval?: 'monthly' | 'annually'
    metadata?: { custom_fields: Array<{ display_name: string; variable_name: string; value: string }> }
    onSuccess?: (transaction: { reference: string }) => void
    onCancel?: () => void
    onError?: (error: { message?: string }) => void
  }

  export default class PaystackPop {
    newTransaction(options: CheckoutOptions): void
  }
}
