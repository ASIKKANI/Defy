import React, { createContext, useContext, useState } from 'react';
import PaymentModal from '../components/Common/PaymentModal';
import { useAccess } from './AccessContext';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
    const { upgradeToPro } = useAccess();
    const [paymentConfig, setPaymentConfig] = useState({
        isOpen: false,
        planName: "Premium Model Access",
        amount: "249.99"
    });

    const openPayment = (config = {}) => {
        setPaymentConfig({
            isOpen: true,
            planName: config.planName || "Premium Model Access",
            amount: config.amount || "249.99"
        });
    };

    const closePayment = () => {
        setPaymentConfig(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <PaymentContext.Provider value={{ openPayment, closePayment }}>
            {children}
            <PaymentModal
                isOpen={paymentConfig.isOpen}
                onClose={closePayment}
                planName={paymentConfig.planName}
                amount={paymentConfig.amount}
                onSuccess={upgradeToPro}
            />
        </PaymentContext.Provider>
    );
};
