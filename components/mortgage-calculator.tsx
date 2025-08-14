"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calculator, TrendingUp, BarChart3, Info } from "lucide-react"

interface MortgageValues {
  propertyPrice: number
  downPayment: number
  downPaymentPercent: number
  interestRate: number
  loanTerm: number
  propertyTax: number
  insurance: number
  pmi: number
}

interface MortgageResults {
  monthlyPayment: number
  principalAndInterest: number
  monthlyTax: number
  monthlyInsurance: number
  monthlyPMI: number
  totalMonthlyPayment: number
  totalInterest: number
  totalPayment: number
  loanAmount: number
}

export default function MortgageCalculator() {
  const [values, setValues] = useState<MortgageValues>({
    propertyPrice: 150000,
    downPayment: 30000,
    downPaymentPercent: 20,
    interestRate: 12.5,
    loanTerm: 20,
    propertyTax: 1.2,
    insurance: 0.5,
    pmi: 0.5,
  })

  const [results, setResults] = useState<MortgageResults>({
    monthlyPayment: 0,
    principalAndInterest: 0,
    monthlyTax: 0,
    monthlyInsurance: 0,
    monthlyPMI: 0,
    totalMonthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
    loanAmount: 0,
  })

  const [paymentBreakdown, setPaymentBreakdown] = useState<
    Array<{
      year: number
      principal: number
      interest: number
      balance: number
    }>
  >([])

  // Calculate mortgage when values change
  useEffect(() => {
    calculateMortgage()
  }, [values])

  // Update down payment when percentage changes
  useEffect(() => {
    const newDownPayment = (values.propertyPrice * values.downPaymentPercent) / 100
    if (Math.abs(newDownPayment - values.downPayment) > 1) {
      setValues((prev) => ({ ...prev, downPayment: newDownPayment }))
    }
  }, [values.downPaymentPercent, values.propertyPrice])

  // Update percentage when down payment changes
  useEffect(() => {
    const newPercent = (values.downPayment / values.propertyPrice) * 100
    if (Math.abs(newPercent - values.downPaymentPercent) > 0.1) {
      setValues((prev) => ({ ...prev, downPaymentPercent: newPercent }))
    }
  }, [values.downPayment, values.propertyPrice])

  const calculateMortgage = () => {
    const principal = values.propertyPrice - values.downPayment
    const monthlyRate = values.interestRate / 100 / 12
    const numberOfPayments = values.loanTerm * 12

    // Calculate principal and interest payment
    let monthlyPI = 0
    if (monthlyRate > 0) {
      monthlyPI =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    } else {
      monthlyPI = principal / numberOfPayments
    }

    // Calculate other monthly costs
    const monthlyTax = (values.propertyPrice * values.propertyTax) / 100 / 12
    const monthlyInsurance = (values.propertyPrice * values.insurance) / 100 / 12
    const monthlyPMI = values.downPaymentPercent < 20 ? (principal * values.pmi) / 100 / 12 : 0

    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI
    const totalPayment = monthlyPI * numberOfPayments
    const totalInterest = totalPayment - principal

    setResults({
      monthlyPayment: monthlyPI,
      principalAndInterest: monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      totalMonthlyPayment,
      totalInterest,
      totalPayment,
      loanAmount: principal,
    })

    // Calculate payment breakdown by year
    calculatePaymentBreakdown(principal, monthlyRate, numberOfPayments, monthlyPI)
  }

  const calculatePaymentBreakdown = (
    principal: number,
    monthlyRate: number,
    numberOfPayments: number,
    monthlyPayment: number,
  ) => {
    const breakdown = []
    let remainingBalance = principal

    for (let year = 1; year <= values.loanTerm; year++) {
      let yearlyPrincipal = 0
      let yearlyInterest = 0

      for (let month = 1; month <= 12 && (year - 1) * 12 + month <= numberOfPayments; month++) {
        const interestPayment = remainingBalance * monthlyRate
        const principalPayment = monthlyPayment - interestPayment

        yearlyInterest += interestPayment
        yearlyPrincipal += principalPayment
        remainingBalance -= principalPayment
      }

      breakdown.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance: Math.max(0, remainingBalance),
      })

      if (remainingBalance <= 0) break
    }

    setPaymentBreakdown(breakdown)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZM", {
      style: "currency",
      currency: "ZMW",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Mortgage Calculator
        </CardTitle>
        <CardDescription>
          Calculate your monthly mortgage payments and see how different factors affect your loan
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Loan Details</h3>

              {/* Property Price */}
              <div className="space-y-2">
                <Label htmlFor="propertyPrice">Property Price</Label>
                <Input
                  id="propertyPrice"
                  type="number"
                  value={values.propertyPrice}
                  onChange={(e) => setValues((prev) => ({ ...prev, propertyPrice: Number(e.target.value) }))}
                  className="text-lg font-medium"
                />
              </div>

              {/* Down Payment */}
              <div className="space-y-3">
                <Label>Down Payment</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="downPayment" className="text-sm text-gray-600">
                      Amount (ZMW)
                    </Label>
                    <Input
                      id="downPayment"
                      type="number"
                      value={values.downPayment}
                      onChange={(e) => setValues((prev) => ({ ...prev, downPayment: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="downPaymentPercent" className="text-sm text-gray-600">
                      Percentage (%)
                    </Label>
                    <Input
                      id="downPaymentPercent"
                      type="number"
                      step="0.1"
                      value={values.downPaymentPercent}
                      onChange={(e) => setValues((prev) => ({ ...prev, downPaymentPercent: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="px-3">
                  <Slider
                    value={[values.downPaymentPercent]}
                    onValueChange={([value]) => setValues((prev) => ({ ...prev, downPaymentPercent: value }))}
                    max={50}
                    min={5}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={values.interestRate}
                  onChange={(e) => setValues((prev) => ({ ...prev, interestRate: Number(e.target.value) }))}
                />
                <div className="px-3">
                  <Slider
                    value={[values.interestRate]}
                    onValueChange={([value]) => setValues((prev) => ({ ...prev, interestRate: value }))}
                    max={25}
                    min={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Loan Term */}
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Select
                  value={values.loanTerm.toString()}
                  onValueChange={(value) => setValues((prev) => ({ ...prev, loanTerm: Number(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 years</SelectItem>
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="25">25 years</SelectItem>
                    <SelectItem value="30">30 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Additional Costs */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Additional Costs</h3>

              <div className="space-y-2">
                <Label htmlFor="propertyTax">Property Tax (% per year)</Label>
                <Input
                  id="propertyTax"
                  type="number"
                  step="0.1"
                  value={values.propertyTax}
                  onChange={(e) => setValues((prev) => ({ ...prev, propertyTax: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance">Home Insurance (% per year)</Label>
                <Input
                  id="insurance"
                  type="number"
                  step="0.1"
                  value={values.insurance}
                  onChange={(e) => setValues((prev) => ({ ...prev, insurance: Number(e.target.value) }))}
                />
              </div>

              {values.downPaymentPercent < 20 && (
                <div className="space-y-2">
                  <Label htmlFor="pmi" className="flex items-center gap-2">
                    PMI (% per year)
                    <Info className="h-4 w-4 text-gray-400" />
                  </Label>
                  <Input
                    id="pmi"
                    type="number"
                    step="0.1"
                    value={values.pmi}
                    onChange={(e) => setValues((prev) => ({ ...prev, pmi: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-gray-600">
                    Private Mortgage Insurance is required when down payment is less than 20%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Monthly Payment Breakdown */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Monthly Payment Breakdown</h3>

              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600">{formatCurrency(results.totalMonthlyPayment)}</div>
                  <div className="text-sm text-blue-700">Total Monthly Payment</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Principal & Interest</span>
                    <span className="font-medium">{formatCurrency(results.principalAndInterest)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Property Tax</span>
                    <span className="font-medium">{formatCurrency(results.monthlyTax)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Home Insurance</span>
                    <span className="font-medium">{formatCurrency(results.monthlyInsurance)}</span>
                  </div>

                  {results.monthlyPMI > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">PMI</span>
                      <span className="font-medium">{formatCurrency(results.monthlyPMI)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Loan Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{formatCurrency(results.loanAmount)}</div>
                <div className="text-sm text-gray-600">Loan Amount</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{formatCurrency(results.totalInterest)}</div>
                <div className="text-sm text-gray-600">Total Interest</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{formatCurrency(results.totalPayment)}</div>
                <div className="text-sm text-gray-600">Total of Payments</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{formatPercent(values.downPaymentPercent)}</div>
                <div className="text-sm text-gray-600">Down Payment</div>
              </div>
            </div>

            {/* Affordability Insights */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Affordability Insights
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Monthly payment to income ratio:</span>
                  <span className="font-medium">Calculate based on income</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Interest vs Principal (first year):</span>
                  <span className="font-medium">
                    {paymentBreakdown[0]
                      ? `${((paymentBreakdown[0].interest / (paymentBreakdown[0].interest + paymentBreakdown[0].principal)) * 100).toFixed(0)}% interest`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Break-even point:</span>
                  <span className="font-medium">{values.loanTerm > 15 ? "Consider shorter term" : "Good choice"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Schedule Chart */}
        {paymentBreakdown.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Payment Schedule
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Year</th>
                      <th className="text-right p-2">Principal</th>
                      <th className="text-right p-2">Interest</th>
                      <th className="text-right p-2">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentBreakdown.slice(0, 10).map((year) => (
                      <tr key={year.year} className="border-b">
                        <td className="p-2 font-medium">{year.year}</td>
                        <td className="p-2 text-right">{formatCurrency(year.principal)}</td>
                        <td className="p-2 text-right">{formatCurrency(year.interest)}</td>
                        <td className="p-2 text-right">{formatCurrency(year.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paymentBreakdown.length > 10 && (
                  <div className="text-center p-4 text-sm text-gray-600">
                    ... and {paymentBreakdown.length - 10} more years
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
