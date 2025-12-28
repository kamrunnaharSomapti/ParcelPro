import { useNavigate } from "react-router-dom";
import { CustomerDashboard } from "../../components/customer/CustomerDashboard";

export default function CustomerPage() {


    return (
        <div className="">
            <div className="bg-gray-300 p-6">
                <CustomerDashboard />
            </div>
        </div>
    );
}
