import "./OrderCard.css"
import { formatDate } from "../../utils/format"

export default function OrderCard({order}) {
    return (
        <div className="order-card">
            <div>
                <h3>Order #{order.id}</h3>
                <p>Date: {formatDate(order.createdAt)}</p>
                <p>Total: ${parseFloat(order.totalPrice).toFixed(2)}</p>
            </div>
            <p className="order-status">{order.status}</p>
        </div>
    )
}