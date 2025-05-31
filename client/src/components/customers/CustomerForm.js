import axios from "axios";
import React from "react";

function CustomerForm({getCustomers}) {
    async function saveCustomer(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            await axios.post("http://localhost:5000/customer", {
                name: formData.get("name")
            });
            getCustomers();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={saveCustomer}>
            <input
                type="text"
                name="name"
                placeholder="Customer name"
                required
            />
            <button type="submit">Submit Customer</button>
        </form>
    );
}

export default CustomerForm;