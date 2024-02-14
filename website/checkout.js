window.addEventListener('DOMContentLoaded', function () {
    const stripe = Stripe("pk_live_51O3edCFbwylNhfAipdESbxMRmxXx0gnXjhOLK2dfKnvyfIeGOb8vSCXECbWjQ391gYVHOOt7yGERHp2EJZNyseXS00cmfKIYfi");
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');
    const quantityInput = document.getElementById('quantity');
    const email = document.getElementById('email');
    const size = document.getElementById('size');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const address2 = document.getElementById('address2');
    const country = document.getElementById('country');
    const state = document.getElementById('state');
    const zip = document.getElementById('zip');
    const form = document.getElementById('paymentdiv');
    const formtwo = document.getElementById('payment-form')
    const errorDiv = document.getElementById('error');

    let quantity;

    quantityInput.addEventListener('input', function () {
        quantity = quantityInput.value;
    });

    formtwo.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            errorDiv.textContent = "Please fill out all required fields.";
            return;
        }

        if (!formtwo.checkValidity()) {
            errorDiv.textContent = "Please fill out all required fields.";
            return;
        }

        if (size.value === "") {
            errorDiv.textContent = "Please select a size.";
            return;
        }

        if (firstName.value === "" || lastName.value === "" || email.value === "" || address.value === "" || country.value === "" || state.value === "" || zip.value === "") {
            errorDiv.textContent = "Please fill out all required fields.";
            return;
        }

        formtwo.querySelector('button').disabled = true;

        const formData = {
            amount: 4499 * quantityInput.value,
            quantity: quantityInput.value,
            size: size.value,
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            address: address.value,
            address2: address2.value,
            country: country.value,
            state: state.value,
            zip: zip.value,
        };

        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.error) {
            errorDiv.textContent = data.error;
            form.querySelector('button').disabled = false;
        } else {
            const result = await stripe.confirmCardPayment(data.client_secret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: email.value,
                        name: `${firstName.value} ${lastName.value}, ${size.value}`,
                        address: {
                            line1: address.value,
                            line2: address2.value,
                            city: state.value,
                            state: state.value,
                            country: country.value,
                            postal_code: zip.value,
                        }
                    }
                },
            });

            if (result.error) {
                errorDiv.textContent = result.error.message;
                form.querySelector('button').disabled = false;
            } else {
                errorDiv.textContent = "";
                window.location.href = "./after_payment.html";
            }
        }
    });
});
