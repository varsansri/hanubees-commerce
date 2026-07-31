"use client";

import { useTransition } from "react";
import { cancelOrder, setFulfillment, setPayment } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/types";

/**
 * The two things a merchant actually does to an order: mark it fulfilled and
 * mark it paid. Both are one click, and the label states the resulting state
 * rather than a generic verb.
 */
export function OrderActions({ handle, order }: { handle: string; order: Order }) {
  const [pending, start] = useTransition();
  const fulfilled = order.fulfillmentStatus === "fulfilled";
  const paid = order.paymentStatus === "paid";
  const cancelled = order.status === "cancelled";

  if (cancelled) {
    return <span className="text-[13px] text-text-3">This order was cancelled.</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {!paid ? (
        <Button
          size="sm"
          disabled={pending}
          onClick={() => start(() => void setPayment(handle, order.id, "paid"))}
        >
          Mark paid
        </Button>
      ) : null}

      <Button
        size="sm"
        variant={fulfilled ? "secondary" : "primary"}
        disabled={pending}
        onClick={() =>
          start(() =>
            void setFulfillment(handle, order.id, fulfilled ? "unfulfilled" : "fulfilled"),
          )
        }
      >
        {pending ? "Working…" : fulfilled ? "Undo fulfilment" : "Mark fulfilled"}
      </Button>

      {!fulfilled ? (
        <Button
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() => start(() => void cancelOrder(handle, order.id))}
        >
          Cancel order
        </Button>
      ) : null}
    </div>
  );
}
