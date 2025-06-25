import "./OrderDisplay.css"
import OrderCard from "../OrderCard/OrderCard";

export default function OrderDisplay({orders}) {
    console.log(orders);
    return (
        <div className="order-list">
        <h2>Past Orders</h2>
        <h4>Review your previous purchases</h4>
            {orders.map( (order) => (
                <OrderCard order={order} />
            ))}
        </div>
    )
}