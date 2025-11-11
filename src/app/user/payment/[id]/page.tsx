"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { FullscreenLoader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { InvoiceStatus, PaymentRecieverOptions } from "@/utils/contants";
import { app_config } from "../../../../../app-config";
import toast from "react-hot-toast";
import Script from "next/script";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function UserBookingPayPage() {
  const [booking, setBooking] = useState<any | null>(null);
  const [orgAccount, setOrgAccount] = useState<any | null>(null);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id;
  const [userSelfPayPopup, setUserSelfPayPopup] = useState(false);

  const fetchBooking = async () => {
    try {
      setLoader(true);
      const res = await apiFetch(`/api/public?id=${bookingId}&&type=pay`);
      if (!res.ok) throw new Error("Failed to fetch booking");
      const data = await res.json();
      setBooking(data);
    } catch (err) {
      console.error("Error fetching booking:", err);
      toast.error("Failed to load details");
      // router.push("/");
    } finally {
      setLoader(false);
    }
  };

  const fetchOrgAccountDetail = async () => {
    try {
      setLoader(true);
      const res = await apiFetch(`/api/public?id=${booking?.propertyId?.selctedSelfRecieveBankOrUpi}&&type=ac`);
      if (!res.ok) throw new Error("Failed to fetch booking");
      const data = await res.json();
      setOrgAccount(data);
      setUserSelfPayPopup(true);
    } catch (err) {
      console.error("Error fetching booking:", err);
      toast.error("Failed to load details");
      // router.push("/");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (!bookingId) {
      router.push("/");
      setLoader(false);
      return;
    }
    fetchBooking();
  }, []);

  if (loader) return <FullscreenLoader />;

  if (!booking)
    return (
      <div className="h-screen flex justify-center items-center text-gray-500">
        Booking not found
      </div>
    );

  const payThroughRazerpay = async (invoiceId: string, amount: number) => {
    try {
      const res = await fetch("/api/invoice/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: "INR",
        name: booking.propertyId.name,
        description: "Rent Payment",
        order_id: data.orderId,
        handler: async (response: any) => {
          // Verify payment and mark invoice as paid
          const verifyRes = await fetch("/api/invoice/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              invoiceId: data.invoiceId,
            }),
          });

          const result = await verifyRes.json();
          if (verifyRes.ok) {
            toast.success("Payment successful!");
            fetchBooking();
          }
          else toast.error(result.error || "Payment verification failed");
        },
        theme: { color: "#15803d" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    }
  };

  const handlePayOnline = async (invoiceId: string, amount: number) => {

    if (booking?.propertyId?.is_paymentRecieveSelf) {
      fetchOrgAccountDetail();
    } else {
      payThroughRazerpay(invoiceId, amount);
    }
  }

  const handlePayViaCash = async () => {
    alert("Cash payment recorded!");
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const onClose = () => {
    setUserSelfPayPopup(false);
  }

  return (
    <div className="min-h-screen flex justify-center bg-slate-100 h-full">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="w-full max-w-[500px] relateive bg-white ">
        {/* Header */}
        <div className="p-6 pb-10 flex justify-between items-center bg-green-700 text-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white text-green-700 flex items-center justify-center text-lg font-medium">
              {booking.fullName ? booking.fullName[0].toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {booking.fullName || "User"}
              </h2>
              <p className="text-xs -mt-1 opacity-80">
                {booking.whatsappCountryCode} {booking.whatsappNumber}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">
              {booking.propertyId?.name || "Property"}
            </p>
            <span className="inline-block bg-white/20 text-white text-sm rounded-md px-3 py-1 mt-2">
              {booking.unitId?.name || "Unit"}
            </span>
          </div>

        </div>

        {/* Main content */}
        <div className="absolute top-24 left-0  w-full flex justify-center">
          <div className=" w-full max-w-[500px] rounded-t-3xl bg-white text-black p-6  overflow-y-auto">
            {/* Pending payments */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Pending payments</h3>
                {booking.invoices?.filter((i: any) => i.status === InvoiceStatus.PENDING).length === 0 && (
                  <p className="text-gray-500 text-sm">No pending payments</p>
                )}
                {booking.invoices
                  ?.filter((i: any) => i.status === InvoiceStatus.PENDING)
                  .map((i: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b pb-3 mb-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-green-700 text-white px-3 py-2 rounded-md text-center">
                          <div className="text-lg font-bold">
                            {new Date(i.createdAt).getDate()}
                          </div>
                          <div className="text-sm">
                            {new Date(i.createdAt).toLocaleString("en-US", {
                              month: "short",
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium capitalize">{i.type}</p>
                          <p className="text-xs text-gray-500">
                            Due on: {formatDate(i.dueDate)}
                          </p>
                          <p className="font-semibold ">₹{i.amount}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          className="bg-green-700 hover:bg-green-800 flex-1"
                          onClick={() => handlePayOnline(i._id, i.amount)}
                        >
                          {booking?.propertyId?.is_paymentRecieveSelf ? '' : '💳'} Pay online
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={handlePayViaCash}
                        >
                          Pay via cash
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Old payments */}
              <div className=" ">
                <h3 className="font-semibold mb-3">Payment history</h3>
                {booking.invoices
                  ?.filter((i: any) => i.status !== InvoiceStatus.PENDING)
                  .map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-t pt-3 mt-3 text-sm text-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 px-3 py-2 rounded-md text-center">
                          <div className="text-base font-bold">
                            {new Date(item.createdAt).getDate()}
                          </div>
                          <div className="text-xs">
                            {new Date(item.createdAt).toLocaleString("en-US", {
                              month: "short",
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold capitalize">
                            {item.type}
                          </p>
                          <p className="text-xs">
                            {item.paymentGateway || "Manual"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.amount}</p>
                        {/* <button className="text-green-700 text-sm font-medium mt-1 flex items-center gap-1">
                          <Download size={16} /> Receipt
                        </button> */}
                        <p className="text-xs" style={{ fontSize: ".6rem" }}>{formatDate(item.paidAt ?? item.updatedAt)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={userSelfPayPopup} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto overscroll-contain p-6">
          <DialogHeader>
            <DialogTitle>Payment Detail</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Please transfer the due amount to the following account:
            </p>
            <div className="bg-gray-100 p-4 rounded-md">
              {orgAccount?.accountHolderName && (
                <p className="text-gray-600 text-sm">
                  <b>Holder Name:</b> {orgAccount?.accountHolderName}
                </p>
              )}

              {orgAccount?.value && (
                <p className="text-gray-600 text-sm">
                  <b>
                    {orgAccount?.paymentRecieverOption === PaymentRecieverOptions.BANK
                      ? "A/C No"
                      : orgAccount?.paymentRecieverOption === PaymentRecieverOptions.UPIPHONE
                        ? "UPI Phone"
                        : orgAccount?.paymentRecieverOption === PaymentRecieverOptions.UPIQR
                          ? "UPI QR"
                          : "UPI ID"}
                    :
                  </b>{" "}
                  {orgAccount?.paymentRecieverOption === PaymentRecieverOptions.UPIPHONE
                    ? orgAccount?.upiPhoneCountryCode
                    : ""}{" "}
                  {orgAccount?.paymentRecieverOption != PaymentRecieverOptions.UPIQR ? orgAccount?.value : ""}
                </p>
              )}

              {/* Generate QR Code dynamically for UPI QR */}
              {orgAccount?.paymentRecieverOption === PaymentRecieverOptions.UPIQR && (
                <div className="mt-2 flex flex-col items-center">
                  <img
                    src={orgAccount?.value}
                    alt="Generated QR Code"
                    className="w-40 h-40 object-contain "
                  />
                </div>
              )}

              {orgAccount?.ifsc && (
                <p className="text-gray-600 text-sm">
                  <b>IFSC:</b> {orgAccount?.ifsc}
                </p>
              )}
              <p className="mt-4 text-xs">
                After completing the transfer, please notify the property owner to confirm your payment.
              </p>
            </div>
            <Button
              className=" w-full"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
