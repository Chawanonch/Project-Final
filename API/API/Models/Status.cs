namespace API.Models
{
    public enum StatusBooking
    {
        Pending,
        PaymentDepositCompleted,
        PaymentCompleted,
        PaymentCancel
    }

    public enum StatusBookingPayment
    {
        Pedding,
        Deposit,
        RemainingAmount,
        FullAmount
    }

    public enum StatusCheckIn
    {
        NotCome,
        Come
    }
}
